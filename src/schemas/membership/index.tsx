import { z } from 'zod'
import { MembershipHeaders } from '~/constants/headers'

export const MembershipFormSchema = z.object({
  id: z.number().optional(),
  employee: z.object(
    {
      id: z.number().optional(),
      name: z
        .string({ required_error: `${MembershipHeaders.NAME} é obrigatório` })
        .trim()
        .min(1, { message: `${MembershipHeaders.NAME} é obrigatório` })
    },
    { required_error: `${MembershipHeaders.NAME} é obrigatório` }
  ),
  role: z
    .string({ required_error: `${MembershipHeaders.ROLE} é obrigatório` })
    .trim()
    .min(1, { message: `${MembershipHeaders.ROLE} é obrigatório` }),
  begin_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  observations: z.string().optional(),
  ordinance: z.string().optional(),
  is_active: z.boolean()
})

export const MembershipSchemaEffect = MembershipFormSchema.refine(
  (data) => (data.begin_date || 0) < (data.end_date || new Date()),
  {
    message: `${MembershipHeaders.END_DATE} não pode ocorrer antes de ${MembershipHeaders.BEGIN_DATE}.`,
    path: ['end_date']
  }
)

export const MembershipArraySchema = z.object({
  members: z.array(MembershipSchemaEffect)
})
