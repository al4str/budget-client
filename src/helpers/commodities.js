import { propertyGet } from '@/libs/property';
import { resourcesOperations } from '@/helpers/resources';

/**
 * @typedef {Object} CommodityItem
 * @property {string} id
 * @property {string} title
 * @property {string} categoryId
 * */

/**
 * @param {null|Object} raw
 * @return {CommodityItem}
 * */
function mapper(raw) {
  const id = propertyGet(raw, ['id'], '');
  const title = propertyGet(raw, ['title'], '');
  const categoryId = propertyGet(raw, ['categoryId'], '');

  return {
    id,
    title,
    categoryId,
  };
}

const operations = resourcesOperations('commodities', mapper);

export const commoditiesOperations = operations;

export const commoditiesExist = operations.exist;

/** @type {function(): CommodityItem} */
export const commoditiesGetEmpty = operations.empty;
