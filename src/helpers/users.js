import { fetchExec, fetchMapGenericBody } from '@/libs/fetch';
import { propertyGet } from '@/libs/property';
import { API_URL } from '@/helpers/constants';
import { sessionsWithTokenHeader } from '@/helpers/sessions';

/**
 * @return {Promise<UsersItemsListResponse>}
 * */
export function usersObtainList() {
  return fetchExec({
    url: `${API_URL}/users`,
    options: {
      headers: sessionsWithTokenHeader({}),
    },
    errorTitle: '[users] obtaining users list failed',
    bodyMapper: mapUsersListBody,
  });
}

/**
 * @typedef {FetchResponse
 * & { body: UsersItemsListBody }} UsersItemsListResponse
 * */

/**
 * @typedef {FetchGenericData
 * & { data: Array<UsersItem> }} UsersItemsListBody
 * */

/**
 * @param {null|Object} raw
 * @return {UsersItemBody}
 * */
function mapUsersListBody(raw) {
  const { ok, reason } = fetchMapGenericBody(raw);
  const rawData = propertyGet(raw, ['data'], []);
  /** @type {Array<UsersItem>} */
  const data = Array.isArray(rawData)
    ? rawData.map((rawItem) => mapUsersItem(rawItem))
    : [];

  return {
    ok,
    reason,
    data,
  };
}

/**
 * @param {Object} params
 * @param {string} params.userId
 * @return {Promise<UsersItemResponse>}
 * */
export function usersObtain(params) {
  const { userId } = params;
  return fetchExec({
    url: `${API_URL}/users/${userId}`,
    options: {
      headers: sessionsWithTokenHeader({}),
    },
    errorTitle: '[users] obtaining user failed',
    bodyMapper: mapUsersItemBody,
  });
}

/**
 * @typedef {FetchResponse
 * & { body: UsersItemBody }} UsersItemResponse
 * */

/**
 * @typedef {FetchGenericData
 * & { data: UsersItem }} UsersItemBody
 * */

/**
 * @param {null|Object} raw
 * @return {UsersItemBody}
 * */
function mapUsersItemBody(raw) {
  const { ok, reason } = fetchMapGenericBody(raw);
  const rawData = propertyGet(raw, ['data'], {});
  const data = mapUsersItem(rawData);

  return {
    ok,
    reason,
    data,
  };
}

/**
 * @typedef {Object} UsersItem
 * @property {string} id
 * @property {string} name
 * @property {string} avatarId
 * */

/**
 * @param {null|Object} raw
 * @return {UsersItem}
 * */
function mapUsersItem(raw) {
  const id = propertyGet(raw, ['id'], '');
  const name = propertyGet(raw, ['name'], '');
  const avatarId = propertyGet(raw, ['avatarId'], '');

  return {
    id,
    name,
    avatarId,
  };
}

/**
 * @return {UsersItem}
 * */
export function usersGetEmptyItem() {
  return {
    id: '',
    name: '',
    avatarId: '',
  };
}

/**
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.name
 * @return {Promise<UsersItemResponse>}
 * */
export function usersUpdate(params) {
  const { userId, name } = params;
  return fetchExec({
    url: `${API_URL}/users/${userId}`,
    options: {
      method: 'PATCH',
      headers: sessionsWithTokenHeader({
        'content-type': 'application/json',
      }),
      body: JSON.stringify({
        name,
      }),
    },
    errorTitle: '[users] updating user failed',
    bodyMapper: mapUsersItemBody,
  });
}

/**
 * @param {Object} params
 * @param {string} params.userId
 * @param {File} params.file
 * @return {Promise<UsersUploadAvatarResponse>}
 * */
export function usersUploadAvatar(params) {
  const { userId, file } = params;
  const formData = new window.FormData();
  formData.append('file', file);
  return fetchExec({
    url: `${API_URL}/users/${userId}/avatar`,
    options: {
      method: 'POST',
      headers: sessionsWithTokenHeader({}),
      body: formData,
    },
    errorTitle: '[users] uploading user avatar failed',
    bodyMapper: mapUsersUploadAvatarBody,
  });
}

/**
 * @typedef {FetchResponse
 * & { body: UsersUploadAvatarBody }} UsersUploadAvatarResponse
 * */

/**
 * @typedef {FetchGenericData
 * & { data: string }} UsersUploadAvatarBody
 * */

/**
 * @param {null|Object} raw
 * @return {UsersUploadAvatarBody}
 * */
function mapUsersUploadAvatarBody(raw) {
  const { ok, reason } = fetchMapGenericBody(raw);
  const data = propertyGet(raw, ['data'], '');

  return {
    ok,
    reason,
    data,
  };
}

/**
 * @param {string} userId
 * @param {string} avatarId
 * @return {string}
 * */
export function usersGetAvatarURL(userId, avatarId) {
  if (!userId || !avatarId) {
    return '';
  }
  return `${API_URL}/users/${userId}/avatar/${avatarId}`;
}
