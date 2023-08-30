import { z } from 'zod'
import { MembershipHeaders } from '~/constants/headers'

export const EmployeeFormSchema = z.object(
  {
    id: z.number().optional(),
    name: z
      .string({ required_error: `${MembershipHeaders.MEMBER} é obrigatório` })
      .trim()
      .min(1, { message: `${MembershipHeaders.MEMBER} é obrigatório` }),
    committees: z.object({ committee_id: z.number() }).array().optional()
  },
  { required_error: `${MembershipHeaders.MEMBER} é obrigatório` }
)

export const MembershipFormSchema = z.object({
  id: z.number().optional(),
  employee: EmployeeFormSchema,
  role: z
    .string({ required_error: `${MembershipHeaders.ROLE} é obrigatório` })
    .trim()
    .min(1, { message: `${MembershipHeaders.ROLE} é obrigatório` }),
  begin_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  observations: z.string().optional(),
  ordinance: z.string().optional(),
  is_active: z.boolean().optional()
})

export const MembershipFormSchemaEffect = MembershipFormSchema.refine(
  (data) => (data.begin_date || 0) < (data.end_date || new Date()),
  {
    message: `${MembershipHeaders.END_DATE} não pode ocorrer antes de ${MembershipHeaders.BEGIN_DATE}.`,
    path: ['end_date']
  }
).refine((data) => !(data.is_active && data.employee?.committees?.length), {
  message: `Este servidor já possui participação ativa no mandato. Selecione outro ou desative esta participação.`,
  path: ['employee']
})

export const MembershipFormArraySchema = z.object({
  members: z.array(MembershipFormSchemaEffect)
})
