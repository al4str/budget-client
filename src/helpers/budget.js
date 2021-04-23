import { fetchExec, fetchMapGenericBody } from '@/libs/fetch';
import { propertyGet } from '@/libs/property';
import { API_URL } from '@/helpers/constants';
import { sessionsWithTokenHeader } from '@/helpers/sessions';

/**
 * @typedef {Object} BudgetItem
 * @property {string} categoryId
 * @property {number} value
 * */

/**
 * @typedef {Object} BudgetData
 * @property {Array<BudgetItem>} items
 * @property {number} income
 * */

/**
 * @return {Promise<BudgetItemsResponse>}
 * */
export function budgetObtainAverageValues() {
  return fetchExec({
    url: `${API_URL}/budget/average`,
    options: {
      headers: sessionsWithTokenHeader({}),
    },
    errorTitle: '[budget] obtaining average values failed',
    bodyMapper: mapBudgetItemsBody,
  });
}

/**
 * @typedef {FetchResponse
 * & { body: BudgetItemsBody }} BudgetItemsResponse
 * */

/**
 * @typedef {FetchGenericData
 * & { data: Array<BudgetItem> }} BudgetItemsBody
 * */

/**
 * @param {null|Object} raw
 * @return {BudgetItemsBody}
 * */
function mapBudgetItemsBody(raw) {
  const { ok, reason } = fetchMapGenericBody(raw);
  const rawData = propertyGet(raw, ['data'], []);
  /** @type {Array<BudgetItem>} */
  const data = Array.isArray(rawData)
    ? rawData.map((rawItem) => mapBudgetItem(rawItem))
    : [];

  return {
    ok,
    reason,
    data,
  };
}

/**
 * @param {null|Object} raw
 * @return {BudgetItem}
 * */
function mapBudgetItem(raw) {
  const categoryId = propertyGet(raw, ['categoryId'], '');
  const value = propertyGet(raw, ['value'], 0.00);

  return {
    categoryId,
    value,
  };
}

/**
 * @return {BudgetItem}
 * */
export function budgetGetEmptyItem() {
  return {
    categoryId: '',
    value: 0.00,
  };
}

/**
 * @return {Promise<BudgetDataResponse>}
 * */
export function budgetObtainFixedValues() {
  return fetchExec({
    url: `${API_URL}/budget/fixed`,
    options: {
      headers: sessionsWithTokenHeader({}),
    },
    errorTitle: '[budget] obtaining data failed',
    bodyMapper: mapBudgetDataBody,
  });
}

/**
 * @typedef {FetchResponse
 * & { body: BudgetDataBody }} BudgetDataResponse
 * */

/**
 * @typedef {FetchGenericData
 * & { data: BudgetData }} BudgetDataBody
 * */

/**
 * @param {null|Object} raw
 * @return {BudgetDataBody}
 * */
function mapBudgetDataBody(raw) {
  const { ok, reason } = fetchMapGenericBody(raw);
  const rawItems = propertyGet(raw, ['data', 'items'], []);
  const income = propertyGet(raw, ['data', 'income'], 0.00);
  /** @type {Array<BudgetItem>} */
  const items = Array.isArray(rawItems)
    ? rawItems.map((rawItem) => mapBudgetItem(rawItem))
    : [];

  return {
    ok,
    reason,
    data: {
      items,
      income,
    },
  };
}

/**
 * @return {BudgetData}
 * */
export function budgetGetEmptyData() {
  return {
    items: [],
    income: 0.00,
  };
}

/**
 * @param {Object} params
 * @param {Array<BudgetItem>} params.items
 * @param {number} params.income
 * @return {Promise<BudgetDataResponse>}
 * */
export function budgetUpdateFixedValues(params) {
  const { items, income } = params;
  return fetchExec({
    url: `${API_URL}/budget/fixed`,
    options: {
      method: 'PUT',
      headers: sessionsWithTokenHeader({
        'content-type': 'application/json',
      }),
      body: JSON.stringify({
        items,
        income,
      }),
    },
    errorTitle: '[budget] updating data failed',
    bodyMapper: mapBudgetDataBody,
  });
}
