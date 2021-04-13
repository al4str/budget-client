import { useCallback } from 'react';

/**
 * @param {Array<React.RefObject>} [refs]
 * @return {function(inputRef: React.RefObject): void}
 * */
export function useSetRef(refs = []) {
  return useCallback((inputRef) => {
    setRefs(inputRef, refs);
  }, [
    refs,
  ]);
}

/**
 * @param {React.RefObject} inputRef
 * @param {Array<React.RefObject>} refs
 * @return {void}
 * */
function setRefs(inputRef, refs) {
  refs.forEach((ref) => {
    if (typeof ref === 'object'
      && ref
      && ref.current !== undefined) {
      ref.current = inputRef;
    }
    if (typeof ref === 'function') {
      ref(inputRef);
    }
  });
}
