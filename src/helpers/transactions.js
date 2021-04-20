import { propertyGet } from '@/libs/property';
import { resourcesOperations } from '@/helpers/resources';
import { categoriesGetState } from '@/hooks/useCategories';

/**
 * @typedef {'income'|'expense'} TransactionType
 * */

/**
 * @typedef {Object} TransactionItem
 * @property {string} id
 * @property {string} userId
 * @property {string} categoryId
 * @property {string} date
 * @property {number} sum
 * @property {string} comment
 * */

/**
 * @param {null|Object} raw
 * @return {TransactionItem}
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

const operations = resourcesOperations('transactions', mapper);

export const transactionsOperations = operations;

export const transactionsExist = operations.exist;

export const transactionsGetEmpty = operations.empty;

/**
 * @param {TransactionItem} item
 * @return {TransactionType}
 * */
export function transactionsGetType(item) {
  const { items: categories } = categoriesGetState();
  const { type } = categories.find((category) => category.id === item.categoryId)
    || { type: 'expense' };

  return type;
}
