import { storageGet, storageSet } from '@/libs/localStorage';
import { fetchExec } from '@/libs/fetch';
import { APP_VERSION as CURRENT_VERSION } from '@/helpers/constants';
import { NOTIFICATIONS_TYPES } from '@/helpers/notifications';
import { i18nGetTranslations } from '@/hooks/useI18n';
import { isViewportHiddenSubscribe } from '@/hooks/useIsViewportHidden';
import { notificationsAdd } from '@/hooks/useNotifications';

const STORAGE_KEY = 'VERSION';

const INTERVAL = 15 * 60 * 1000;

let INTERVAL_REF = null;

/**
 * @return {void}
 * */
export function isAppStaleInit() {
  INTERVAL_REF = setInterval(checkVersion, INTERVAL);
  isViewportHiddenSubscribe((hidden) => {
    if (hidden) {
      clearInterval(INTERVAL_REF);
    }
    if (!hidden) {
      checkVersion().then();
      clearInterval(INTERVAL_REF);
      INTERVAL_REF = setInterval(checkVersion, INTERVAL);
    }
  });
}

async function checkVersion() {
  const nextVersion = await fetchVersion();
  storageSet(STORAGE_KEY, nextVersion);
  if (isStale()) {
    showWarning();
  }
}

let WARNING_SHOWN = false;

function showWarning() {
  if (WARNING_SHOWN) {
    return;
  }
  WARNING_SHOWN = true;
  const version = getStoredVersion().toString();
  const {
    staleTitle,
    staleMessage,
  } = i18nGetTranslations({
    staleTitle: 'warning.stale.title',
    staleMessage: 'warning.stale.message',
  });
  notificationsAdd({
    type: NOTIFICATIONS_TYPES.WARNING,
    showCloseButton: false,
    title: `${staleTitle} (v${version})`,
    text: staleMessage,
    withClose: false,
    autoClose: false,
  });
}

/**
 * @return {boolean}
 * */
function isStale() {
  const stored = getStoredVersion();
  const current = parseVersion(CURRENT_VERSION || '');
  return compareVersions(current, stored) < 0;
}

/**
 * @return {IsAppStaleParsedVersion}
 * */
function getStoredVersion() {
  const rawVersion = storageGet(STORAGE_KEY) || '';
  return parseVersion(rawVersion);
}

/**
 * @param {IsAppStaleParsedVersion} a
 * @param {IsAppStaleParsedVersion} b
 * @return {number}
 * */
function compareVersions(a, b) {
  return a.major - b.major
    || a.minor - b.minor
    || a.patch - b.patch;
}

/**
 * @param {string} rawVersion
 * @return {IsAppStaleParsedVersion}
 * */
function parseVersion(rawVersion) {
  const matches = /(0|[1-9]*)\.(0|[1-9]*)\.(0|[1-9]*)/.exec(rawVersion);
  const [, major = '0', minor = '0', patch = '0'] = matches || [];
  return {
    major: parseInt(major, 10),
    minor: parseInt(minor, 10),
    patch: parseInt(patch, 10),
    toString() {
      return `${this.major}.${this.minor}.${this.patch}`;
    },
  };
}

/**
 * @typedef {Object} IsAppStaleParsedVersion
 * @property {number} major
 * @property {number} minor
 * @property {number} patch
 * @property {function(): string} toString
 * */

/**
 * @return {Promise<string>}
 * */
async function fetchVersion() {
  try {
    /** @type {FetchResponse & { body: { version: string } }} */
    const response = await fetchExec({
      url: '/meta.json',
      options: {
        cache: 'no-store',
      },
      bodyMapper(raw) {
        return raw;
      },
    });
    return response.body.version;
  }
  catch (err) {
    return '';
  }
}
