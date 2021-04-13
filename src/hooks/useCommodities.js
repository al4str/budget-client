import { resourcesStore } from '@/helpers/resources';
import { commoditiesOperations } from '@/helpers/commodities';

const store = resourcesStore(commoditiesOperations);

export const commoditiesFetchList = store.list;

export const commoditiesFetchItem = store.read;

/**
 * @param {Object} params
 * @param {Object} params.payload
 * @param {string} params.payload.id
 * @param {string} params.payload.title
 * @param {string} params.payload.categoryId
 * @return {Promise<FetchResponse & {
 *   body: FetchGenericData & {
 *     data: CommodityItem
 *   }
 * }>}
 * */
export const commoditiesCreateItem = store.create;

/**
 * @param {Object} params
 * @param {string} params.id
 * @param {Object} params.payload
 * @param {string} params.payload.title
 * @param {string} params.payload.categoryId
 * @return {Promise<FetchResponse & {
 *   body: FetchGenericData & {
 *     data: CommodityItem
 *   }
 * }>}
 * */
export const commoditiesUpdateItem = store.update;

/**
 * @param {Object} params
 * @param {string} params.id
 * @return {Promise<FetchResponse & {
 *   body: FetchGenericData & {
 *     data: CommodityItem
 *   }
 * }>}
 * */
export const commoditiesRemoveItem = store.remove;

export const useCommodities = store.useResource;
