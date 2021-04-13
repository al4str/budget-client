import { resourcesStore } from '@/helpers/resources';
import { expendituresOperations } from '@/helpers/expenditures';

const store = resourcesStore(expendituresOperations);

export const expendituresFetchList = store.list;

export const expendituresFetchItem = store.read;

/**
 * @param {Object} params
 * @param {Object} params.payload
 * @param {string} params.payload.id
 * @param {string} params.payload.expenseId
 * @param {string} params.payload.commodityId
 * @param {number} params.payload.amount
 * @param {boolean} params.payload.essential
 * @return {Promise<FetchResponse & {
 *   body: FetchGenericData & {
 *     data: ExpenditureItem
 *   }
 * }>}
 * */
export const expendituresCreateItem = store.create;

/**
 * @param {Object} params
 * @param {string} params.id
 * @param {Object} params.payload
 * @param {string} params.payload.expenseId
 * @param {string} params.payload.commodityId
 * @param {number} params.payload.amount
 * @param {boolean} params.payload.essential
 * @return {Promise<FetchResponse & {
 *   body: FetchGenericData & {
 *     data: ExpenditureItem
 *   }
 * }>}
 * */
export const expendituresUpdateItem = store.update;

/**
 * @param {Object} params
 * @param {string} params.id
 * @return {Promise<FetchResponse & {
 *   body: FetchGenericData & {
 *     data: ExpenditureItem
 *   }
 * }>}
 * */
export const expendituresRemoveItem = store.remove;

export const useExpenditures = store.useResource;
