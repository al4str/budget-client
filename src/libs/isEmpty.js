/**
 * @param {null|string|Array|Object} value
 * @return {boolean}
 * */
export function isEmpty(value) {
  if (value === null) {
    return true;
  }
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === 'object') {
    return Object.values(value).length === 0;
  }
  throw TypeError('`value` is not `null`, `string`, `Array` or `Object`');
}
