import { propertyGet } from '@/libs/property';
import { resourcesOperations } from '@/helpers/resources';
import { expendituresMapItems } from '@/helpers/expenditures';

/**
 * @typedef {'income'|'expense'} TransactionType
 * */

/**
 * @typedef {Object} TransactionItem
 * @property {string} id
 * @property {TransactionType} type
 * @property {string} userId
 * @property {string} categoryId
 * @property {string} date
 * @property {number} sum
 * @property {string} comment
 * @property {Array<ExpenditureItem>} expenditures
 * */

/**
 * @param {null|Object} raw
 * @return {TransactionItem}
 * */
function mapper(raw) {
  const id = propertyGet(raw, ['id'], '');
  const type = propertyGet(raw, ['type'], 'expense');
  const userId = propertyGet(raw, ['userId'], '');
  const categoryId = propertyGet(raw, ['categoryId'], '');
  const date = propertyGet(raw, ['date'], '');
  const sum = propertyGet(raw, ['sum'], 0);
  const comment = propertyGet(raw, ['comment'], '');
  const rawExpenditures = propertyGet(raw, ['expenditures'], []);
  const expenditures = expendituresMapItems(rawExpenditures);

  return {
    id,
    type,
    userId,
    categoryId,
    date,
    sum,
    comment,
    expenditures,
  };
}

const operations = resourcesOperations('transactions', mapper);

export const transactionsOperations = operations;

export const transactionsExist = operations.exist;

export const transactionsGetEmpty = operations.empty;
