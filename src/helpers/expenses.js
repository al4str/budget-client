import { propertyGet } from '@/libs/property';
import { resourcesOperations } from '@/helpers/resources';

/**
 * @typedef {Object} ExpensesItem
 * @property {string} id
 * @property {string} userId
 * @property {string} categoryId
 * @property {string} date
 * @property {number} sum
 * @property {string} comment
 * */

/**
 * @param {null|Object} raw
 * @return {ExpensesItem}
 * */
function mapper(raw) {
  const id = propertyGet(raw, ['id'], '');
  const userId = propertyGet(raw, ['userId'], '');
  const categoryId = propertyGet(raw, ['categoryId'], '');
  const date = propertyGet(raw, ['date'], '');
  const sum = propertyGet(raw, ['sum'], 0);
  const comment = propertyGet(raw, ['comment'], '');

  return {
    id,
    userId,
    categoryId,
    date,
    sum,
    comment,
  };
}

const operations = resourcesOperations('expenses', mapper);

export const expensesOperations = operations;

export const expensesExist = operations.exist;

/**
 * @return {ExpensesItem}
 * */
export const expensesGetEmpty = operations.empty;
