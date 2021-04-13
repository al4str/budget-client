/**
 * @param {Object} params
 * @param {function(): Promise<*>} params.loadable
 * @return {function(): Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: *
 * }>}
 * */
export function loaderGet(params) {
  const { loadable } = params;
  let loaded = false;
  let result = null;
  return async () => {
    if (loaded) {
      return {
        ok: true,
        reason: null,
        data: result,
      };
    }
    try {
      result = await loadable();
      loaded = true;
      return {
        ok: true,
        reason: null,
        data: result,
      };
    }
    catch (err) {
      return {
        ok: false,
        reason: err,
        data: null,
      };
    }
  };
}
