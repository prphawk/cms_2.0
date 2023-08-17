import { z } from 'zod'

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

// export const NotificationSchema = z.object({
//   notification: z.object({
//     id: z.number(),
//     isOn: z.boolean()
//   })
// })
