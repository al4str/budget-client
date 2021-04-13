/** @type {Map<string, Set<function(string): void>>} */
const subscribers = new Map();

let lastLocationKey = '';

/**
 * @param {string} locationKey
 * @param {function(string): void} subscriber
 * @return {void}
 * */
export function routeMountSubscribe(locationKey, subscriber) {
  if (lastLocationKey === locationKey) {
    subscriber(locationKey);
    return;
  }
  const prevSubs = subscribers.get(locationKey) || new Set();
  const nextSubs = prevSubs.add(subscriber);
  subscribers.set(locationKey, nextSubs);
}

/**
 * @param {string} locationKey
 * @return {void}
 * */
export function routeMountPublish(locationKey) {
  lastLocationKey = locationKey;
  const subs = subscribers.get(locationKey) || new Set();
  subs.forEach((sub) => {
    sub(locationKey);
  });
  subscribers.set(locationKey, new Set());
}
