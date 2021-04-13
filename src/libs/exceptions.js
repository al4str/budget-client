import { throttle } from '@/libs/throttle';

/** @type {function(Error): void} */
export const captureException = throttle(capture, 300, { leading: true });

/**
 * @param {Error} err
 * @return {void}
 * */
async function capture(err) {
  console.error(err);
}
