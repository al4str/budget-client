import { storeCreate } from '@/libs/store';
import { usersObtainList } from '@/helpers/users';

const READY_STATE = {
  INITIAL: 'INITIAL',
  FETCHING: 'FETCHING',
  READY: 'READY',
  UPDATING: 'UPDATING',
};

/**
 * @typedef {'INITIAL'|'FETCHING'|'READY'
 * |'UPDATING'} UsersStoreReadyState
 * */

const ACTION_TYPES = {
  SET_READY_STATE: 'SET_READY_STATE',
  SET_ITEMS: 'SET_ITEMS',
};

/**
 * @typedef {'SET_READY_STATE'|'SET_ITEMS'} UsersStoreActionType
 * */

/** @type {UsersStoreState} */
const initialState = {
  readyState: READY_STATE.INITIAL,
  initial: true,
  fetching: false,
  pending: true,
  ready: false,
  updating: false,
  items: [],
};

/**
 * @typedef {Object} UsersStoreState
 * @property {boolean} initial
 * @property {boolean} fetching
 * @property {boolean} pending
 * @property {boolean} ready
 * @property {boolean} updating
 * @property {UsersStoreReadyState} readyState
 * @property {Array<UsersItem>} items
 * */

const { getState, dispatch, useStore } = storeCreate(initialState, reducer);

/** @type {function(): UsersStoreState} */
export const usersGetState = getState;

/** @type {function(type: UsersStoreActionType,
 * payload: UsersStorePayload): void} */
export const usersDispatch = dispatch;

/**
 * @typedef {Object} UsersStorePayload
 * @property {UsersStoreReadyState} [readyState]
 * @property {Array<UsersItem>} [items]
 * */

/**
 * @return {Promise<void>}
 * */
export async function usersFetchList() {
  const { readyState: prevReadyState } = usersGetState();
  usersDispatch(ACTION_TYPES.SET_READY_STATE, {
    readyState: prevReadyState === READY_STATE.READY
      ? READY_STATE.UPDATING
      : READY_STATE.FETCHING,
  });
  const { status, body: { ok, data } } = await usersObtainList();
  if (status === 'success' && ok) {
    usersDispatch(ACTION_TYPES.SET_ITEMS, {
      items: data,
    });
  }
  usersDispatch(ACTION_TYPES.SET_READY_STATE, {
    readyState: READY_STATE.READY,
  });
}

/**
 * @return {UseUsersStore}
 * */
export function useUsers() {
  const {
    readyState,
    initial,
    fetching,
    pending,
    ready,
    updating,
    items,
  } = usersGetState();

  useStore();

  return {
    readyState,
    initial,
    fetching,
    pending,
    ready,
    updating,
    items,
    READY_STATE,
  };
}

/**
 * @typedef {Object} UseUsersStore
 * @property {UsersStoreReadyState} readyState
 * @property {boolean} initial
 * @property {boolean} fetching
 * @property {boolean} pending
 * @property {boolean} ready
 * @property {boolean} updating
 * @property {Array<UsersItem>} items
 * @property {Record<UsersStoreReadyState>} READY_STATE
 * */

/**
 * @param {UsersStoreState} state
 * @param {{
 *   type: UsersStoreActionType
 *   payload: UsersStorePayload
 * }} action
 * @return {UsersStoreState}
 * */
function reducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_READY_STATE:
      return {
        ...state,
        readyState: action.payload.readyState,
        initial: action.payload.readyState === READY_STATE.INITIAL,
        fetching: action.payload.readyState === READY_STATE.FETCHING,
        pending: [
          READY_STATE.INITIAL,
          READY_STATE.FETCHING,
        ].includes(action.payload.readyState),
        ready: [
          READY_STATE.READY,
          READY_STATE.UPDATING,
        ].includes(action.payload.readyState),
        updating: action.payload.readyState === READY_STATE.UPDATING,
      };
    case ACTION_TYPES.SET_ITEMS:
      return {
        ...state,
        items: action.payload.items,
      };
    default:
      return state;
  }
}
