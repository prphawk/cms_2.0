import { z } from 'zod'

export const FilterSchema = z.object({
  is_active: z.optional(z.boolean()),
  is_temporary: z.optional(z.boolean())
})

export const DateSchema = z.object({
  begin_date: z.string().optional(),
  end_date: z.string().optional()
})
