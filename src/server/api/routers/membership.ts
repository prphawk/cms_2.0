import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { prisma } from '~/server/db'
import { _findUniqueCommittee } from './committee'
import { DateSchema } from '~/schemas'
import { _toDateFromForm } from '~/utils/string'

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
      z.object({
        committee_id: z.number(),
        employee: z.object({ id: z.number().optional(), name: z.string() }),
        role: z.string(),
        begin_date: z.date().optional(),
        end_date: z.date().optional(),
        ordinance: z.string().optional(),
        observations: z.optional(z.string())
      })
    )
    .mutation(({ ctx, input }) => {
      const { employee, committee_id, ...data } = input
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
          begin_date: {
            gte: _toDateFromForm(input.dates.begin_date)
          },
          end_date: {
            lte: _toDateFromForm(input.dates.end_date)
          }
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

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        begin_date: z.date().optional(),
        end_date: z.date().optional(),
        role: z.string(),
        ordinance: z.string().optional(),
        observations: z.string().optional()
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input

      return ctx.prisma.membership.update({
        where: { id },
        data
      })
    }),

  // delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => {
  //   return ctx.prisma.membership.delete({ employee_id_committee_id: { employee_id, committee_id } });
  // }),

  deactivate: protectedProcedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .mutation(({ ctx, input }) => {
      const { id } = input
      return ctx.prisma.membership.update({
        where: { id },
        data: { is_active: false }
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

      return ctx.prisma.membership.findMany({
        where: {
          committee: { template_id: template_id },
          role
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
    })
})
