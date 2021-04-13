/**
 * @template T
 *
 * @param {Object} source
 * @param {Array<string|number>} path
 * @param {T} defaultValue
 *
 * @return {T}
 * */
export function propertyGet(source, path, defaultValue) {
  if (defaultValue === undefined) {
    throw new TypeError('`defaultValue` is undefined');
  }
  if (!source) {
    return defaultValue;
  }
  try {
    let object = source;
    let index = 0;
    while (object != null && index < path.length) {
      object = object[path[index]];
      index += 1;
    }
    return index && index === path.length && object !== undefined && object !== null
      ? object
      : defaultValue;
  }
  catch (err) {
    return defaultValue;
  }
}

/**
 * @param {Object} source
 * @param {Array<string|number>} path
 * @param {boolean} defaultValue=false
 * @return {boolean}
 * */
export function propertyGetBoolean(source, path, defaultValue = false) {
  const rawValue = propertyGet(source, path, defaultValue);
  return [true, 1, 'true', '1'].includes(rawValue);
}
