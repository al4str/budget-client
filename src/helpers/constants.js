export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const STORAGE_PREFIX = 'FINANCES';

/** @type {'local'|'prod'} */
export const DEPLOY_ENV = process.env.DEPLOY_ENV || 'local';

/** @type {string} */
export const API_URL = '/api';

/** @type {string} */
export const APP_VERSION = process.env.PACKAGE_VERSION || '0.0.0';

export const ASSETS_VAR_NAME = '__ASSETS_MAP__';

export const ROUTE_CHUNKS_VAR_NAME = '__ROUTES_CHUNKS_MAP__';
