import { z } from 'zod'
import { CommitteeHeaders } from '~/constants/headers'

export const CommitteeTemplateFormSchema = z
  .object({
    id: z.number().optional(),
    name: z.string(),
    committees: z.object({ id: z.number() }).array().optional()
  })
  .optional()

export const CommitteeFormSchema = z.object({
  id: z.number().optional(),
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
  is_active: z.boolean(),
  template: CommitteeTemplateFormSchema
})

export const CommitteeFormSchemaEffect = CommitteeFormSchema.refine(
  (data) => (data.begin_date || 0) < (data.end_date || new Date()),
  {
    message: `${CommitteeHeaders.END_DATE} não pode ser igual/antes de ${CommitteeHeaders.BEGIN_DATE}.`,
    path: ['end_date']
  }
).refine((data) => !(data.is_active && data.template?.committees?.length), {
  message: `Já existe mandato ativo deste tipo. Selecione outro ou desative este mandato.`,
  path: ['template']
})

// export const CommitteeFormSchemaEffect = CommitteeFormSchema.superRefine((data, ctx) => {
//   if ((data.begin_date || 0) < (data.end_date || new Date())) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: `${CommitteeHeaders.END_DATE} não pode ser igual/antes de ${CommitteeHeaders.BEGIN_DATE}.`,
//       path: ['end_date'],
//       fatal: true
//     })
//   }
// })
