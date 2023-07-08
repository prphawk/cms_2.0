import { createTRPCRouter } from '~/server/api/trpc';
import { committeeRouter } from './routers/committee';
import { employeeRouter } from './routers/employee';
import { membershipRouter } from './routers/membership';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  committee: committeeRouter,
  employee: employeeRouter,
  membership: membershipRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
