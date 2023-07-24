import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { _deactivateMembershipsByCommittee } from './membership';
import { prisma } from '~/server/db';
import { CommitteeSchema } from '~/components/table/committees/committee-dialog';
import { _getTemplateByName } from './template';
import { Prisma } from '@prisma/client';

export const _findUniqueCommittee = async (committee_id: number) => {
  return await prisma.committee.findUnique({
    where: { id: committee_id },
  });
};

export const _deactivateCommittee = async (committee_id: number) => {
  return await prisma.committee.update({
    where: { id: committee_id },
    data: {
      is_active: false,
      //end_date: new Date()
    },
  });
};

export const committeeRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        is_active: z.boolean().optional(),
        is_temporary: z.boolean().optional(),
        roles: z.string().array().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      // const roles_filter = input.roles ? {}

      return ctx.prisma.committee.findUnique({
        where: {
          id: input.id,
        },
        include: {
          members: {
            include: { employee: true },
            where: {
              is_active: input.is_active,
              is_temporary: input.is_temporary,
              role: { in: input.roles },
            },
          },
          committee_template: true,
        },
      });
    }),

  groupByActivity: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.committee.groupBy({
      by: ['is_active'],
      _count: {
        is_active: true,
      },
      orderBy: {
        is_active: 'desc',
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
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.committee.findMany({
        where: {
          is_active: input.is_active,
          committee_template:
            input.is_temporary === false ? { isNot: null } : input.is_temporary && { is: null },
        },
        orderBy: { name: 'asc' },
        include: {
          members: {
            select: { is_active: true }, //TODO just count here
          },
        },
      });

      return result.map((c) => {
        const members_count = { active_count: 0, total_count: c.members.length };
        members_count.active_count = c.members.reduce(
          (acum, curr) => acum + Number(curr.is_active),
          0,
        );
        return { ...c, members_count };
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

  create: protectedProcedure.input(CommitteeSchema).mutation(async ({ ctx, input }) => {
    const committee = {
      bond: input.bond,
      name: input.name,
      begin_date: input.begin_date,
      end_date: input.end_date,
      ordinance: input.ordinance,
      observations: input.observations,
      is_active: true,
    } as Prisma.CommitteeCreateInput;

    if (input.committee_template_name) {
      const templateSearch = await _getTemplateByName(input.committee_template_name);
      committee.committee_template = templateSearch
        ? { connect: { id: templateSearch.id } }
        : { create: { name: input.committee_template_name } };
    }
    return ctx.prisma.committee.create({ data: committee });
  }),

  // TODO adicionar as nested?
  // members?: MembershipCreateNestedManyWithoutCommitteeInput
  // committee_template?: CommitteeTemplateCreateNestedOneWithoutCommitteesInput
  update: protectedProcedure
    .input(CommitteeSchema.innerType().merge(z.object({ id: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const committee: Prisma.CommitteeUpdateInput = {
        bond: input.bond,
        name: input.name,
        begin_date: input.begin_date,
        end_date: input.end_date,
        ordinance: input.ordinance,
        observations: input.observations,
      };

      if (!input.committee_template_name) {
        committee.committee_template = { disconnect: true };
      } else {
        const templateSearch = await _getTemplateByName(input.committee_template_name);
        committee.committee_template = templateSearch
          ? { connect: { id: templateSearch.id } }
          : { create: { name: input.committee_template_name } };
      }

      return ctx.prisma.committee.update({ where: { id: input.id }, data: committee });
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
      await _deactivateCommittee(id);
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

      return ctx.prisma.committee.findUnique({
        where: {
          id: committee_id,
        },
        include: {
          members: {
            where: { role },
            include: { employee: true },
            orderBy: {
              begin_date: 'desc',
            },
          },
        },
      });
    }),
});
