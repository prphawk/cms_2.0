import { z } from 'zod'
import { CommitteeHeaders } from '~/constants/headers'

export const CommitteeSchema = z
  .object({
    name: z
      .string({ required_error: `${CommitteeHeaders.NAME} é obrigatório` })
      .trim()
      .min(1, { message: `${CommitteeHeaders.NAME} é obrigatório` }),
    bond: z
      .string({ required_error: `${CommitteeHeaders.BOND} é obrigatório` })
      .trim()
      .min(1, { message: `${CommitteeHeaders.BOND} é obrigatório` }),
    begin_date: z.coerce.date().optional(),
    end_date: z.coerce.date().optional(),
    ordinance: z.string().optional(),
    observations: z.string().optional(),
    template_name: z.string().optional(),
    is_active: z.boolean()
  })
  .refine((data) => (data.begin_date || 0) < (data.end_date || new Date()), {
    message: `${CommitteeHeaders.END_DATE} não pode ser igual/antes de ${CommitteeHeaders.BEGIN_DATE}.`,
    path: ['end_date']
  })

export const TemplateSchema = z.object({
  name: z.string({ required_error: `${CommitteeHeaders.TEMPLATE_NAME} é obrigatório` })
})
