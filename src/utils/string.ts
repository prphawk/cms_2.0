import { CommitteeHeaders } from '~/constants/headers'
import { CountDataType, RawCountDataType } from '~/types'

export const _diffMonths = (d1: Date, d2: Date) => {
  let months
  months = (d2.getFullYear() - d1.getFullYear()) * 12
  months -= d1.getMonth()
  months += d2.getMonth()
  return months <= 0 ? 0 : months
}

export const _sortStringDate = (
  row1: { getValue: (columnId: string) => string },
  row2: { getValue: (columnId: string) => string },
  columnId: string
) => {
  const max = new Date('2050/01/01') //TODO change this later
  const value1 = _toDate(row1.getValue(columnId)) || max
  const value2 = _toDate(row2.getValue(columnId)) || max
  return value1.getTime() - value2.getTime()
}

export const _toDate = (str: string) => {
  if (str === CommitteeHeaders.VALUE_NULL) return null
  const arr = str.split('/')
  return new Date(`${arr[2]}/${arr[1]}/${arr[0]}`)
}

export const _toLocaleString = (date?: Date | null) => {
  if (date) {
    const arr = _toString(date)?.split('-')
    if (arr?.length) return `${arr[2]}/${arr[1]}/${arr[0]}`
  }
  return CommitteeHeaders.VALUE_NULL
}

export const _toLocaleExtendedString = (date: Date) =>
  date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

export const _toString = (date?: Date | null) => {
  if (!date) return undefined
  return date.toISOString().substring(0, 10)
}

export const _isNumeric = (str?: string | string[]) => {
  if (typeof str != 'string') return false // we only process strings!
  return (
    !isNaN(parseInt(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ) // ...and ensure strings of whitespace fail
}

export const _addYears = (original: Date, years: number) => {
  const date = new Date(original)
  date.setFullYear(date.getFullYear() + years)
  return date
}
export const _addMonths = (original: Date, months: number) => {
  const date = new Date(original)
  date.setMonth(date.getMonth() + months)
  return date
}

export const _subDays = (original: Date, days: number) => {
  const date = new Date(original)
  date.setHours(date.getHours() - 24 * days)
  return date
}

export const _addDays = (original: Date, days: number) => {
  const date = new Date(original)
  date.setHours(date.getHours() + 24 * days)
  return date
}

export const _formatCount = (
  isLoading: boolean,
  data: RawCountDataType[] | undefined
): CountDataType => {
  let obj = { active: 0, inactive: 0 }

  if (!(isLoading || !data || !data.length)) {
    data.forEach((e) => {
      obj[e.is_active ? 'active' : 'inactive'] = e._count.is_active
    })
  }
  return {
    active_count: obj.active ?? 'Loading...',
    total_count: obj.active + obj.inactive ?? 'Loading...'
  }
}

export const _isDateComing = (date: Date) => {
  const limitDate = _addMonths(new Date(), 3)
  return date.getTime() <= limitDate.getTime()
}
