import { resourcesStore } from '@/helpers/resources';
import { expensesOperations } from '@/helpers/expenses';

const store = resourcesStore(expensesOperations);

export const expensesFetchList = store.list;

export const expensesFetchItem = store.read;

/**
 * @param {Object} params
 * @param {Object} params.payload
 * @param {string} params.payload.id
 * @param {string} params.payload.userId
 * @param {string} params.payload.categoryId
 * @param {string} params.payload.date
 * @param {string} params.payload.sum
 * @param {string} params.payload.comment
 * @return {Promise<FetchResponse & {
 *   body: FetchGenericData & {
 *     data: ExpensesItem
 *   }
 * }>}
 * */
export const expensesCreateItem = store.create;

/**
 * @param {Object} params
 * @param {string} params.id
 * @param {Object} params.payload
 * @param {string} params.payload.userId
 * @param {string} params.payload.categoryId
 * @param {string} params.payload.date
 * @param {string} params.payload.sum
 * @param {string} params.payload.comment
 * @return {Promise<FetchResponse & {
 *   body: FetchGenericData & {
 *     data: ExpensesItem
 *   }
 * }>}
 * */
export const expensesUpdateItem = store.update;

/**
 * @param {Object} params
 * @param {string} params.id
 * @return {Promise<FetchResponse & {
 *   body: FetchGenericData & {
 *     data: ExpensesItem
 *   }
 * }>}
 * */
export const expensesRemoveItem = store.remove;

/**
 * @return {{
 *   readyState: 'INITIAL'|'FETCHING'|'READY'
 *   initial: boolean
 *   fetching: boolean
 *   pending: boolean
 *   ready: boolean
 *   items: Array<ExpensesItem>
 *   READY_STATES: Record<'INITIAL'|'FETCHING'|'READY'>
 * }}
 * */
export const useExpenses = store.useResource;
