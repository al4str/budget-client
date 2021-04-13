import {
  lazy,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useMounted } from '@/hooks/useMounted';

const DELAY = 500;

/**
 * @param {Object} params
 * @param {Function} params.factory
 * @param {number} [params.delay=300]
 * @param {Function} [params.Loader]
 * @param {Function} [params.Boundary]
 * @return {Function}
 * */
export function lazyGetComponent(params) {
  const {
    factory,
    delay = DELAY,
    Loader = null,
    Boundary = null,
  } = params;

  function LazyComponent(props) {
    const mountedRef = useMounted();
    const [loading, setLoading] = useState(delay === 0);
    const [error, setError] = useState(false);
    const [Module, setModule] = useState(null);
    /** @type {React.RefObject<number>} */
    const timerRef = useRef(null);

    const handleFetching = useCallback(async () => {
      try {
        const fetchedModule = await lazy(factory);
        clearTimeout(timerRef.current);
        if (mountedRef.current) {
          setModule(fetchedModule);
          setLoading(true);
        }
      }
      catch (err) {
        if (mountedRef.current) {
          setError(err);
        }
      }
    }, [
      mountedRef,
    ]);
    const handleTimer = useCallback(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (mountedRef.current) {
            setLoading(true);
          }
          resolve();
        }, delay);
      });
    }, [
      mountedRef,
    ]);
    const handleFactory = useCallback(async () => {
      await Promise.all([
        handleFetching(),
        handleTimer(),
      ]);
    }, [
      handleFetching,
      handleTimer,
    ]);

    useEffect(() => {
      handleFactory().then();
    }, [
      handleFactory,
    ]);
    useEffect(() => {
      const timer = timerRef.current;

      return () => {
        clearTimeout(timer);
      };
    }, []);

    if (Module) {
      return (
        <Module {...props} />
      );
    }
    if (loading && Loader) {
      return (
        <Loader />
      );
    }
    if (error && Boundary) {
      return (
        <Boundary error={error} />
      );
    }
    return null;
  }

  return LazyComponent;
}
