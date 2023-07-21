import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { prisma } from '~/server/db';
import { _findUniqueCommittee } from './committee';

export const _deactivateMembershipsByCommittee = async (committee_id: number) => {
  return await prisma.membership.updateMany({
    where: { committee: { id: committee_id } },
    data: { is_active: false },
  });
};
export const _deactivateMembershipsByEmployee = async (employee_id: number) => {
  return await prisma.membership.updateMany({
    where: { employee: { id: employee_id } },
    data: { is_active: false },
  });
};

export const membershipRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        employee_id: z.number(),
        committee_id: z.number(),
        role: z.optional(z.string()),
        begin_date: z.date(),
        end_date: z.date(),
        is_temporary: z.optional(z.boolean()),
        observations: z.optional(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { employee_id, committee_id, ...rest } = input;

      // if (!rest.begin_date) {
      //   const committee = await _findUniqueCommittee(committee_id);
      //   rest.begin_date = committee?.begin_date ?? undefined;
      // }

      return await ctx.prisma.membership.create({
        data: {
          employee: { connect: { id: employee_id } },
          committee: { connect: { id: committee_id } },
          ...rest,
        },
      });
    }),

  groupByActivity: protectedProcedure
    .input(z.object({ committee_id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.membership.groupBy({
        by: ['is_active'],
        where: { committee_id: input.committee_id },
        _count: {
          is_active: true,
        },
        orderBy: {
          is_active: 'desc',
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        employee_id: z.number(),
        committee_id: z.number(),
        role: z.optional(z.string()),
        is_temporary: z.optional(z.boolean()),
        observations: z.optional(z.string()),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { employee_id, committee_id, ...data } = input;

      return ctx.prisma.membership.update({
        where: { employee_id_committee_id: { employee_id, committee_id } },
        data,
      });
    }),

  // delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => {
  //   return ctx.prisma.membership.delete({ employee_id_committee_id: { employee_id, committee_id } });
  // }),

  deactivate: protectedProcedure
    .input(
      z.object({
        employee_id: z.number(),
        committee_id: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { employee_id, committee_id } = input;
      return ctx.prisma.membership.update({
        where: { employee_id_committee_id: { employee_id, committee_id } },
        data: { is_active: false },
      });
    }),

  getRoleHistory: protectedProcedure
    .input(
      z.object({
        role: z.string(),
        committee_id: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      const { role, committee_id } = input;

      return ctx.prisma.membership.findMany({
        where: {
          committee_id,
          role,
        },
        select: {
          role: true,
          begin_date: true,
          end_date: true,
          is_temporary: true,
          observations: true,
          employee: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          begin_date: 'desc',
        },
      });
    }),
});
