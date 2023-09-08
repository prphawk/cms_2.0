import { Notification } from '@prisma/client'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { prisma } from '~/server/db'
import { _addDays, _subDays } from '~/utils/string'
import { _createNotification } from './notification'

export const _getTemplateByName = async (name: string) => {
  return await prisma.template.findFirst({ where: { name } })
}

export const templateRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        template_id: z.number()
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.template.findFirst({
        where: {
          id: input.template_id
        }
      })
    }),

  getOptions: protectedProcedure
    .input(z.object({ committee_id: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.template.findMany({
        select: {
          id: true,
          name: true,
          committees: {
            where: {
              is_active: true,
              NOT: {
                id: input.committee_id
              }
            },
            select: {
              id: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
    }),

  getAllWithNotifs: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user

    const data = await ctx.prisma.template.findMany({
      include: {
        _count: { select: { committees: true } }
      }
    })

    const promises = data.map(async (t) => {
      const committee = await ctx.prisma.committee.findFirst({
        where: {
          template_id: t.id,
          is_active: true
        },
        orderBy: {
          end_date: 'desc'
        }
      })

      let notification: Notification | null

      if (!committee)
        return {
          ...t
        }

      notification = await ctx.prisma.notification.findUnique({
        where: {
          committee_id_user_id: { committee_id: committee.id, user_id: user.id }
        }
      })

      if (!notification && committee.end_date) {
        notification = await _createNotification(committee.id, user.id)
      }

      return {
        ...t,
        committee,
        notification
      }
    })

    return Promise.all(promises)
  }),

  create: protectedProcedure
    .input(
      z.object({
        committee_ids: z.number().array().optional(),
        name: z.string()
      })
    )
    .mutation(({ ctx, input }) => {
      const commArr = input.committee_ids?.map((c: number) => {
        return { id: c }
      })
      return ctx.prisma.template.create({
        data: {
          name: input.name,
          committees: {
            connect: commArr
          }
        }
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        notification: z
          .object({
            isOn: z.boolean()
          })
          .optional()
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.template.update({
        where: { id: input.id },
        data: {
          name: input.name
        }
      })
    }),

  // getRoleHistory: protectedProcedure
  //   .input(
  //     z.object({
  //       role: z.string(),
  //       template_id: z.number()
  //     })
  //   )
  //   .query(({ ctx, input }) => {
  //     const { role, template_id } = input

  //     return ctx.prisma.template.findUnique({
  //       where: {
  //         id: template_id
  //       },
  //       include: {
  //         committees: {
  //           where: { members: { every: { role } } },
  //           include: { members: true }
  //         }
  //       }
  //     })
  //   }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => {
    return ctx.prisma.template.delete({
      where: {
        id: input.id
      }
    })
  })
})
