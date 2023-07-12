import { Committee, Employee } from '@prisma/client';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { _deactivateMembershipsByEmployee } from './membership';

type commType = {
  role: string | null;
  begin_date: Date | null;
  observations: string | null;
  is_active: boolean;
  committee: {
    id: number;
    name: string;
  };
};

export const employeeRouter = createTRPCRouter({
  getOne: protectedProcedure.input(z.object({ id: z.number() })).query(({ ctx, input }) => {
    return ctx.prisma.employee.findUnique({
      where: { id: input.id },
      include: {
        committees: { include: { committee: true } },
      },
    });
  }),

  getAllActive: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.employee.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
      include: {
        committees: {
          include: { committee: true },
        },
      },
    });
  }),

  getOptions: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.employee.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
      },
    });
  }),

  create: protectedProcedure.input(z.object({ name: z.string() })).mutation(({ ctx, input }) => {
    return ctx.prisma.employee.create({ data: input });
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.optional(z.string()),
        is_active: z.optional(z.boolean()),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.employee.update({ where: { id }, data });
    }),

  // delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => {
  //   return ctx.prisma.employee.delete({ where: input });
  // }),

  deactivate: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      await _deactivateMembershipsByEmployee(id);

      return await ctx.prisma.employee.update({ where: { id }, data: { is_active: false } });
    }),

  //get (Active Employee only) Membership History per Employee
  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const queryResult = await ctx.prisma.employee.findMany({
      select: {
        id: true,
        name: true,
        committees: {
          select: {
            role: true,
            begin_date: true,
            observations: true,
            is_active: true,
            committee: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        is_active: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    if (!queryResult) return;

    const employeesHistory = queryResult.map((e) => {
      const committeesByActivity = e.committees.reduce(
        (obj, currComm) => {
          obj[currComm.is_active ? 'active' : 'inactive'].push(currComm);
          return obj;
        },
        { active: new Array<commType>(), inactive: new Array<commType>() },
      );
      return {
        ...e,
        committees: committeesByActivity,
      };
    });

    return employeesHistory;
  }),
});
