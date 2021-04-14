import { storeCreate } from '@/libs/store';
import {
  i18nDetectLanguageTag,
  i18nObtainTranslations,
  i18nTranslationFromStorage,
  i18nTranslationToStorage,
} from '@/helpers/i18n';

const READY_STATE = {
  INITIAL: 'INITIAL',
  FETCHING: 'FETCHING',
  READY: 'READY',
};

/**
 * @typedef {'INITIAL'|'FETCHING'|'READY'} I18nStoreReadyState
 * */

const ACTION_TYPES = {
  SET_READY_STATE: 'SET_READY_STATE',
  SET_TAG: 'SET_TAG',
  SET_VALUES: 'SET_VALUES',
};

/**
 * @typedef {'SET_READY_STATE'|'SET_TAG'
 * |'SET_VALUES'} I18nStoreActionType
 * */

/** @type {I18nStoreState} */
const initialState = {
  readyState: READY_STATE.INITIAL,
  initial: true,
  pending: true,
  fetching: false,
  ready: false,
  tag: '',
  values: {},
};

/**
 * @typedef {Object} I18nStoreState
 * @property {I18nStoreReadyState} readyState
 * @property {boolean} initial
 * @property {boolean} pending
 * @property {boolean} fetching
 * @property {boolean} ready
 * @property {I18nLangTag} tag
 * @property {I18nValues} values
 * */

const { getState, dispatch, useStore } = storeCreate(initialState, reducer);

/** @type {function(): I18nStoreState} */
export const i18nGetState = getState;

/** @type {function(type: I18nStoreActionType,
 * payload: I18nStorePayload): void} */
export const i18nDispatch = dispatch;

/**
 * @typedef {Partial<I18nStoreState>} I18nStorePayload
 * */

/**
 * @return {Promise<void>}
 * */
export async function i18nInit() {
  const translation = i18nTranslationFromStorage();
  if (translation.tag) {
    i18nDispatch(ACTION_TYPES.SET_TAG, {
      tag: translation.tag,
    });
    i18nDispatch(ACTION_TYPES.SET_VALUES, {
      values: translation.values,
    });
    i18nDispatch(ACTION_TYPES.SET_READY_STATE, {
      readyState: READY_STATE.READY,
    });
  }
  const tag = translation.tag || i18nDetectLanguageTag();
  await i18nFetch(tag);
}

/**
 * @param {I18nLangTag} tag
 * @return {Promise<void>}
 * */
export async function i18nFetch(tag) {
  const { readyState: prevReadyState } = i18nGetState();
  i18nDispatch(ACTION_TYPES.SET_TAG, {
    tag,
  });
  i18nDispatch(ACTION_TYPES.SET_READY_STATE, {
    readyState: prevReadyState === READY_STATE.READY
      ? READY_STATE.READY
      : READY_STATE.FETCHING,
  });
  const response = await i18nObtainTranslations({
    tag,
  });
  const { status, body: data } = response;
  if (status === 'success' && data.tag) {
    i18nTranslationToStorage(data);
    i18nDispatch(ACTION_TYPES.SET_VALUES, {
      values: data.values,
    });
  }
  i18nDispatch(ACTION_TYPES.SET_READY_STATE, {
    readyState: READY_STATE.READY,
  });
}

/**
 * @return {UseI18nStore}
 * */
export function useI18n() {
  const {
    readyState,
    initial,
    pending,
    fetching,
    ready,
    tag,
    values,
  } = i18nGetState();

  useStore();

  return {
    readyState,
    initial,
    pending,
    fetching,
    ready,
    tag,
    values,
    READY_STATE,
  };
}

/**
 * @typedef {Object} UseI18nStore
 * @property {I18nStoreReadyState} readyState
 * @property {boolean} initial
 * @property {boolean} pending
 * @property {boolean} fetching
 * @property {boolean} ready
 * @property {I18nLangTag} tag
 * @property {I18nValues} values
 * @property {Record<I18nStoreReadyState>} READY_STATE
 * */

/**
 * @template {string} Key
 * @template {string} Value
 * @template {string} Name
 *
 * @param {Record<Name, Key>} keys
 *
 * @return {Record<Name, Value>}
 * */
export function useT9ns(keys) {
  const { values } = i18nGetState();

  useStore();

  return Object
    .entries(keys)
    .reduce((result, [name, key]) => {
      result[name] = typeof values[key] === 'string'
        ? values[key]
        : key;
      return result;
    }, {});
}

/**
 * @param {I18nStoreState} state
 * @param {{
 *   type: I18nStoreActionType
 *   payload: I18nStorePayload
 * }} action
 * @return {I18nStoreState}
 * */
function reducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_READY_STATE:
      return {
        ...state,
        readyState: action.payload.readyState,
        initial: action.payload.readyState === READY_STATE.INITIAL,
        pending: [
          READY_STATE.INITIAL,
          READY_STATE.FETCHING,
        ].includes(action.payload.readyState),
        fetching: action.payload.readyState === READY_STATE.FETCHING,
        ready: action.payload.readyState === READY_STATE.READY,
      };
    case ACTION_TYPES.SET_TAG:
      return {
        ...state,
        tag: action.payload.tag,
      };
    case ACTION_TYPES.SET_VALUES:
      return {
        ...state,
        values: action.payload.values,
      };
    default:
      return state;
  }
}
