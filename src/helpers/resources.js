import queries from 'query-string';
import { fetchExec, fetchMapGenericBody } from '@/libs/fetch';
import { propertyGet, propertyGetBoolean } from '@/libs/property';
import { storeCreate } from '@/libs/store';
import { API_URL } from '@/helpers/constants';
import { sessionsWithTokenHeader } from '@/helpers/sessions';

/**
 * @typedef {'categories'|'commodities'|'transactions'
 * |'expenditures'} ResourcesName
 * */

/**
 * @typedef {'INITIAL'|'FETCHING'|'READY'
 * |'UPDATING'} ResourceReadyState
 * */

/**
 * @typedef {{
 *   readyState: ResourceReadyState
 *   initial: boolean
 *   fetching: boolean
 *   pending: boolean
 *   ready: boolean
 *   updating: boolean
 *   READY_STATES: Record<ResourceReadyState>
 * }} ResourceBasicStore
 * */

/**
 * @template ResourcesItem
 * @template {FetchResponse & {
 *   body: FetchGenericData & {
 *     data: boolean
 *   }
 * }} ResourcesExistResponse
 * @template {FetchResponse & {
 *   body: FetchGenericData & {
 *     data: ResourcesItem
 *   }
 * }} ResourcesItemResponse
 * @template {FetchResponse & {
 *   body: FetchGenericData & {
 *     data: Array<ResourcesItem>
 *   }
 * }} ResourcesListResponse
 *
 * @param {ResourcesName} resourceName
 * @param {function(null|Object): ResourcesItem} mapper
 *
 * @return {{
 *   list: function(query?: Object): Promise<ResourcesListResponse>
 *   read: function(params: {
 *     id: string
 *   }): Promise<ResourcesItemResponse>
 *   create: function(params: {
 *     payload: ResourcesItem
 *   }): Promise<ResourcesItemResponse>
 *   update: function(params: {
 *     id: string
 *     payload: Partial<ResourcesItem>
 *   }): Promise<ResourcesItemResponse>
 *   remove: function(params: {
 *     id: string
 *   }): Promise<ResourcesItemResponse>
 *   exist: function(params: {
 *     id: string
 *   }): Promise<ResourcesExistResponse>
 *   empty: function(): ResourcesItem
 * }}
 * */
export function resourcesOperations(resourceName, mapper) {
  if (!resourceName) {
    throw new Error('Invalid "resourceName"');
  }
  if (typeof mapper !== 'function') {
    throw new Error('"mapper" is not a function');
  }

  /**
   * @typedef {Object} ResourceItem
   * */

  /**
   * @param {Object} [query]
   * @return {Promise<ResourceListResponse>}
   * */
  function list(query) {
    const queryString = queries.stringify(query);
    const url = queryString
      ? `${API_URL}/${resourceName}?${queryString}`
      : `${API_URL}/${resourceName}`;

    return fetchExec({
      url,
      options: {
        headers: sessionsWithTokenHeader({}),
      },
      errorTitle: `[${resourceName}] obtaining list failed`,
      bodyMapper: mapResourceListBody,
    });
  }

  /**
   * @typedef {FetchResponse
   *   & { body: ResourceListBody }} ResourceListResponse
   * */

  /**
   * @typedef {FetchGenericData
   *   & { data: Array<ResourceItem> }} ResourceListBody
   * */

  /**
   * @param {Object} params
   * @param {string} params.id
   * @return {Promise<ResourceItemResponse>}
   * */
  function read(params) {
    const { id } = params;
    return fetchExec({
      url: `${API_URL}/${resourceName}/${id}`,
      options: {
        headers: sessionsWithTokenHeader({}),
      },
      errorTitle: `[${resourceName}] obtaining item failed`,
      bodyMapper: mapResourceItemBody,
    });
  }

  /**
   * @typedef {FetchResponse
   *   & { body: ResourceItemBody }} ResourceItemResponse
   * */

  /**
   * @typedef {FetchGenericData
   *   & { data: ResourceItem }} ResourceItemBody
   * */

  /**
   * @param {null|Object} raw
   * @return {ResourceItemBody}
   * */
  function mapResourceItemBody(raw) {
    const { ok, reason } = fetchMapGenericBody(raw);
    const rawData = propertyGet(raw, ['data'], {});
    const data = mapResourceItem(rawData);

    return {
      ok,
      reason,
      data,
    };
  }

  /**
   * @param {null|Object} raw
   * @return {ResourceItem}
   * */
  function mapResourceItem(raw) {
    return mapper(raw);
  }

  /**
   * @param {null|Object} raw
   * @return {ResourceListBody}
   * */
  function mapResourceListBody(raw) {
    const { ok, reason } = fetchMapGenericBody(raw);
    const rawData = propertyGet(raw, ['data'], []);
    /** @type {Array<ResourceItem>} */
    const data = Array.isArray(rawData)
      ? rawData.map((rawItem) => mapResourceItem(rawItem))
      : [];

    return {
      ok,
      reason,
      data,
    };
  }

  /**
   * @param {Object} params
   * @param {ResourceItem} params.payload
   * @return {Promise<ResourceItemResponse>}
   * */
  function create(params) {
    const { payload } = params;
    return fetchExec({
      url: `${API_URL}/${resourceName}`,
      options: {
        method: 'POST',
        headers: sessionsWithTokenHeader({
          'content-type': 'application/json',
        }),
        body: JSON.stringify(payload),
      },
      errorTitle: `[${resourceName}] creating item failed`,
      bodyMapper: mapResourceItemBody,
    });
  }

  /**
   * @param {Object} params
   * @param {string} params.id
   * @param {string} params.payload
   * @return {Promise<ResourceItemResponse>}
   * */
  function update(params) {
    const { id, payload } = params;
    return fetchExec({
      url: `${API_URL}/${resourceName}/${id}`,
      options: {
        method: 'PATCH',
        headers: sessionsWithTokenHeader({
          'content-type': 'application/json',
        }),
        body: JSON.stringify(payload),
      },
      errorTitle: `[${resourceName}] updating item failed`,
      bodyMapper: mapResourceItemBody,
    });
  }

  /**
   * @param {Object} params
   * @param {string} params.id
   * @return {Promise<ResourceItemResponse>}
   * */
  function remove(params) {
    const { id } = params;
    return fetchExec({
      url: `${API_URL}/${resourceName}/${id}`,
      options: {
        method: 'DELETE',
        headers: sessionsWithTokenHeader({}),
      },
      errorTitle: `[${resourceName}] deleting item failed`,
      bodyMapper: mapResourceItemBody,
    });
  }

  /**
   * @param {Object} params
   * @param {string} params.id
   * @return {Promise<ResourceExistResponse>}
   * */
  function exist(params) {
    const { id } = params;
    return fetchExec({
      url: `${API_URL}/${resourceName}/${id}/exist`,
      errorTitle: `[${resourceName}] exist item failed`,
      bodyMapper: mapResourceExistBody,
    });
  }

  /**
   * @typedef {FetchResponse
   *   & { body: ResourceExistBody }} ResourceExistResponse
   * */

  /**
   * @typedef {FetchGenericData
   *   & { data: boolean }} ResourceExistBody
   * */

  /**
   * @param {null|Object} raw
   * @return {ResourceExistBody}
   * */
  function mapResourceExistBody(raw) {
    const { ok, reason } = fetchMapGenericBody(raw);
    const data = propertyGetBoolean(raw, ['data'], false);

    return {
      ok,
      reason,
      data,
    };
  }

  /**
   * @return {ResourceItem}
   * */
  function empty() {
    return mapResourceItem(null);
  }

  return {
    list,
    read,
    create,
    update,
    remove,
    exist,
    empty,
  };
}

/**
 * @template {Object<string, *> & {
 *   id: string
 * }} ResourceStoreItem
 * @template {FetchResponse & {
 *   body: FetchGenericData & {
 *     data: boolean
 *   }
 * }} ResourceStoreExistResponse
 * @template {FetchResponse & {
 *   body: FetchGenericData & {
 *     data: ResourceStoreItem
 *   }
 * }} ResourceStoreItemResponse
 * @template {FetchResponse & {
 *   body: FetchGenericData & {
 *     data: Array<ResourceStoreItem>
 *   }
 * }} ResourceStoreListResponse
 *
 * @param {{
 *   list: function(query?: Object): Promise<ResourceStoreListResponse>
 *   read: function(params: {
 *     id: string
 *   }): Promise<ResourceStoreItemResponse>
 *   create: function(params: {
 *     payload: ResourceStoreItem
 *   }): Promise<ResourceStoreItemResponse>
 *   update: function(params: {
 *     id: string
 *     payload: Partial<ResourceStoreItem>
 *   }): Promise<ResourceStoreItemResponse>
 *   remove: function(params: {
 *     id: string
 *   }): Promise<ResourceStoreItemResponse>
 *   exist: function(params: {
 *     id: string
 *   }): Promise<ResourceStoreExistResponse>
 *   empty: function(): ResourceStoreItem
 * }} operations
 *
 * @return {{
 *   getState: function(): {
 *     readyState: ResourceReadyState
 *     initial: boolean
 *     fetching: boolean
 *     pending: boolean
 *     ready: boolean
 *     updating: boolean
 *     items: Array<ResourceStoreItem>
 *   }
 *   list: function(query?: Object): Promise<void>
 *   read: function(params: {
 *     id: string
 *   }): Promise<void>
 *   create: function(params: {
 *     payload: Partial<ResourceStoreItem>
 *   }): Promise<ResourceStoreItemResponse>
 *   update: function(params: {
 *     id: string
 *     payload: Partial<ResourceStoreItem>
 *   }): Promise<ResourceStoreItemResponse>
 *   remove: function(params: {
 *     id: string
 *   }): Promise<ResourceStoreItemResponse>
 *   useResource: function(): {
 *     readyState: ResourceReadyState
 *     initial: boolean
 *     fetching: boolean
 *     pending: boolean
 *     ready: boolean
 *     updating: boolean
 *     items: Array<ResourceStoreItem>
 *     READY_STATES: Record<ResourceReadyState>
 *   }
 * }}
 * */
export function resourcesStore(operations) {
  const READY_STATES = {
    INITIAL: 'INITIAL',
    FETCHING: 'FETCHING',
    READY: 'READY',
    UPDATING: 'UPDATING',
  };

  const ACTION_TYPES = {
    SET_READY_STATE: 'SET_READY_STATE',
    SET_ITEMS: 'SET_ITEMS',
  };

  /**
   * @typedef {'SET_READY_STATE'|'SET_ITEMS'} ResourceStoreActionType
   * */

  /** @type {ResourceStoreState} */
  const initialState = {
    readyState: READY_STATES.INITIAL,
    initial: true,
    fetching: false,
    pending: true,
    ready: false,
    updating: false,
    items: [],
  };

  /**
   * @typedef {Object} ResourceStoreState
   * @property {ResourceReadyState} readyState
   * @property {boolean} initial
   * @property {boolean} fetching
   * @property {boolean} pending
   * @property {boolean} ready
   * @property {boolean} updating
   * @property {Array<ResourceStoreItem>} items
   * */

  /**
   * @typedef {Object & { id: string }} ResourceStoreItem
   * */

  const { getState, dispatch, useStore } = storeCreate(initialState, reducer);

  /**
   * @typedef {Object} ResourceStorePayload
   * @property {ResourceReadyState} [readyState]
   * @property {Array<ResourceStoreItem>} [items]
   * */

  /**
   * @param {function(Array<ResourceStoreItem>): Array<ResourceStoreItem>} updater
   * @return {void}
   * */
  function updateList(updater) {
    if (typeof updater !== 'function') {
      return;
    }
    const { items: prevList } = getState();
    const nextList = updater(prevList);
    dispatch(ACTION_TYPES.SET_ITEMS, {
      items: nextList,
    });
  }

  /**
   * @param {string} id
   * @param {function(ResourceStoreItem): ResourceStoreItem} updater
   * @return {void}
   * */
  function updateListItem(id, updater) {
    if (typeof updater !== 'function') {
      return;
    }
    updateList((prevList) => {
      return prevList.map((prevItem) => {
        if (prevItem.id === id) {
          return updater(prevItem);
        }
        return prevItem;
      });
    });
  }

  /**
   * @param {Object} [query]
   * @return {Promise<void>}
   * */
  async function list(query) {
    const { readyState: prevReadyState } = getState();
    dispatch(ACTION_TYPES.SET_READY_STATE, {
      readyState: prevReadyState === READY_STATES.READY
        ? READY_STATES.UPDATING
        : READY_STATES.FETCHING,
    });
    const { status, body: { ok, data } } = await operations.list(query);
    if (status === 'success' && ok) {
      dispatch(ACTION_TYPES.SET_ITEMS, {
        items: data,
      });
    }
    dispatch(ACTION_TYPES.SET_READY_STATE, {
      readyState: READY_STATES.READY,
    });
  }

  /**
   * @param {Object} params
   * @param {string} params.id
   * @return {Promise<void>}
   * */
  async function read(params) {
    const { id } = params;
    const { status, body: { ok, data } } = await operations.read({
      id,
    });
    if (status === 'success' && ok) {
      updateList((prevList) => {
        const found = prevList.find((item) => item.id === id);
        if (found) {
          return prevList.map((item) => {
            if (item.id === id) {
              return data;
            }
            return item;
          });
        }
        return prevList.concat([data]);
      });
    }
  }

  /**
   * @param {Object} params
   * @param {Partial<ResourceStoreItem>} params.payload
   * @return {Promise<ResourceStoreItem>}
   * */
  async function create(params) {
    const { payload } = params;
    const response = await operations.create({
      payload,
    });
    const { status, body: { ok, data } } = response;
    if (status === 'success' && ok) {
      updateList((prevList) => {
        return prevList.concat([data]);
      });
    }
    return response;
  }

  /**
   * @param {Object} params
   * @param {string} params.id
   * @param {Partial<ResourceStoreItem>} params.payload
   * @return {Promise<ResourceStoreItem>}
   * */
  async function update(params) {
    const { id, payload } = params;
    const response = await operations.update({
      id,
      payload,
    });
    const { status, body: { ok, data } } = response;
    if (status === 'success' && ok) {
      updateListItem(id, () => data);
    }
    return response;
  }

  /**
   * @param {Object} params
   * @param {string} params.id
   * @return {Promise<void>}
   * */
  async function remove(params) {
    const { id } = params;
    const response = await operations.remove({
      id,
    });
    const { status, body: { ok } } = response;
    if (status === 'success' && ok) {
      updateList((prevList) => {
        return prevList.filter((item) => item.id !== id);
      });
    }
    return response;
  }

  /**
   * @return {UseResourceStore}
   * */
  function useResource() {
    const {
      readyState,
      initial,
      fetching,
      pending,
      ready,
      updating,
      items,
    } = getState();

    useStore();

    return {
      readyState,
      initial,
      fetching,
      pending,
      ready,
      updating,
      items,
      READY_STATES,
    };
  }

  /**
   * @typedef {Object} UseResourceStore
   * @property {ResourceReadyState} readyState
   * @property {boolean} initial
   * @property {boolean} fetching
   * @property {boolean} pending
   * @property {boolean} ready
   * @property {boolean} updating
   * @property {Array<ResourceStoreItem>} items
   * @property {Record<ResourceReadyState>} READY_STATES
   * */

  /**
   * @param {ResourceStoreState} state
   * @param {{
   *   type: ResourceStoreActionType
   *   payload: ResourceStorePayload
   * }} action
   * @return {ResourceStoreState}
   * */
  function reducer(state, action) {
    switch (action.type) {
      case ACTION_TYPES.SET_READY_STATE:
        return {
          ...state,
          readyState: action.payload.readyState,
          initial: action.payload.readyState === READY_STATES.INITIAL,
          fetching: action.payload.readyState === READY_STATES.FETCHING,
          pending: [
            READY_STATES.INITIAL,
            READY_STATES.FETCHING,
          ].includes(action.payload.readyState),
          ready: [
            READY_STATES.READY,
            READY_STATES.UPDATING,
          ].includes(action.payload.readyState),
          updating: action.payload.readyState === READY_STATES.UPDATING,
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

  return {
    getState,
    list,
    read,
    create,
    update,
    remove,
    useResource,
  };
}
