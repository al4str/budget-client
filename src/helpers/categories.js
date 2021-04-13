import { propertyGet } from '@/libs/property';
import { resourcesOperations } from '@/helpers/resources';

/**
 * @typedef {Object} CategoryItem
 * @property {string} id
 * @property {string} title
 * @property {CategoryType} type
 * */

/**
 * @typedef {'income'|'expense'} CategoryType
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

/**
 * @return {CategoryItem}
 * */
export const categoriesGetEmpty = operations.empty;

/**
 * @param {string|CategoryType} value
 * @return {boolean}
 * */
export function categoriesInvalidType(value) {
  return !['income', 'expense'].includes(value);
}
