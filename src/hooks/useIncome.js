import { resourcesStore } from '@/helpers/resources';
import { incomeOperations } from '@/helpers/income';

const store = resourcesStore(incomeOperations);

export const incomeFetchList = store.list;

export const incomeFetchItem = store.read;

/**
 * @param {Object} params
 * @param {Object} params.payload
 * @param {string} params.payload.id
 * @param {string} params.payload.userId
 * @param {string} params.payload.categoryId
 * @param {string} params.payload.date
 * @param {number} params.payload.sum
 * @param {string} params.payload.comment
 * @return {Promise<FetchResponse & {
 *   body: FetchGenericData & {
 *     data: IncomeItem
 *   }
 * }>}
 * */
export const incomeCreateItem = store.create;

/**
 * @param {Object} params
 * @param {string} params.id
 * @param {Object} params.payload
 * @param {string} params.payload.userId
 * @param {string} params.payload.categoryId
 * @param {string} params.payload.date
 * @param {number} params.payload.sum
 * @param {string} params.payload.comment
 * @return {Promise<FetchResponse & {
 *   body: FetchGenericData & {
 *     data: IncomeItem
 *   }
 * }>}
 * */
export const incomeUpdateItem = store.update;

/**
 * @param {Object} params
 * @param {string} params.id
 * @return {Promise<FetchResponse & {
 *   body: FetchGenericData & {
 *     data: IncomeItem
 *   }
 * }>}
 * */
export const incomeRemoveItem = store.remove;

/**
 * @return {{
 *   readyState: 'INITIAL'|'FETCHING'|'READY'
 *   initial: boolean
 *   fetching: boolean
 *   pending: boolean
 *   ready: boolean
 *   items: Array<IncomeItem>
 *   READY_STATES: Record<'INITIAL'|'FETCHING'|'READY'>
 * }}
 * */
export const useIncome = store.useResource;
