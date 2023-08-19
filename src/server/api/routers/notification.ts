import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { prisma } from '~/server/db'
import { _addMonths as _addDays, _subDays } from '~/utils/string'

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
        committee_id: z.number(),
        isOn: z.boolean().optional()
      })
    )
    .mutation(({ ctx, input }) => {
      const user = ctx.session.user
      return _createNotification(input.committee_id, user.id, input.isOn)
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
    })
})
