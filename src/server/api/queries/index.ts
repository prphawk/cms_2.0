import { z } from 'zod'
import { DateSchema } from '~/schemas'
import { _toDateFromForm } from '~/utils/string'

export const getDatesQuery = (dates: z.infer<typeof DateSchema>) => {
  if (!dates) return undefined
  return {
    AND: [
      {
        begin_date: {
          lt: _toDateFromForm(dates?.end_date)
        }
      },
      {
        end_date: {
          gt: _toDateFromForm(dates?.end_date)
        }
      }
    ]
  }
}
