import { resourcesStore } from '@/helpers/resources';
import { categoriesOperations } from '@/helpers/categories';

const store = resourcesStore(categoriesOperations);

export const categoriesFetchList = store.list;

export const categoriesFetchItem = store.read;

/**
 * @param {Object} params
 * @param {Object} params.payload
 * @param {string} params.payload.id
 * @param {string} params.payload.title
 * @param {TransactionType} params.payload.type
 * @return {Promise<FetchResponse & {
 *   body: FetchGenericData & {
 *     data: CategoryItem
 *   }
 * }>}
 * */
export const categoriesCreateItem = store.create;

/**
 * @param {Object} params
 * @param {string} params.id
 * @param {Object} params.payload
 * @param {string} params.payload.title
 * @param {TransactionType} params.payload.type
 * @return {Promise<FetchResponse & {
 *   body: FetchGenericData & {
 *     data: CategoryItem
 *   }
 * }>}
 * */
export const categoriesUpdateItem = store.update;

/**
 * @param {Object} params
 * @param {string} params.id
 * @return {Promise<FetchResponse & {
 *   body: FetchGenericData & {
 *     data: CategoryItem
 *   }
 * }>}
 * */
export const categoriesRemoveItem = store.remove;

export const useCategories = store.useResource;
