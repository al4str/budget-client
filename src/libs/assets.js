import { ASSETS_VAR_NAME } from '@/helpers/constants';

const ASSETS_MAP = window[ASSETS_VAR_NAME];

/**
 * @param {string} fileName
 * @return {string}
 * */
export function assetsGetURL(fileName) {
  return ASSETS_MAP[fileName] || '';
}
