import { propertyGetBoolean, propertyGet } from '@/libs/property';

/** @type {Set<FetchCodeCatcher>} */
const CODE_CATCHERS = new Set();

/**
 * @typedef {function(code: number):
 *   Promise<boolean>} FetchCodeCatcher
 * */

/**
 * @param {FetchCodeCatcher} catcher
 * @return {void}
 * */
export function fetchAddCodeCatcher(catcher) {
  if (typeof catcher === 'function') {
    CODE_CATCHERS.add(catcher);
  }
}

/**
 * @param {string} [baseUrl='']
 * @return {FetchTransport}
 * */
export function fetchTransport(baseUrl = '') {
  return (path = '/', options) => {
    return window.fetch(`${baseUrl}${path}`, options);
  };
}

/**
 * @param {Object} params
 * @param {string} params.url
 * @param {RequestInit} [params.options]
 * @param {string} [params.errorTitle]
 * @param {string} [params.errorMessage]
 * @param {FetchResponseCooker} [params.responseCooker]
 * @param {function(raw: *): *} [params.bodyMapper]
 * @return {Promise<FetchResponse>}
 * */
export async function fetchExec(params) {
  const {
    url,
    options,
    errorTitle = 'Network error occurred',
    errorMessage = '',
    responseCooker = fetchCookResponse,
    bodyMapper = Function.prototype,
  } = params || {};
  /** @type {FetchResponse & { body: * }} */
  const response = {
    status: 'error',
    code: 520,
    errorTitle,
    errorMessage,
  };
  try {
    const transport = fetchTransport();
    const raw = await transport(url, options);
    /** @type {Array<boolean>} */
    const catchersResults = await Promise.all(Array
      .from(CODE_CATCHERS)
      .map((catcher) => catcher(raw.status)));
    if (catchersResults.some((result) => result === false)) {
      response.body = typeof bodyMapper === 'function'
        ? bodyMapper(null)
        : null;
      return response;
    }
    const data = typeof responseCooker === 'function'
      ? await responseCooker(raw)
      : null;
    if (!raw.ok) {
      response.code = raw.status;
      if (data && data.message) {
        response.errorMessage = data.message;
      }
      response.body = typeof bodyMapper === 'function'
        ? bodyMapper(data)
        : null;
      return response;
    }
    response.code = raw.status;
    response.status = 'success';
    response.errorTitle = '';
    response.errorMessage = '';
    response.body = typeof bodyMapper === 'function'
      ? bodyMapper(data)
      : null;
    return response;
  }
  catch (err) {
    response.body = typeof bodyMapper === 'function'
      ? bodyMapper(null)
      : null;
    return response;
  }
}

/** @type {FetchResponseCooker} */
export function fetchCookResponse(raw) {
  if (!raw.ok) {
    return null;
  }
  try {
    return raw.json();
  }
  catch (err) {
    return null;
  }
}

/**
 * @typedef {function(raw: Response):
 *   Promise<*>} FetchResponseCooker
 * */

/**
 * @param {null|Object} raw
 * @return {FetchGenericData}
 * */
export function fetchMapGenericBody(raw) {
  const ok = propertyGetBoolean(raw, ['ok'], false);
  const reason = propertyGet(raw, ['reason'], '');

  return {
    ok,
    reason,
  };
}

/**
 * @param {null|Object} raw
 * @return {FetchOperationBody}
 * */
export function fetchMapOperationBody(raw) {
  const { ok, reason } = fetchMapGenericBody(raw);
  const data = propertyGetBoolean(raw, ['data'], false);

  return {
    ok,
    reason,
    data,
  };
}

/**
 * @typedef {FetchResponse
 * & { body: FetchOperationBody }} FetchOperationResponse
 * */

/**
 * @typedef {FetchGenericData
 * & { data: boolean }} FetchOperationBody
 * */

/**
 * @typedef {function(path: string, options?: RequestInit):
 * Promise<Response>} FetchTransport
 * */

/**
 * @typedef {Object} FetchResponse
 * @property {FetchResponseStatus} status
 * @property {FetchResponseStatusCode} code=520
 * @property {FetchResponseErrorTitle} errorTitle
 * @property {FetchResponseErrorMessage} errorMessage
 * */

/**
 * @typedef {Object} FetchGenericResponse
 * @property {FetchResponseStatus} status
 * @property {FetchResponseStatusCode} code
 * @property {FetchResponseErrorTitle} errorTitle
 * @property {FetchResponseErrorMessage} error
 * @property {FetchGenericData} data
 * */

/**
 * @typedef {'error'|'success'} FetchResponseStatus
 * */

/**
 * @typedef {number} FetchResponseStatusCode
 * */

/**
 * @typedef {string} FetchResponseErrorTitle
 * */

/**
 * @typedef {string} FetchResponseErrorMessage
 * */

/**
 * @typedef {Object} FetchGenericData
 * @property {boolean} ok
 * @property {string} reason
 * */
