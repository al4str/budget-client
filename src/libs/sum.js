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
 * @param {Object} [params]
 * @param {'decimal'|'currency'} [params.style='decimal']
 * @param {'exceptZero'|'never'} [params.sign='exceptZero']
 * @return {string}
 * */
export function sumFormat(raw, params) {
  const {
    style = 'decimal',
    sign = 'exceptZero',
  } = params || {};
  const value = (typeof raw === 'string'
    ? parseFloat(raw)
    : raw) || 0;
  const formatter = new Intl.NumberFormat('ru-RU', {
    style,
    signDisplay: sign,
    currency: 'RUB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
}
