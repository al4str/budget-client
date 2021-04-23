import { fetchExec, fetchMapGenericBody } from '@/libs/fetch';
import { propertyGet } from '@/libs/property';
import { API_URL } from '@/helpers/constants';
import { sessionsWithTokenHeader } from '@/helpers/sessions';

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
 * @return {Promise<BudgetItemsResponse>}
 * */
export function budgetObtainFixedValues() {
  return fetchExec({
    url: `${API_URL}/budget/fixed`,
    options: {
      headers: sessionsWithTokenHeader({}),
    },
    errorTitle: '[budget] obtaining fixed values failed',
    bodyMapper: mapBudgetItemsBody,
  });
}

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
 * @typedef {Object} BudgetItem
 * @property {string} categoryId
 * @property {number} value
 * */

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
 * @param {Object} params
 * @param {Array<BudgetItem>} params.values
 * @return {Promise<BudgetItemsResponse>}
 * */
export function budgetUpdateFixedValues(params) {
  const { values } = params;
  return fetchExec({
    url: `${API_URL}/budget/fixed`,
    options: {
      method: 'PUT',
      headers: sessionsWithTokenHeader({
        'content-type': 'application/json',
      }),
      body: JSON.stringify({
        values,
      }),
    },
    errorTitle: '[budget] updating fixed values failed',
    bodyMapper: mapBudgetItemsBody,
  });
}
