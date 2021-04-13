import { storeCreate } from '@/libs/store';
import { storageSet, storageGet } from '@/libs/localStorage';
import {
  usersObtain,
  usersUpdate,
  usersGetEmptyItem,
  usersUploadAvatar,
} from '@/helpers/users';

const STORAGE_KEY = 'PROFILE';

const READY_STATE = {
  INITIAL: 'INITIAL',
  FETCHING: 'FETCHING',
  READY: 'READY',
  UPDATING: 'UPDATING',
};

/**
 * @typedef {'INITIAL'|'FETCHING'|'READY'
 * |'UPDATING'} ProfileStoreReadyState
 * */

const ACTION_TYPES = {
  SET_READY_STATE: 'SET_READY_STATE',
  SET_DATA: 'SET_DATA',
};

/**
 * @typedef {'SET_READY_STATE'|'SET_DATA'} ProfileStoreActionType
 * */

/** @type {ProfileStoreState} */
const initialState = {
  readyState: READY_STATE.INITIAL,
  initial: true,
  fetching: false,
  pending: true,
  ready: false,
  updating: false,
  data: profileDataFromStorage(),
};

/**
 * @typedef {Object} ProfileStoreState
 * @property {boolean} initial
 * @property {boolean} fetching
 * @property {boolean} pending
 * @property {boolean} ready
 * @property {boolean} updating
 * @property {ProfileStoreReadyState} readyState
 * @property {UsersItem} data
 * */

const { getState, dispatch, useStore } = storeCreate(initialState, reducer);

/** @type {function(): ProfileStoreState} */
export const profileGetState = getState;

/** @type {function(type: ProfileStoreActionType,
 * payload: ProfileStorePayload): void} */
export const profileDispatch = dispatch;

/**
 * @typedef {Object} ProfileStorePayload
 * @property {ProfileStoreReadyState} [readyState]
 * @property {UsersItem} [data]
 * */

/**
 * @return {UsersItem}
 * */
export function profileDataFromStorage() {
  return storageGet(STORAGE_KEY, usersGetEmptyItem());
}

/**
 * @param {UsersItem} data
 * @return {void}
 * */
export function profileDataToStorage(data) {
  storageSet(STORAGE_KEY, data);
}

/**
 * @param {Object} params
 * @param {string} params.userId
 * @return {Promise<void>}
 * */
export async function profileGet(params) {
  const { userId } = params;
  profileDispatch(ACTION_TYPES.SET_READY_STATE, {
    readyState: READY_STATE.FETCHING,
  });
  const { status, body: { ok, data } } = await usersObtain({
    userId,
  });
  if (status === 'success' && ok) {
    profileDataToStorage(data);
    profileDispatch(ACTION_TYPES.SET_DATA, {
      data,
    });
  }
  profileDispatch(ACTION_TYPES.SET_READY_STATE, {
    readyState: READY_STATE.READY,
  });
}

/**
 * @param {Object} params
 * @param {string} params.name
 * @return {Promise<void>}
 * */
export async function profileEdit(params) {
  const { name } = params;
  const { data: prevData } = profileGetState();
  profileDispatch(ACTION_TYPES.SET_READY_STATE, {
    readyState: READY_STATE.UPDATING,
  });
  const { status, body: { ok, data } } = await usersUpdate({
    userId: prevData.id,
    name,
  });
  if (status === 'success' && ok) {
    const nextData = {
      ...prevData,
      ...data,
    };
    profileDataToStorage(nextData);
    profileDispatch(ACTION_TYPES.SET_DATA, {
      data: nextData,
    });
  }
  profileDispatch(ACTION_TYPES.SET_READY_STATE, {
    readyState: READY_STATE.READY,
  });
}

/**
 * @param {Object} params
 * @param {File} params.file
 * @return {Promise<void>}
 * */
export async function profileUploadAvatar(params) {
  const { file } = params;
  const { data: prevData } = profileGetState();
  profileDispatch(ACTION_TYPES.SET_READY_STATE, {
    readyState: READY_STATE.UPDATING,
  });
  const { status, body: { ok, data } } = await usersUploadAvatar({
    userId: prevData.id,
    file,
  });
  if (status === 'success' && ok) {
    /** @type {UsersItem} */
    const nextData = {
      ...prevData,
      avatarId: data,
    };
    profileDataToStorage(nextData);
    profileDispatch(ACTION_TYPES.SET_DATA, {
      data: nextData,
    });
  }
  profileDispatch(ACTION_TYPES.SET_READY_STATE, {
    readyState: READY_STATE.READY,
  });
}

/**
 * @return {UseProfileStore}
 * */
export function useProfile() {
  const {
    readyState,
    initial,
    fetching,
    pending,
    ready,
    updating,
    data,
  } = profileGetState();

  useStore();

  return {
    readyState,
    initial,
    fetching,
    pending,
    ready,
    updating,
    data,
    READY_STATE,
  };
}

/**
 * @typedef {Object} UseProfileStore
 * @property {ProfileStoreReadyState} readyState
 * @property {boolean} initial
 * @property {boolean} fetching
 * @property {boolean} pending
 * @property {boolean} ready
 * @property {boolean} updating
 * @property {UsersItem} data
 * @property {Record<ProfileStoreReadyState>} READY_STATE
 * */

/**
 * @param {ProfileStoreState} state
 * @param {ProfileStoreAction} action
 * @return {ProfileStoreState}
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
    case ACTION_TYPES.SET_DATA:
      return {
        ...state,
        data: action.payload.data,
      };
    default:
      return state;
  }
}

/**
 * @typedef {Object} ProfileStoreAction
 * @property {ProfileStoreActionType} type
 * @property {ProfileStorePayload} payload
 * */
