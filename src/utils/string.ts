export const _toLocaleString = (date?: Date | null) => {
  if (date) {
    const arr = _toString(date)?.split('-')
    if (arr?.length) return `${arr[2]}/${arr[1]}/${arr[0]}`
  }
  return '-'
}

export const _toString = (date?: Date | null) => {
  if (!date) return undefined
  return date.toISOString().substring(0, 10)
}

// export const _toString = (original?: Date | null) => {
//   if (!original) return undefined
//   const offset = original.getTimezoneOffset()
//   const date = new Date(original.getTime() - offset * 60 * 1000)
//   console.log('toString', original, date.toISOString().split('T')[0])
//   return date.toISOString().split('T')[0]
// }

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
export const _addDays = (original: Date, days: number) => {
  const date = new Date(original)
  date.setHours(date.getHours() + 24 * days)
  return date
}

export const _formatCount = (
  isLoading: boolean,
  data: { _count: any; is_active: boolean }[] | undefined
): { active_count: number; total_count: number } => {
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
  const limitDate = _addMonths(new Date(), 2)
  return date.getTime() <= limitDate.getTime()
}
