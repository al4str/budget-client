import { idGet } from '@/libs/id';
import { propertyGet, propertyGetBoolean } from '@/libs/property';

/**
 * @typedef {Object} ExpenditureItem
 * @property {string} tempId
 * @property {string} commodityId
 * @property {number} amount
 * @property {boolean} essential
 * */

/**
 * @param {null|Object|Array} raw
 * @return {Array<ExpenditureItem>}
 * */
export function expendituresMapItems(raw) {
  return Array.isArray(raw)
    ? raw.map((rawItem) => expendituresMapItem(rawItem))
    : [];
}

/**
 * @param {null|Object} raw
 * @return {ExpenditureItem}
 * */
export function expendituresMapItem(raw) {
  const tempId = idGet();
  const commodityId = propertyGet(raw, ['commodityId'], '');
  const amount = propertyGet(raw, ['amount'], 0);
  const essential = propertyGetBoolean(raw, ['essential'], false);

  return {
    tempId,
    commodityId,
    amount,
    essential,
  };
}
