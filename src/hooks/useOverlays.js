import { storeCreate } from '@/libs/store';

export const OVERLAYS_ELEMENT_ID = 'app-overlays';

const ACTION_TYPES = {
  SET_LIST: 'SET_LIST',
  SET_SHOWN: 'SET_SHOWN',
};

/**
 * @typedef {'SET_LIST'|'SET_SHOWN'} OverlaysStoreActionType
 * */

/** @type {OverlaysStoreState} */
const initialState = {
  list: new Set(),
  shown: new Set(),
  current: '',
};

/**
 * @typedef {Object} OverlaysStoreState
 * @property {Set<string>} list
 * @property {Set<string>} shown
 * @property {string} current
 * */

const { getState, dispatch, useStore } = storeCreate(initialState, reducer);

/** @type {function(): OverlaysStoreState} */
export const overlaysGetState = getState;

/** @type {function(type: OverlaysStoreActionType,
 * payload: OverlaysStorePayload): void} */
export const overlaysDispatch = dispatch;

/**
 * @typedef {Partial<OverlaysStoreState>} OverlaysStorePayload
 * */

/**
 * @param {string} overlayId
 * @return {void}
 * */
export function overlaysRegister(overlayId) {
  const { list: prevList } = overlaysGetState();
  const nextList = new Set(prevList);
  nextList.add(overlayId);
  overlaysDispatch(ACTION_TYPES.SET_LIST, {
    list: nextList,
  });
}

/**
 * @param {string} overlayId
 * @return {void}
 * */
export function overlaysOpen(overlayId) {
  const { shown: prevShown, current: prevOverlayId } = overlaysGetState();
  const nextShown = new Set(prevShown);
  if (prevOverlayId) {
    overlaysSetScroll(prevOverlayId);
  }
  nextShown.add(overlayId);
  overlaysDispatch(ACTION_TYPES.SET_SHOWN, {
    shown: nextShown,
  });
}

/**
 * @param {string} overlayId
 * @return {void}
 * */
export function overlaysClose(overlayId) {
  const { shown: prevShown } = overlaysGetState();
  const nextShown = new Set(prevShown);
  nextShown.delete(overlayId);
  overlaysDispatch(ACTION_TYPES.SET_SHOWN, {
    shown: nextShown,
  });
}

/**
 * @param {string} overlayId
 * @return {void}
 * */
export function overlaysUnregister(overlayId) {
  const { list: prevList, shown: prevShown } = overlaysGetState();
  const nextList = new Set(prevList);
  nextList.delete(overlayId);
  overlaysDispatch(ACTION_TYPES.SET_LIST, {
    list: nextList,
  });
  const nextShown = new Set(prevShown);
  nextShown.delete(overlayId);
  overlaysDispatch(ACTION_TYPES.SET_SHOWN, {
    shown: nextShown,
  });
  overlaysClearScroll(overlayId);
}

/** @type {Map<string, number>} */
const scrollMap = new Map();

/**
 * @param {string} overlayId
 * @return {void}
 * */
function overlaysSetScroll(overlayId) {
  scrollMap.set(overlayId, window.scrollY);
}

/**
 * @param {string} overlayId
 * @return {number}
 * */
export function overlaysGetScroll(overlayId) {
  return scrollMap.get(overlayId) || 0;
}

/**
 * @param {string} overlayId
 * @return {void}
 * */
function overlaysClearScroll(overlayId) {
  scrollMap.delete(overlayId);
}

/**
 * @return {UseOverlaysStore}
 * */
export function useOverlays() {
  const {
    list,
    shown,
    current,
  } = overlaysGetState();

  useStore();

  return {
    list,
    shown,
    current,
  };
}

/**
 * @typedef {Object} UseOverlaysStore
 * @property {Set<string>} list
 * @property {Set<string>} shown
 * @property {string} current
 * */

/**
 * @param {OverlaysStoreState} state
 * @param {{
 *   type: OverlaysStoreActionType
 *   payload: OverlaysStorePayload
 * }} action
 * @return {OverlaysStoreState}
 * */
function reducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_LIST:
      return {
        ...state,
        list: action.payload.list,
      };
    case ACTION_TYPES.SET_SHOWN:
      return {
        ...state,
        shown: action.payload.shown,
        current: Array.from(action.payload.shown).pop() || '',
      };
    default:
      return state;
  }
}
