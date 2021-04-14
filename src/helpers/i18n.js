import { propertyGet } from '@/libs/property';
import { assetsGetURL } from '@/libs/assets';
import { fetchExec } from '@/libs/fetch';
import { storageGet, storageSet } from '@/libs/localStorage';

/**
 * @typedef {string|'en'|'ru'} I18nLangTag
 * */

/**
 * @typedef {Record<string, string>} I18nValues
 * */

/**
 * @typedef {Object} I18nTranslation
 * @property {I18nLangTag} tag
 * @property {I18nValues} values
 * */

export const I18N_TAGS = [
  {
    key: 'en',
    label: 'English',
    value: 'en',
  },
  {
    key: 'ru',
    label: 'Русский',
    value: 'ru',
  },
];

/**
 * @return {I18nLangTag}
 * */
export function i18nDetectLanguageTag() {
  const [, tag] = window.navigator.language.match(/^([a-z]+)-/)
    || ['', ''];

  return tag;
}

/**
 * @param {Object} params
 * @param {I18nLangTag} params.tag
 * @return {Promise<I18nResponse>}
 * */
export function i18nObtainTranslations(params) {
  const { tag } = params;
  return fetchExec({
    url: assetsGetURL(`i18n/${tag}.json`),
    errorTitle: '[i18n] obtaining translations failed',
    bodyMapper: mapTranslationBody,
  });
}

/**
 * @typedef {FetchResponse
 * & { body: I18nTranslation }} I18nResponse
 * */

/**
 * @param {Object} raw
 * @return {I18nTranslation}
 * */
function mapTranslationBody(raw) {
  const tag = propertyGet(raw, ['tag'], '');
  const values = propertyGet(raw, ['values'], {});

  return {
    tag,
    values,
  };
}

const STORAGE_KEY = 'I18N';

/**
 * @return {I18nTranslation}
 * */
export function i18nTranslationFromStorage() {
  return storageGet(STORAGE_KEY, {
    tag: '',
    values: {},
  });
}

/**
 * @param {I18nTranslation} translation
 * @return {void}
 * */
export function i18nTranslationToStorage(translation) {
  storageSet(STORAGE_KEY, translation);
}
