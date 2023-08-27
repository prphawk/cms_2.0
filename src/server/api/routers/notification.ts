import { Notification } from '@prisma/client'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc'
import { sendImminentElectionNotification } from '~/server/auth/email'
import { prisma } from '~/server/db'
import { _addDays, _subDays } from '~/utils/string'

const _updateLastSent = (notifications: Notification[]) => {
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

const _getUsersForNotifications = () => {
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

export const _createNotification = async (
  committee_id: number,
  user_id: string,
  isOn?: boolean
) => {
  return prisma.notification.create({
    data: {
      isOn,
      committee: {
        connect: {
          id: committee_id
        }
      },
      user: {
        connect: {
          id: user_id
        }
      }
    }
  })
}

export const _notificationsSuccession = async (old_committee_id: number, committee_id: number) => {
  return prisma.notification.updateMany({
    where: { committee_id: old_committee_id },
    data: {
      committee_id
    }
  })
}

export const _deleteManyNofifications = async (committee_id: number) => {
  return prisma.notification.deleteMany({
    where: { committee_id }
  })
}

export const notificationRouter = createTRPCRouter({
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

  create: protectedProcedure
    .input(
      z.object({
        committee: z.object({
          id: z.number(),
          end_date: z.date().optional()
        }),
        isOn: z.boolean().optional()
      })
    )
    .mutation(({ ctx, input }) => {
      const user = ctx.session.user
      if (!input.committee.end_date) return
      return _createNotification(input.committee.id, user.id, input.isOn)
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        isOn: z.boolean()
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.notification.update({
        where: { id: input.id },
        data: {
          isOn: input.isOn
        }
      })
    }),

  delete: protectedProcedure
    .input(
      z.object({
        committee_id: z.number()
      })
    )
    .mutation(({ ctx, input }) => {
      return _deleteManyNofifications(input.committee_id)
    }),

  sendNotifications: publicProcedure.mutation(async ({ ctx }) => {
    const usersWithNotifs = await _getUsersForNotifications()
    const promises = usersWithNotifs.map(async (u) => {
      const committees = u.notifications.map((n) => n.committee)
      if (committees.length) {
        console.log(`Sending ${committees.length} e-mails to user...`)
        await sendImminentElectionNotification(u.email!, committees)
        return _updateLastSent(u.notifications)
      }
    })
    return promises
  })
})
