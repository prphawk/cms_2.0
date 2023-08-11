import { Committee, Template } from '@prisma/client'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc'
import { prisma } from '~/server/db'
import { _addMonths } from '~/utils/string'

export const _getTemplateByName = async (name: string) => {
  return await prisma.template.findFirst({ where: { name } })
}

export const getNotifications = async () => {
  const XMonthsFromNow = _addMonths(new Date(), 3)
  const data = await prisma.template.findMany({
    where: {
      committees: {
        every: {
          is_active: true,
          end_date: {
            lte: XMonthsFromNow
          }
        }
      }
    },
    include: {
      committees: {
        where: { is_active: true }
      }
    }
  })

  return data.map((t) => {
    const committee = t.committees.length ? t.committees[0] : undefined // last active committee
    const { committees, ...rest } = t
    return { committee, ...rest }
  })
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

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.template.findMany({
      include: {
        _count: true,
        committees: {
          where: { is_active: true }
        }
      }
    })

    return data.map((t) => {
      const committee = t.committees.length ? t.committees[0] : undefined // last active committee
      const { committees, ...rest } = t
      return { committee, ...rest }
    })
  }),

  create: protectedProcedure
    .input(
      z.object({
        committee_ids: z.number().array(),
        name: z.string()
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.template.create({
        data: {
          name: input.name,
          committees: {
            connect: input.committee_ids.map((c: number) => {
              return { id: c }
            })
          },
          notification: { create: {} }
        }
      })
    }),

  getRoleHistory: protectedProcedure
    .input(
      z.object({
        role: z.string(),
        template_id: z.number()
      })
    )
    .query(({ ctx, input }) => {
      const { role, template_id } = input

      return ctx.prisma.template.findUnique({
        where: {
          id: template_id
        },
        include: {
          committees: {
            where: { members: { every: { role } } },
            include: { members: true }
          }
        }
      })
    })
})
