import { useRef, useEffect } from 'react';

/**
 * @return {React.RefObject<boolean>}
 * */
export function useMounted() {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return mounted;
}
