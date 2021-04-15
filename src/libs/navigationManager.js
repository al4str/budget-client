import { createBrowserHistory } from 'history';
import { scrollToY } from '@/libs/scroll';
import { routeMountSubscribe } from '@/libs/routeMounting';
import { routesGetParams } from '@/helpers/routes';

window.history.scrollRestoration = 'manual';

const history = createBrowserHistory();

/** @type {Array<HistoryLocation>} */
const locations = [];

locations.push(history.location);

/** @type {Map<string, number>} */
const scrollMap = new Map();

history.listen(handleHistoryChange);

/**
 * @return {History}
 * */
export function historyGet() {
  return history;
}

/**
 * @return {string}
 * */
export function historyGetCurrentLocationKey() {
  return history.location.key;
}

/**
 * @return {string}
 * */
export function historyGetCurrentLocationPathname() {
  return history.location.pathname;
}

/**
 * @return {void}
 * */
export function historyGoBack() {
  history.goBack();
}

/**
 * @param {string} pathname
 * @return {void}
 * */
export function historyPush(pathname) {
  history.push(pathname);
}

/**
 * @param {HistoryLocation} nextLocation
 * @return {void}
 * */
function handleHistoryChange(nextLocation) {
  const currentLocationScroll = window.pageYOffset;
  const nextLocationKey = nextLocation.key;
  const nextLocationPathname = nextLocation.pathname;
  const currentLocation = locations.length > 0
    ? locations[locations.length - 1]
    : { key: '', pathname: '' };
  const currentLocationKey = currentLocation.key;
  const prevLocation = locations.length > 1
    ? locations[locations.length - 2]
    : { key: '', pathname: '' };
  const prevLocationKey = prevLocation.key;
  const prevLocationScroll = prevLocationKey && nextLocationKey === prevLocationKey
    ? scrollMap.get(nextLocationKey)
    : null;
  locations.push(nextLocation);
  scrollMap.set(currentLocationKey, currentLocationScroll);
  const routeParams = routesGetParams(nextLocationPathname);
  if (!routeParams.scrollTo) {
    return;
  }
  if (prevLocationScroll) {
    routeMountSubscribe(nextLocationKey, (locationKey) => {
      if (locationKey === nextLocationKey) {
        setTimeout(() => {
          scrollToY(prevLocationScroll || 0);
        }, 10);
      }
    });
  }
  else if (routeParams.scrollTo === 'top') {
    window.requestAnimationFrame(() => {
      scrollToY(0);
    });
  }
  else if (routeParams.scrollTo === 'bottom') {
    window.requestAnimationFrame(() => {
      scrollToY(window.document.body.scrollHeight);
    });
  }
}

/**
 * @typedef {Object} HistoryLocation
 * @property {string} key
 * @property {string} pathname
 * */
