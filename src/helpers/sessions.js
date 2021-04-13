import { propertyGet } from '@/libs/property';
import { fetchExec, fetchMapGenericBody } from '@/libs/fetch';
import { storageGet, storageSet, storageRemove } from '@/libs/localStorage';
import { API_URL } from '@/helpers/constants';

/**
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.userPIN
 * @return {Promise<SessionsTokenResponse>}
 * */
export function sessionsObtainToken(params) {
  const { userId, userPIN } = params;
  return fetchExec({
    url: `${API_URL}/sessions/token/${userId}`,
    options: {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        pin: userPIN,
      }),
    },
    errorTitle: '[sessions] obtaining token failed',
    bodyMapper: mapTokenBody,
  });
}

/**
 * @typedef {FetchResponse
 * & { body: SessionsTokenBody }} SessionsTokenResponse
 * */

/**
 * @typedef {FetchGenericData
 * & { data: string }} SessionsTokenBody
 * */

/**
 * @param {Object} raw
 * @return {SessionsTokenBody}
 * */
function mapTokenBody(raw) {
  const { ok, reason } = fetchMapGenericBody(raw);
  const data = propertyGet(raw, ['data'], '');

  return {
    ok,
    reason,
    data,
  };
}

/**
 * @return {Promise<FetchResponse>}
 * */
export function sessionsValidateToken() {
  const token = sessionsTokenFromStorage();
  return fetchExec({
    url: `${API_URL}/sessions/validate`,
    options: {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        token,
      }),
    },
    errorTitle: '[sessions] validating token failed',
    responseCooker: null,
    bodyMapper: null,
  });
}

const STORAGE_KEY = 'TOKEN';

/**
 * @return {string}
 * */
export function sessionsTokenFromStorage() {
  return storageGet(STORAGE_KEY, '');
}

/**
 * @param {string} token
 * @return {void}
 * */
export function sessionsTokenToStorage(token) {
  storageSet(STORAGE_KEY, token);
}

/**
 * @return {void}
 * */
export function sessionsTokenWipe() {
  storageRemove(STORAGE_KEY);
}

/**
 * @return {{ 'X-Token': string }}
 * */
export function sessionsTokenHeader() {
  return {
    'X-Token': sessionsTokenFromStorage(),
  };
}

/**
 * @template {Object<string, string>} T
 * @param {T} [headers={}]
 * @return {T}
 * */
export function sessionsWithTokenHeader(headers) {
  return {
    ...(typeof headers === 'object' && headers ? headers : {}),
    'X-Token': sessionsTokenFromStorage(),
  };
}
