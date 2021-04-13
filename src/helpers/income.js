import { propertyGet } from '@/libs/property';
import { resourcesOperations } from '@/helpers/resources';

/**
 * @typedef {Object} IncomeItem
 * @property {string} id
 * @property {string} userId
 * @property {string} categoryId
 * @property {string} date
 * @property {number} sum
 * @property {string} comment
 * */

/**
 * @param {null|Object} raw
 * @return {IncomeItem}
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

const operations = resourcesOperations('income', mapper);

export const incomeOperations = operations;

export const incomeExist = operations.exist;

/**
 * @return {IncomeItem}
 * */
export const incomeGetEmpty = operations.empty;
