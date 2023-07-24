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

export const _addYears = (date: Date, years: number) => {
  date.setFullYear(date.getFullYear() + years);
  return date;
};

export const _formatCount = (
  isLoading: boolean,
  data: any[] | undefined,
): { active_count: string; total_count: string } => {
  let active, inactive;
  if (isLoading || !data || !data.length) active = inactive = 0;
  else {
    active = data.at(0) ? data.at(0)._count?.is_active : 0;
    inactive = data.at(1) ? data.at(1)._count?.is_active : 0;
  }
  return { active_count: active ?? 'Loading...', total_count: active + inactive ?? 'Loading...' };
};
