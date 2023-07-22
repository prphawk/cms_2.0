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
  getOneByCommittee: protectedProcedure
    .input(
      z.object({
        committee_id: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.committeeTemplate.findFirst({
        where: {
          committees: { some: { id: input.committee_id } },
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
});
