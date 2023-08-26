import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { prisma } from '~/server/db'
import { _findUniqueCommittee } from './committee'
import { DateSchema } from '~/schemas'
import { _toDateFromForm } from '~/utils/string'
import { MembershipFormSchema } from '~/schemas/membership'
import { getDatesQuery } from '../queries'
import { Membership } from '@prisma/client'

export const _deleteMembershipsByCommittee = async (committee_id: number) => {
  return prisma.membership.deleteMany({
    where: { committee: { id: committee_id } }
  })
}

export const _deactivateMembershipsByCommittee = async (committee_id: number) => {
  return await prisma.membership.updateMany({
    where: { committee: { id: committee_id } },
    data: { is_active: false }
  })
}
export const _deactivateMembershipsByEmployee = async (employee_id: number) => {
  return await prisma.membership.updateMany({
    where: { employee: { id: employee_id } },
    data: { is_active: false }
  })
}

export const membershipRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z
        .object({
          committee_id: z.number()
        })
        .merge(MembershipFormSchema)
    )
    .mutation(({ ctx, input }) => {
      const { id, employee, committee_id, ...data } = input
      const employee_params = employee.id
        ? {
            connect: { id: employee.id }
          }
        : {
            create: {
              name: employee.name
            }
          }
      return ctx.prisma.membership.create({
        data: {
          committee: { connect: { id: committee_id } },
          employee: employee_params,
          ...data
        }
      })
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        is_employee_active: z.boolean().optional(),
        is_membership_active: z.boolean().optional(),
        roles: z.string().array().optional(),
        dates: DateSchema
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.membership.findMany({
        where: {
          is_active: input.is_membership_active,
          employee: {
            is_active: input.is_employee_active
          },
          role: { in: input.roles },
          ...getDatesQuery(input.dates)
        },
        orderBy: {
          employee: { name: 'asc' }
        },
        include: {
          committee: true,
          employee: {
            include: {
              _count: true
            }
          }
        }
      })
    }),

  groupByActivity: protectedProcedure
    .input(z.object({ committee_id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.membership.groupBy({
        by: ['is_active'],
        where: { committee_id: input.committee_id },
        _count: {
          is_active: true
        },
        orderBy: {
          is_active: 'desc'
        }
      })
    }),

  update: protectedProcedure.input(MembershipFormSchema).mutation(({ ctx, input }) => {
    const { id, employee, is_active, ...data } = input

    const employee_param = employee.id
      ? { connect: { id: employee.id } }
      : { create: { name: employee.name } }

    return ctx.prisma.membership.update({
      where: { id },
      data: { ...data, employee: employee_param }
    })
  }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => {
    return ctx.prisma.membership.delete({
      where: {
        id: input.id
      }
    })
  }),

  deactivate: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        is_active: z.boolean().optional()
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.membership.update({
        where: { id: input.id },
        data: { is_active: !!input.is_active }
      })
    }),

  getRoleHistory: protectedProcedure
    .input(
      z.object({
        role: z.string(),
        template_id: z.number(),
        dates: DateSchema
      })
    )
    .query(({ ctx, input }) => {
      const { role, template_id } = input

      return ctx.prisma.membership.findMany({
        where: {
          committee: { template_id: template_id },
          role,
          ...getDatesQuery(input.dates)
        },
        include: {
          committee: true,
          employee: true
        }
      })
    }),

  getRoleOptionsByCommittee: protectedProcedure
    .input(
      z.object({
        committee_id: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.membership.findMany({
        where: {
          committee: { id: input.committee_id }
        },
        select: {
          role: true
        },
        orderBy: {
          role: 'asc'
        },
        distinct: ['role']
      })
      return result.map((e) => {
        return { label: e.role, value: e.role }
      })
    }),

  getRoleOptions: protectedProcedure
    .input(
      z
        .object({
          filterFormat: z.boolean().optional()
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.membership.findMany({
        select: {
          role: true
        },
        orderBy: {
          role: 'asc'
        },
        distinct: ['role']
      })
      return result.map((e) => {
        return input?.filterFormat ? { label: e.role, value: e.role } : e.role
      })
    }),

  getActiveMembership: protectedProcedure
    .input(
      z.object({
        committee_id: z.number(),
        employee_id: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      return prisma.membership.findFirst({
        where: {
          is_active: true,
          committee_id: input.committee_id,
          employee_id: input.employee_id
        }
      })
    })
})
