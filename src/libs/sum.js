/**
 * @param {number} value
 * @return {boolean}
 * */
export function sumInvalid(value) {
  return typeof value !== 'number'
    || Number.isNaN(value);
}

/**
 * @param {number|string} raw
 * @param {'decimal'|'currency'} style
 * @return {string}
 * */
export function sumFormat(raw, style) {
  const value = (typeof raw === 'string'
    ? parseFloat(raw)
    : raw) || 0;
  const formatter = new Intl.NumberFormat('ru-RU', {
    style,
    signDisplay: 'exceptZero',
    currency: 'RUB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
}
