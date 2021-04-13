require('dotenv').config();
const path = require('path');
const packageInfo = require('../package.json');

const ROOT_DIR = process.cwd();

const DIST_DIR = path.join(ROOT_DIR, 'dist');

const LEGACY_DIR = path.join(ROOT_DIR, 'dist', 'legacy');

const MODERN_DIR = path.join(ROOT_DIR, 'dist', 'modern');

const APP_NAME = packageInfo.name;

const VERSION = packageInfo.version;

const PORT = process.env.DEV_PORT;

const HOST = process.env.DEV_HOST;

const API_URL = process.env.API_URL;

const SSL_KEY = path.join(ROOT_DIR, 'ssl', 'key.pem');

const SSL_CERT = path.join(ROOT_DIR, 'ssl', 'cert.pem');

const FRAMEWORK_PACKAGES = [
  'react',
  'react-dom',
  'react-router',
  'react-router-dom',
  'react-is',
  'scheduler',
  'prop-types',
];

const LINKS = [
  {
    originalPath: 'favicons/favicon.ico',
    attributes: {
      rel: 'shortcut icon',
      type: 'image/x-icon',
    },
  },
  {
    originalPath: 'favicons/favicon-32x32.png',
    attributes: {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
    },
  },
  {
    originalPath: 'favicons/favicon-16x16.png',
    attributes: {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
    },
  },
];

const ASSETS_VAR_NAME = '__ASSETS_MAP__';

const ROUTES_CHUNKS_VAR_NAME = '__ROUTES_CHUNKS_MAP__';

const PUBLIC_PATH = '/';

/** @type {BuildConstants} */
module.exports = {
  ROOT_DIR,
  DIST_DIR,
  LEGACY_DIR,
  MODERN_DIR,
  APP_NAME,
  VERSION,
  PORT,
  HOST,
  API_URL,
  SSL_KEY,
  SSL_CERT,
  FRAMEWORK_PACKAGES,
  LINKS,
  ASSETS_VAR_NAME,
  ROUTES_CHUNKS_VAR_NAME,
  PUBLIC_PATH,
};

/**
 * @typedef {Object} BuildConstants
 * @property {string} ROOT_DIR
 * @property {string} DIST_DIR
 * @property {string} LEGACY_DIR
 * @property {string} MODERN_DIR
 * @property {string} APP_NAME
 * @property {string} VERSION
 * @property {string} PORT
 * @property {string} HOST
 * @property {API_URL} HOST
 * @property {string} SSL_KEY
 * @property {string} SSL_CERT
 * @property {Array<string>} FRAMEWORK_PACKAGES
 * @property {Array<BuildConstantsLink>} LINKS
 * @property {string} ASSETS_VAR_NAME
 * @property {string} ROUTES_CHUNKS_VAR_NAME
 * @property {string} PUBLIC_PATH
 * */

/**
 * @typedef {Object} BuildConstantsLink
 * @property {string} originalPath
 * @property {Object<string, string>} attributes
 * */
