import { Committee, Notification, Template, User } from '@prisma/client'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc'
import { prisma } from '~/server/db'
import { _addMonths as _addDays, _subDays } from '~/utils/string'

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
            {
              OR: [
                {
                  isOn: true,
                  lastSentOn: {
                    lt: XDaysBeforeNow
                  }
                },
                {
                  isOn: true,
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

export const getCommitteesForNotifications = async (user: User) => {
  const now = new Date()
  const XDaysBeforeNow = _subDays(now, Number(process.env.DAYS) || 30)
  const XDaysFromNow = _addDays(now, Number(process.env.DAYS) || 30)
  return await prisma.committee.findMany({
    where: {
      is_active: true,
      end_date: {
        lt: XDaysFromNow
      },
      notifications: {
        some: {
          isOn: true
        }
      }
    }
  })
}

export const isEligibleToSend = async (user: User) => {
  const now = new Date()
  const XDaysBeforeNow = _subDays(now, Number(process.env.DAYS) || 30)
  return await prisma.notification.findMany({
    where: {
      OR: [
        {
          isOn: true,
          lastSentOn: {
            lt: XDaysBeforeNow
          }
        },
        {
          isOn: true,
          lastSentOn: {
            equals: null
          }
        }
      ]
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
      select: {
        name: true
      }
    })
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user

    const data = await ctx.prisma.template.findMany({
      include: {
        _count: { select: { committees: true } }
      }
    })

    return data.map(async (t) => {
      const committee = await ctx.prisma.committee.findFirst({
        where: {
          template_id: t.id,
          is_active: true
        }
      })

      let notification

      if (committee) {
        notification = await ctx.prisma.notification.findFirst({
          where: {
            committee_id: committee.id,
            user_id: user.id
          }
        })

        if (!notification) {
          //TODO create notification
          console.log('a')
        } else {
          return {
            ...t,
            committee,
            notification
          }
        }
      }
    })

    //const committee = t.committees.length ? t.committees[0] : undefined // last active committee
    //   const notification = committee?.notifications.length ? committee.notifications[0] : undefined // unique notification
    //   const { committees, ...rest } = t
    //   const { notifications, ...restCommittee } = committee
    //   return { committee: { ...committee, notification }, ...rest }
    // })
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
          //notification: { create: {} }
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
          // notification: {
          //   update: {
          //     isOn: input.notification?.isOn
          //   }
          // }
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
