import { z } from 'zod'

export const FilterSchema = z.object({
  is_active: z.optional(z.boolean()),
  is_temporary: z.optional(z.boolean())
})
