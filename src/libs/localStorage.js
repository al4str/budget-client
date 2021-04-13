import { STORAGE_PREFIX } from '@/helpers/constants';
import { captureException } from '@/libs/exceptions';

/**
 * @param {string} key
 * @return {boolean}
 * */
export function storageHas(key) {
  return window.localStorage.getItem(`${STORAGE_PREFIX}_${key}`) !== null;
}

/**
 * @template {Object} T
 * @param {string} key
 * @param {T} [defaultValue]
 * @return {T}
 * */
export function storageGet(key, defaultValue = null) {
  try {
    if (storageHas(key)) {
      return JSON.parse(window.localStorage.getItem(`${STORAGE_PREFIX}_${key}`));
    }
    return defaultValue;
  }
  catch (err) {
    captureException(err);
    return defaultValue;
  }
}

/**
 * @param {string} key
 * @param {*} value
 * @return {boolean}
 * */
export function storageSet(key, value) {
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}_${key}`, JSON.stringify(value));
    return true;
  }
  catch (err) {
    captureException(err);
    return false;
  }
}

/**
 * @param {string} key
 * @return {void}
 * */
export function storageRemove(key) {
  window.localStorage.removeItem(`${STORAGE_PREFIX}_${key}`);
}
