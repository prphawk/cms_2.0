import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { prisma } from '~/server/db'
import { _findUniqueCommittee } from './committee'

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
        begin_date: z.date(),
        end_date: z.date(),
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
        begin_date: z.date(),
        end_date: z.date(),
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
          committee: { committee_template_id: template_id },
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

  getRoleOptions: protectedProcedure.query(async ({ ctx, input }) => {
    const result = await ctx.prisma.membership.findMany({
      select: {
        role: true
      },
      orderBy: {
        role: 'asc'
      },
      distinct: ['role']
    })
    return result.map((e) => e.role)
  })
})
