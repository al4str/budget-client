import { nanoid } from 'nanoid';

/**
 * @param {number} [size=21]
 * @return {string}
 * */
export const idGet = nanoid;

/**
 * @param {string} id
 * @return {boolean}
 * */
export function idInvalid(id) {
  return !id
    || typeof id !== 'string'
    || !/[-a-z0-9_]/i.test(id);
}
