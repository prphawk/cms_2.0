export const _toLocaleString = (date?: Date) => {
  if (!date) return '-';
  return date.toLocaleString('pt-BR', { dateStyle: 'short' });
};

export const _isNumeric = (str?: string | string[]) => {
  if (typeof str != 'string') return false; // we only process strings!
  return (
    !isNaN(parseInt(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
};
