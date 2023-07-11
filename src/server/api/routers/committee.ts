import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc';

export const committeeRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.committee.findMany();
  }),

  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .output(
      z.object({
        greeting: z.string(),
      }),
    )
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return 'you can now see this secret message!';
  }),
});
