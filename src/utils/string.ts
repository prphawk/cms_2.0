export const _toLocaleString = (date?: Date | null) => {
  if (!date) return '-';
  return date.toLocaleString('pt-BR', { dateStyle: 'short' });
};

export const _toString = (date?: Date | null) => {
  if (!date) return undefined;
  return date.toISOString().substring(0, 10);
};

export const _isNumeric = (str?: string | string[]) => {
  if (typeof str != 'string') return false; // we only process strings!
  return (
    !isNaN(parseInt(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
};

export const _addYears = (original: Date, years: number) => {
  const date = new Date(original);
  date.setFullYear(date.getFullYear() + years);
  return date;
};
export const _addMonths = (original: Date, months: number) => {
  const date = new Date(original);
  date.setMonth(date.getMonth() + months);
  return date;
};

export const _formatCount = (
  isLoading: boolean,
  data: { _count: any; is_active: boolean }[] | undefined,
): { active_count: number; total_count: number } => {
  let obj = { active: 0, inactive: 0 };

  if (!(isLoading || !data || !data.length)) {
    data.forEach((e) => {
      obj[e.is_active ? 'active' : 'inactive'] = e._count.is_active;
    });
  }
  return {
    active_count: obj.active ?? 'Loading...',
    total_count: obj.active + obj.inactive ?? 'Loading...',
  };
};

export const _isDateComing = (date: Date) => {
  const limitDate = _addMonths(new Date(), 2);
  return date.getTime() <= limitDate.getTime();
};
