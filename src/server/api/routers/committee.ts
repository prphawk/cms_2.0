import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc';
import { _deactivateMembershipsByCommittee, membershipRouter } from './membership';
import { prisma } from '~/server/db';

export const _findUniqueCommittee = async (committee_id: number) => {
  return await prisma.committee.findUnique({
    where: { id: committee_id },
  });
};

export const committeeRouter = createTRPCRouter({
  getOne: protectedProcedure.input(z.object({ id: z.number() })).query(({ ctx, input }) => {
    return ctx.prisma.committee.findUnique({
      where: { id: input.id },
      include: {
        members: { include: { employee: true } },
      },
    });
  }),

  getAllActive: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.committee.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
      include: {
        members: {
          select: { employee: true },
        },
      },
    });
  }),

  getOptions: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.committee.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
      },
    });
  }),

  /* 
    TODO adicionar as nested?
    members?: MembershipCreateNestedManyWithoutCommitteeInput
    committee_template?: CommitteeTemplateCreateNestedOneWithoutCommitteesInput 
  */
  create: protectedProcedure
    .input(
      z.object({
        bond: z.string(),
        name: z.string(),
        begin_date: z.optional(z.date()),
        end_date: z.optional(z.date()),
        ordinance: z.optional(z.string()),
        observations: z.optional(z.string()),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.committee.create({ data: input });
    }),

  // TODO adicionar as nested?
  // members?: MembershipCreateNestedManyWithoutCommitteeInput
  // committee_template?: CommitteeTemplateCreateNestedOneWithoutCommitteesInput
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        bond: z.optional(z.string()),
        name: z.optional(z.string()),
        begin_date: z.optional(z.date()),
        end_date: z.optional(z.date()),
        ordinance: z.optional(z.string()),
        observations: z.optional(z.string()),
        is_active: z.optional(z.boolean()),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.committee.update({ where: { id }, data });
    }),

  // delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => {
  //   return ctx.prisma.committee.delete({ where: input });
  // }),

  deactivate: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      await _deactivateMembershipsByCommittee(id);

      return await ctx.prisma.committee.update({
        where: { id },
        data: { is_active: false, end_date: new Date() },
      });

      // TODO desativar memberships dessa comissão
    }),
});
