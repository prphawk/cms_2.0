import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc';

export const templateRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.committeeTemplate.findMany();
  }),

  create: protectedProcedure
    .input(
      z.object({
        committee_ids: z.number().array(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.committeeTemplate.create({
        data: {
          committees: {
            connect: input.committee_ids.map((c: number) => {
              return { id: c };
            }),
          },
        },
      });
    }),
});
