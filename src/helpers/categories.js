import { propertyGet } from '@/libs/property';
import { resourcesOperations } from '@/helpers/resources';

/**
 * @typedef {Object} CategoryItem
 * @property {string} id
 * @property {string} title
 * @property {TransactionType} type
 * */

/**
 * @param {null|Object} raw
 * @return {CategoryItem}
 * */
function mapper(raw) {
  const id = propertyGet(raw, ['id'], '');
  const title = propertyGet(raw, ['title'], '');
  const type = propertyGet(raw, ['type'], 'expense');

  return {
    id,
    title,
    type,
  };
}

const operations = resourcesOperations('categories', mapper);

export const categoriesOperations = operations;

export const categoriesExist = operations.exist;

export const categoriesGetEmpty = operations.empty;

/**
 * @param {string|TransactionType} value
 * @return {boolean}
 * */
export function categoriesInvalidType(value) {
  return !['income', 'expense'].includes(value);
}
