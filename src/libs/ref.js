/**
 * @param {null|Object} ref
 * @return {null|HTMLElement}
 * */
export function refGetElement(ref) {
  return ref
  && typeof ref === 'object'
  && ref.current instanceof HTMLElement
    ? ref.current
    : null;
}
