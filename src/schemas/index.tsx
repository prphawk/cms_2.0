import { z } from 'zod'
import { CommitteeHeaders, MembershipHeaders } from '~/constants/headers'

export const FilterSchema = z.object({
  is_active: z.optional(z.boolean()),
  is_temporary: z.optional(z.boolean())
})

export const TemplateSchema = z.object({
  template: z.object({
    id: z.number(),
    name: z.string()
  })
})

export const CreateTemplateFormSchema = z.object({
  id: z.number().optional(),
  name: z
    .string({ required_error: `${CommitteeHeaders.TEMPLATE_NAME} é obrigatório` })
    .trim()
    .min(1, { message: `${CommitteeHeaders.TEMPLATE_NAME} é obrigatório` })
})

export const CreateEmployeeFormSchema = z.object({
  id: z.number().optional(),
  name: z
    .string({ required_error: `${MembershipHeaders.EMPLOYEE_NAME} é obrigatório` })
    .trim()
    .min(1, { message: `${MembershipHeaders.EMPLOYEE_NAME} é obrigatório` })
})

export const DateSchema = z
  .object({
    begin_date: z.string().optional(),
    end_date: z.string().optional()
  })
  .optional()
