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

  getAll: protectedProcedure
    .input(
      z.object({
        is_active: z.optional(z.boolean()),
        is_temporary: z.optional(z.boolean()),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.committee.findMany({
        where: {
          is_active: input.is_active,
          committee_template:
            input.is_temporary === false ? { isNot: null } : input.is_temporary && { is: null },
        },
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
      if (!input.end_date) {
        input.begin_date = input.end_date = input.begin_date || new Date();
        input.end_date.setFullYear(input.begin_date.getFullYear() + 2);
      }
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
        // is_active: z.optional(z.boolean()),
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
        data: {
          is_active: false,
          //end_date: new Date()
        },
      });
    }),

  deactivateMany: protectedProcedure
    .input(
      z.object({
        ids: z.number().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { ids } = input;

      return ids.map(async (id) => {
        await _deactivateMembershipsByCommittee(id);
        await ctx.prisma.committee.update({
          where: { id },
          data: {
            is_active: false,
            //end_date: new Date()
          },
        });
      });
    }),
});
