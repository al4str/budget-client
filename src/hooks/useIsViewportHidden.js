import { useState, useEffect } from 'react';

/**
 * @return {{
 *   hidden: boolean
 * }}
 * */
export function useIsViewportHidden() {
  const [hidden, setHidden] = useState(window.document.hidden);

  useEffect(() => {
    isViewportHiddenSubscribe(setHidden);

    return () => {
      isViewportHiddenUnSubscribe(setHidden);
    };
  }, []);

  return {
    hidden,
  };
}

/**
 * @typedef {function(boolean): void} IsViewportHiddenSubscriber
 * */

/** @type {Set<IsViewportHiddenSubscriber>} */
const subscribers = new Set();

/**
 * @param {IsViewportHiddenSubscriber} subscriber
 * @return {void}
 * */
export function isViewportHiddenSubscribe(subscriber) {
  subscribers.add(subscriber);
}

/**
 * @param {IsViewportHiddenSubscriber} subscriber
 * @return {void}
 * */
export function isViewportHiddenUnSubscribe(subscriber) {
  subscribers.delete(subscriber);
}

function handleVisibilityChange() {
  const hidden = window.document.hidden;
  subscribers.forEach((subscriber) => {
    subscriber(hidden);
  });
}

window.addEventListener('visibilitychange', handleVisibilityChange, false);
