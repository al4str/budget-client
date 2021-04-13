import { storeCreate } from '@/libs/store';
import {
  sessionsObtainToken,
  sessionsValidateToken,
  sessionsTokenToStorage,
  sessionsTokenWipe,
} from '@/helpers/sessions';

const READY_STATE = {
  INITIAL: 'INITIAL',
  UN_AUTHED: 'UN_AUTHED',
  AUTHED: 'AUTHED',
};

/**
 * @typedef {'INITIAL'|'UN_AUTHED'|'AUTHED'} SessionStoreReadyState
 * */

const ACTION_TYPES = {
  SET_READY_STATE: 'SET_READY_STATE',
};

/**
 * @typedef {'SET_READY_STATE'} SessionStoreActionType
 * */

/** @type {SessionStoreState} */
const initialState = {
  readyState: READY_STATE.INITIAL,
  initial: true,
  authed: false,
};

/**
 * @typedef {Object} SessionStoreState
 * @property {SessionStoreReadyState} readyState
 * @property {boolean} initial
 * @property {boolean} authed
 * */

const { getState, dispatch, useStore } = storeCreate(initialState, reducer);

/** @type {function(): SessionStoreState} */
export const sessionGetState = getState;

/** @type {function(type: SessionStoreActionType,
 * payload: SessionStorePayload): void} */
export const sessionDispatch = dispatch;

/**
 * @typedef {Object} SessionStorePayload
 * @property {SessionStoreReadyState} [readyState]
 * */

/**
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.userPIN
 * @return {Promise<SessionsTokenResponse>}
 * */
export async function sessionAuth(params) {
  const { userId, userPIN } = params;
  const response = await sessionsObtainToken({
    userId,
    userPIN,
  });
  const { status, body: { ok, data } } = response;
  if (status === 'success' && ok) {
    sessionsTokenToStorage(data);
    sessionDispatch(ACTION_TYPES.SET_READY_STATE, {
      readyState: READY_STATE.AUTHED,
    });
  }
  else {
    sessionsTokenWipe();
    sessionDispatch(ACTION_TYPES.SET_READY_STATE, {
      readyState: READY_STATE.UN_AUTHED,
    });
  }
  return response;
}

/**
 * @return {Promise<void>}
 * */
export async function sessionValidate() {
  const { status } = await sessionsValidateToken();
  if (status === 'success') {
    sessionDispatch(ACTION_TYPES.SET_READY_STATE, {
      readyState: READY_STATE.AUTHED,
    });
  }
  else {
    sessionsTokenWipe();
    sessionDispatch(ACTION_TYPES.SET_READY_STATE, {
      readyState: READY_STATE.UN_AUTHED,
    });
  }
}

/**
 * @return {UseSessionStore}
 * */
export function useSession() {
  const {
    readyState,
    initial,
    authed,
  } = sessionGetState();

  useStore();

  return {
    readyState,
    initial,
    authed,
    READY_STATE,
  };
}

/**
 * @typedef {Object} UseSessionStore
 * @property {SessionStoreReadyState} readyState
 * @property {boolean} initial
 * @property {boolean} authed
 * @property {Record<SessionStoreReadyState>} READY_STATE
 * */

/**
 * @param {SessionStoreState} state
 * @param {SessionStoreAction} action
 * @return {SessionStoreState}
 * */
function reducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_READY_STATE:
      return {
        ...state,
        readyState: action.payload.readyState,
        initial: action.payload.readyState === READY_STATE.INITIAL,
        authed: action.payload.readyState === READY_STATE.AUTHED,
      };
    default:
      return state;
  }
}

/**
 * @typedef {Object} SessionStoreAction
 * @property {SessionStoreActionType} type
 * @property {SessionStorePayload} payload
 * */
