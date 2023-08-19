import { number, z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { _deactivateMembershipsByCommittee } from './membership'
import { prisma } from '~/server/db'
import { _getTemplateByName } from './template'
import { Prisma } from '@prisma/client'
import { CommitteeSchema } from '~/schemas/committee'
import { MembershipArraySchema } from '~/schemas/membership'
import { FilterSchema, TemplateSchema, DateSchema } from '~/schemas'
import { _deleteManyNofifications, _notificationsSuccession } from './notification'
import { _toDateFromForm } from '~/utils/string'

export const _findUniqueCommittee = async (committee_id: number) => {
  return await prisma.committee.findUnique({
    where: { id: committee_id }
  })
}

const _deactivateCommittee = async (committee_id: number) => {
  return await prisma.committee.update({
    where: { id: committee_id },
    data: {
      is_active: false
      //end_date: new Date() //TODO perguntar se é necessário?
    }
  })
}

export const committeeRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        is_active: z.boolean().optional(),
        is_temporary: z.boolean().optional(),
        roles: z.string().array().optional(),
        dates: DateSchema
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.committee.findUnique({
        where: {
          id: input.id
        },
        include: {
          members: {
            include: { employee: true },
            where: {
              is_active: input.is_active,
              role: { in: input.roles },
              NOT: {
                OR: [
                  {
                    begin_date: {
                      gt: _toDateFromForm(input.dates?.begin_date)
                    }
                  },
                  {
                    end_date: {
                      lt: _toDateFromForm(input.dates?.end_date)
                    }
                  }
                ]
              }
            }
          },
          template: true
        }
      })
    }),

  groupByActivity: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.committee.groupBy({
      by: ['is_active'],
      _count: {
        is_active: true
      },
      orderBy: {
        is_active: 'desc'
      }
    })
  }),

  getAll: protectedProcedure
    .input(FilterSchema.merge(z.object({ dates: DateSchema })))
    .query(async ({ ctx, input }) => {
      const template =
        input.is_temporary === false ? { isNot: null } : input.is_temporary && { is: null }
      const result = await ctx.prisma.committee.findMany({
        where: {
          is_active: input.is_active,
          template,
          NOT: {
            OR: [
              {
                begin_date: {
                  gt: _toDateFromForm(input.dates?.begin_date)
                }
              },
              {
                end_date: {
                  lt: _toDateFromForm(input.dates?.end_date)
                }
              }
            ]
          }
        },
        orderBy: { name: 'asc' },
        include: {
          members: {
            select: { is_active: true } //for filtering the counting above
          }
        }
      })

      return result.map((c) => {
        const members_count = { active_count: 0, total_count: c.members.length }
        members_count.active_count = c.members.reduce(
          (acum, curr) => acum + Number(curr.is_active),
          0
        )
        return { ...c, members: undefined, members_count }
      })
    }),

  getOptions: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.committee.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true
      }
    })
  }),

  create: protectedProcedure.input(CommitteeSchema).mutation(async ({ ctx, input }) => {
    const { template_name, ...rest } = input

    const committee = {
      ...rest,
      is_active: true
    } as Prisma.CommitteeCreateInput

    if (template_name) {
      const templateSearch = await _getTemplateByName(template_name)
      committee.template = templateSearch
        ? { connect: { id: templateSearch.id } }
        : { create: { name: template_name } }
    }
    return ctx.prisma.committee.create({ data: committee })
  }),

  succession: protectedProcedure
    .input(
      CommitteeSchema.innerType()
        .merge(MembershipArraySchema)
        .merge(TemplateSchema)
        .merge(
          z.object({
            old_committee_id: z.number()
          })
        )
    )
    .mutation(async ({ ctx, input }) => {
      const { template, members, template_name, old_committee_id, ...data } = input

      const reduceResult = members.reduce(
        (obj, curr) => {
          const { employee, ...rest } = curr
          obj[curr.employee.id ? 'membershipsWithEmployee' : 'membershipsWithoutEmployee'].push(
            curr.employee.id
              ? { employee_id: curr.employee.id, ...rest } //prisma complains about the additional employee object
              : { employee_id: curr.employee.id, employee, ...rest }
          )
          return obj
        },
        {
          membershipsWithEmployee: new Array<any>(),
          membershipsWithoutEmployee: new Array<any>()
        }
      )

      const committee = await ctx.prisma.committee.create({
        data: {
          ...data,
          template: { connect: { id: template.id } },
          members: { createMany: { data: reduceResult.membershipsWithEmployee } }
        }
      })

      _notificationsSuccession(old_committee_id, committee.id)

      const promises = reduceResult.membershipsWithoutEmployee.map((m) => {
        const { employee, employee_id, ...rest } = m
        return ctx.prisma.membership.create({
          data: {
            ...rest,
            employee: { create: { name: employee.name } },
            committee: { connect: { id: committee.id } }
          }
        })
      })

      await Promise.all(promises)

      return committee
    }),

  update: protectedProcedure
    .input(CommitteeSchema.innerType().merge(z.object({ id: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const { template_name, id, ...rest } = input
      const committee = rest as Prisma.CommitteeUpdateInput

      if (!template_name) {
        committee.template = { disconnect: true }
      } else {
        //TODO fazer a mesma coisa q isso pra poder dar a chance de editar um employee numa membership
        const templateSearch = await _getTemplateByName(template_name)
        committee.template = templateSearch
          ? { connect: { id: templateSearch.id } }
          : { create: { name: template_name } }
      }

      return ctx.prisma.committee.update({ where: { id }, data: committee })
    }),

  deactivate: protectedProcedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input

      await _deactivateMembershipsByCommittee(id)
      await _deactivateCommittee(id)
      _deleteManyNofifications(id)
    }),

  getRoleHistory: protectedProcedure
    .input(
      z.object({
        role: z.string(),
        committee_id: z.number()
      })
    )
    .query(({ ctx, input }) => {
      const { role, committee_id } = input

      return ctx.prisma.committee.findUnique({
        where: {
          id: committee_id
        },
        include: {
          members: {
            where: { role },
            include: { employee: true },
            orderBy: {
              begin_date: 'desc'
            }
          }
        }
      })
    })

  // delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => {
  //   return ctx.prisma.committee.delete({ where: input });
  // }),
})
