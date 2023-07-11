import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { prisma } from '~/server/db';

export const deactivateMembershipsByCommittee = async (committee_id: number) => {
  return await prisma.membership.updateMany({
    where: { committee: { id: committee_id } },
    data: { is_active: false },
  });
};
export const deactivateMembershipsByEmployee = async (employee_id: number) => {
  return await prisma.membership.updateMany({
    where: { employee: { id: employee_id } },
    data: { is_active: false },
  });
};

export const membershipRouter = createTRPCRouter({
  /**
    role?: string | null | undefined;
    begin_date?: string | Date | null | undefined;
    term?: number | null | undefined;
    observations?: string | null | undefined;
    is_active?: boolean | undefined;
    employee: EmployeeCreateNestedOneWithoutCommitteesInput;
    committee: CommitteeCreateNestedOneWithoutMembersInput;
   */

  create: protectedProcedure
    .input(
      z.object({
        employee_id: z.number(),
        committee_id: z.number(),
        role: z.optional(z.string()),
        term: z.optional(z.number()),
        observations: z.optional(z.string()),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { employee_id, committee_id, ...rest } = input;

      return ctx.prisma.membership.create({
        data: {
          employee: { connect: { id: employee_id } },
          committee: { connect: { id: committee_id } },
          ...rest,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        employee_id: z.number(),
        committee_id: z.number(),
        role: z.optional(z.string()),
        term: z.optional(z.number()),
        observations: z.optional(z.string()),
        is_active: z.optional(z.boolean()),
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
          term: true,
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
