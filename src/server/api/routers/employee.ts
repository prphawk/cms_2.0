import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { _deactivateMembershipsByEmployee } from './membership'

export const employeeRouter = createTRPCRouter({
  getOne: protectedProcedure.input(z.object({ id: z.number() })).query(({ ctx, input }) => {
    return ctx.prisma.employee.findUnique({
      where: { id: input.id },
      include: {
        committees: { include: { committee: true } }
      }
    })
  }),

  getOptions: protectedProcedure
    .input(z.object({ committee_id: z.number().optional(), membership_id: z.number().optional() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.employee.findMany({
        distinct: ['name'],
        where: { is_active: true },
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          committees: {
            where: {
              //NOT: { id: input.membership_id },
              committee_id: input.committee_id,
              is_active: true
            },
            select: {
              committee_id: true
            }
          }
        }
      })
    }),

  create: protectedProcedure.input(z.object({ name: z.string() })).mutation(({ ctx, input }) => {
    return ctx.prisma.employee.create({ data: input })
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.optional(z.string())
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.employee.update({ where: { id }, data })
    }),

  // delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => {
  //   return ctx.prisma.employee.delete({ where: input });
  // }),

  deactivate: protectedProcedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input

      await _deactivateMembershipsByEmployee(id)

      return await ctx.prisma.employee.update({ where: { id }, data: { is_active: false } })
    })
})
