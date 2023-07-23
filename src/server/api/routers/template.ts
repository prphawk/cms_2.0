import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { prisma } from '~/server/db';

export const _getTemplateByName = async (name: string) => {
  return await prisma.committeeTemplate.findFirst({ where: { name } });
};

// export const _createTemplate = async (name: string) => {
//   return await prisma.committeeTemplate.create({ data: { name } });
// };

export const templateRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        template_id: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.committeeTemplate.findFirst({
        where: {
          id: input.template_id,
        },
        include: {
          committees: { select: { id: true } },
        },
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.committeeTemplate.findMany();
  }),

  create: protectedProcedure
    .input(
      z.object({
        committee_ids: z.number().array(),
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.committeeTemplate.create({
        data: {
          name: input.name,
          committees: {
            connect: input.committee_ids.map((c: number) => {
              return { id: c };
            }),
          },
        },
      });
    }),

  getRoleHistory: protectedProcedure
    .input(
      z.object({
        role: z.string(),
        template_id: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      const { role, template_id } = input;

      return ctx.prisma.committeeTemplate.findUnique({
        where: {
          id: template_id,
        },
        include: {
          committees: {
            where: { members: { every: { role } } },
            include: { members: true },
          },
        },
      });
    }),
});
