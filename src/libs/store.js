import { useEffect, useRef, useState } from 'react';
import { idGet } from '@/libs/id';
import { throttle } from '@/libs/throttle';

/**
 * @template {Object} T
 * @param {T} initialState
 * @param {function(T, { type: string, payload: Partial<T>}): T} reducer
 * @return {{
 *   getState: function(): T
 *   dispatch: function(string, Partial<T>): void
 *   useStore: function(): void
 * }}
 * */
export function storeCreate(initialState, reducer) {
  let innerState = initialState;

  /** @type {Map<string, function(function(number): number): void>} */
  const subscribers = new Map();

  const throttledSubscribersUpdate = throttle(() => {
    subscribers.forEach((subscriber) => {
      subscriber((prevValue) => prevValue + 1);
    });
  }, 1000 / 60, { leading: true, trailing: true });

  function useStore() {
    const keyRef = useRef(idGet());
    const [, forceRender] = useState(0);

    useEffect(() => {
      const key = keyRef.current;
      subscribers.set(key, forceRender);

      return () => {
        subscribers.delete(key);
      };
    }, []);
  }

  function getState() {
    return innerState;
  }

  function dispatch(type, payload) {
    const prevState = innerState;
    const nextState = reducer(innerState, { type, payload });
    const stateChanged = nextState !== prevState;
    innerState = nextState;
    if (stateChanged) {
      throttledSubscribersUpdate();
    }
  }

  return {
    getState,
    dispatch,
    useStore,
  };
}
