import { storeCreate } from '@/libs/store';
import { notificationsCreate } from '@/helpers/notifications';

const ACTION_TYPES = {
  SET_LIST: 'SET_LIST',
};

/**
 * @typedef {'SET_LIST'} NotificationsStoreActionType
 * */

/** @type {NotificationsStoreState} */
const initialState = {
  list: [],
};

/**
 * @typedef {Object} NotificationsStoreState
 * @property {Array<NotificationItem>} list
 * */

const { getState, dispatch, useStore } = storeCreate(initialState, reducer);

/** @type {function(): NotificationsStoreState} */
export const notificationsGetState = getState;

/** @type {function(type: NotificationsStoreActionType,
 * payload: NotificationsStorePayload): void} */
export const notificationsDispatch = dispatch;

/**
 * @typedef {Object} NotificationsStorePayload
 * @property {Array<NotificationItem>} [list]
 * */

/**
 * @param {Object} params
 * @param {string} [params.id='']
 * @param {NotificationsTypes} [params.type='info']
 * @param {string} [params.title='']
 * @param {string} [params.text='']
 * @param {boolean} [params.withClose=true]
 * @param {boolean} [params.autoClose=true]
 * @param {null|Function} [params.renderContent=null]
 * @return {void}
 * */
export function notificationsAdd(params) {
  const { list: prevList } = notificationsGetState();
  const nextItem = notificationsCreate(params);
  notificationsDispatch(ACTION_TYPES.SET_LIST, {
    list: prevList.concat([nextItem]),
  });
}

/**
 * @param {string} itemId
 * @return {void}
 * */
export function notificationsRemove(itemId) {
  const { list: prevList } = notificationsGetState();
  notificationsDispatch(ACTION_TYPES.SET_LIST, {
    list: prevList.filter((item) => item.id !== itemId),
  });
}

/**
 * @return {{
 *   list: Array<NotificationItem>
 * }}
 * */
export function useNotifications() {
  const { list } = notificationsGetState();

  useStore();

  return {
    list,
  };
}

/**
 * @param {NotificationsStoreState} state
 * @param {{
 *   type: NotificationsStoreActionType
 *   payload: NotificationsStorePayload
 * }} action
 * @return {NotificationsStoreState}
 * */
function reducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_LIST:
      return {
        ...state,
        list: action.payload.list,
      };
    default:
      return state;
  }
}
