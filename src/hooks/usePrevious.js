import { useRef, useEffect } from 'react';

/**
 * @param {*} value
 * @return {*}
 * */
export function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
