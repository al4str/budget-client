import { resourcesStore } from '@/helpers/resources';
import { transactionsOperations } from '@/helpers/transactions';

const store = resourcesStore(transactionsOperations);

export const transactionsFetchList = store.list;

export const transactionsFetchItem = store.read;

/**
 * @param {Object} params
 * @param {Object} params.payload
 * @param {string} params.payload.id
 * @param {TransactionType} params.payload.type
 * @param {string} params.payload.userId
 * @param {string} params.payload.categoryId
 * @param {string} params.payload.date
 * @param {string} params.payload.sum
 * @param {string} params.payload.comment
 * @return {Promise<FetchResponse & {
 *   body: FetchGenericData & {
 *     data: TransactionItem
 *   }
 * }>}
 * */
export const transactionsCreateItem = store.create;

/**
 * @param {Object} params
 * @param {string} params.id
 * @param {Object} params.payload
 * @param {TransactionType} params.payload.type
 * @param {string} params.payload.userId
 * @param {string} params.payload.categoryId
 * @param {string} params.payload.date
 * @param {string} params.payload.sum
 * @param {string} params.payload.comment
 * @return {Promise<FetchResponse & {
 *   body: FetchGenericData & {
 *     data: TransactionItem
 *   }
 * }>}
 * */
export const transactionsUpdateItem = store.update;

/**
 * @param {Object} params
 * @param {string} params.id
 * @return {Promise<FetchResponse & {
 *   body: FetchGenericData & {
 *     data: TransactionItem
 *   }
 * }>}
 * */
export const transactionsRemoveItem = store.remove;

/**
 * @return {{
 *   readyState: 'INITIAL'|'FETCHING'|'READY'
 *   initial: boolean
 *   fetching: boolean
 *   pending: boolean
 *   ready: boolean
 *   items: Array<TransactionItem>
 *   READY_STATES: Record<'INITIAL'|'FETCHING'|'READY'>
 * }}
 * */
export const useTransactions = store.useResource;
