import { ROUTE_CHUNKS_VAR_NAME } from '@/helpers/constants';
import { getRouteParams } from '@/helpers/routes';

/** @type {{ [string]: Array<string> }} */
const ROUTE_CHUNKS_MAP = window[ROUTE_CHUNKS_VAR_NAME];

/** @type {{ prefetch: Array<string>, preload: Array<string>}} */
const ROUTE_STATES = {
  prefetch: [],
  preload: [],
};

/**
 * @return {void}
 * */
export function chunksPreloadCurrentRoute() {
  prepareChunksByRoute(window.location.pathname, 'preload').then();
}

/**
 * @param {string} routePath
 * @return {void}
 * */
export function chunksPrefetchRoute(routePath) {
  if (ROUTE_STATES.prefetch.includes(routePath)) {
    return;
  }
  prepareChunksByRoute(routePath, 'prefetch').then();
}

const observer = new window.IntersectionObserver(handleIntersection);

/**
 * @param {Array<IntersectionObserverEntry>} entries
 * @return {void}
 * */
function handleIntersection(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.target instanceof HTMLAnchorElement) {
      prepareChunksByRoute(entry.target.pathname, 'prefetch').then();
    }
  });
}

/**
 * @param {HTMLElement} link
 * @return {void}
 * */
export function chunksWatchLink(link) {
  if (link instanceof HTMLAnchorElement && link.host === window.location.host) {
    if (ROUTE_STATES.preload.includes(link.pathname)) {
      return;
    }
    observer.observe(link);
  }
}

/**
 * @param {HTMLAnchorElement} link
 * @return {void}
 * */
export function chunksUnWatchLink(link) {
  if (link instanceof HTMLAnchorElement) {
    observer.unobserve(link);
  }
}

/**
 * @param {string} routePath
 * @param {string|'prefetch'|'preload'} [hint='prefetch']
 * @return {Promise}
 * */
function prepareChunksByRoute(routePath, hint) {
  return new Promise((resolve) => {
    const routeParams = getRouteParams(routePath);
    const chunkNames = routeParams.chunks;
    if (!chunkNames.length) {
      resolve();
      return;
    }
    /** @type {Array<string>} */
    const chunks = chunkNames.reduce((result, chunkName) => {
      return result.concat(ROUTE_CHUNKS_MAP[chunkName] || []);
    }, []);
    if (!chunks.length) {
      resolve();
      return;
    }
    /** @type {Array<HTMLLinkElement>} */
    const links = chunks
      .reduce((result, url) => {
        if (!result.includes(url)) {
          return result.concat([url]);
        }
        return result;
      }, [])
      .filter((url) => {
        const selector = `link[rel="${hint}"][href="${url}"]`;
        return !window.document.head.querySelector(selector);
      })
      .map((url) => {
        const link = window.document.createElement('link');
        link.rel = hint;
        link.crossOrigin = 'anonymous';
        link.as = getDirective(url);
        link.href = url;

        return link;
      });
    Promise
      .all(links.map((link) => getLoadPromise(link)))
      .then(resolve);
  });
}

/**
 * @param {string} url
 * @return {string|'script'|'style'}
 * */
function getDirective(url) {
  if (/\.css$/i.test(url)) {
    return 'style';
  }
  if (/\.js$/i.test(url)) {
    return 'script';
  }
  return '';
}

/**
 * @param {HTMLLinkElement} link
 * @return {Promise}
 * */
function getLoadPromise(link) {
  return new Promise((resolve) => {
    link.onload = resolve;
    link.onerror = resolve;
    window.document.head.appendChild(link);
  });
}
