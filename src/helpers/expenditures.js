import { propertyGet, propertyGetBoolean } from '@/libs/property';
import { resourcesOperations } from '@/helpers/resources';

/**
 * @typedef {Object} ExpenditureItem
 * @property {string} id
 * @property {string} expenseId
 * @property {string} commodityId
 * @property {number} amount
 * @property {boolean} essential
 * */

/**
 * @param {null|Object} raw
 * @return {ExpenditureItem}
 * */
function mapper(raw) {
  const id = propertyGet(raw, ['id'], '');
  const expenseId = propertyGet(raw, ['expenseId'], '');
  const commodityId = propertyGet(raw, ['commodityId'], '');
  const amount = propertyGet(raw, ['amount'], 0);
  const essential = propertyGetBoolean(raw, ['essential'], false);

  return {
    id,
    expenseId,
    commodityId,
    amount,
    essential,
  };
}

const operations = resourcesOperations('expenditures', mapper);

export const expendituresOperations = operations;

export const expendituresExist = operations.exist;

/**
 * @return {ExpenditureItem}
 * */
export const expendituresGetEmpty = operations.empty;
