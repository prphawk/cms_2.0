import { Notification } from '@prisma/client'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { prisma } from '~/server/db'
import { _addDays, _subDays } from '~/utils/string'
import { _createNotification } from './notification'

export const _getTemplateByName = async (name: string) => {
  return await prisma.template.findFirst({ where: { name } })
}

export const updateLastSent = (notifications: Notification[]) => {
  const now = new Date()
  const ids = notifications.map((t) => t.id)
  return prisma.notification.updateMany({
    where: {
      id: {
        in: ids
      }
    },
    data: {
      lastSentOn: now
    }
  })
}

export const getUsersForNotifications = () => {
  const now = new Date()
  const XDaysBeforeNow = _subDays(now, Number(process.env.DAYS) || 30)
  const XDaysFromNow = _addDays(now, Number(process.env.DAYS) || 30)
  return prisma.user.findMany({
    where: {
      email: {
        not: null
      },
      notifications: {
        some: { isOn: true }
      }
    },
    include: {
      notifications: {
        include: { committee: true },
        where: {
          AND: [
            { isOn: true },
            {
              OR: [
                {
                  lastSentOn: {
                    lt: XDaysBeforeNow
                  }
                },
                {
                  lastSentOn: {
                    equals: null
                  }
                }
              ]
            },
            {
              committee: {
                is_active: true,
                end_date: {
                  lt: XDaysFromNow
                }
              }
            }
          ]
        }
      }
    }
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

  getOptions: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.template.findMany({
      // distinct: ['name'],
      select: {
        id: true,
        name: true,
        committees: {
          where: {
            is_active: true
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
