import { storeCreate } from '@/libs/store';
import { categoriesGetState } from '@/hooks/useCategories';
import {
  budgetObtainAverageValues,
  budgetObtainFixedValues,
  budgetUpdateFixedValues,
} from '@/helpers/budget';

const READY_STATE = {
  INITIAL: 'INITIAL',
  FETCHING: 'FETCHING',
  READY: 'READY',
  UPDATING: 'UPDATING',
};

/**
 * @typedef {'INITIAL'|'FETCHING'|'READY'
 *   |'UPDATING'} BudgetStoreReadyState
 * */

const ACTION_TYPES = {
  READY_STATE: 'READY_STATE',
  INCOME: 'INCOME',
  AVERAGE: 'AVERAGE',
  FIXED: 'FIXED',
};

/**
 * @typedef {'READY_STATE'|'INCOME'|'AVERAGE'
 *   |'FIXED'} BudgetStoreActionType
 * */

/** @type {BudgetStoreState} */
const initialState = {
  readyState: READY_STATE.INITIAL,
  initial: true,
  fetching: false,
  pending: true,
  ready: false,
  updating: false,
  income: 0.00,
  average: new Map(),
  fixed: new Map(),
};

/**
 * @typedef {Object} BudgetStoreState
 * @property {BudgetStoreReadyState} readyState
 * @property {boolean} initial
 * @property {boolean} fetching
 * @property {boolean} pending
 * @property {boolean} ready
 * @property {boolean} updating
 * @property {number} income
 * @property {Map<string, number>} average
 * @property {Map<string, number>} fixed
 * */

const { getState, dispatch, useStore } = storeCreate(initialState, reducer);

/** @type {function(): BudgetStoreState} */
export const budgetGetState = getState;

/** @type {function(type: BudgetStoreActionType,
 * payload: BudgetStorePayload): void} */
export const budgetDispatch = dispatch;

/**
 * @typedef {Partial<BudgetStoreState>} BudgetStorePayload
 * */

/**
 * @return {Promise<{
 *   average: BudgetItemsResponse
 *   fixed: BudgetDataResponse
 * }>}
 * */
export async function budgetFetchAll() {
  const { readyState: prevReadyState } = budgetGetState();
  budgetDispatch(ACTION_TYPES.READY_STATE, {
    readyState: prevReadyState === READY_STATE.READY
      ? READY_STATE.UPDATING
      : READY_STATE.FETCHING,
  });
  const [average, fixed] = await Promise.all([
    budgetFetchAverage(),
    budgetFetchFixedData(),
  ]);
  budgetDispatch(ACTION_TYPES.READY_STATE, {
    readyState: READY_STATE.READY,
  });

  return {
    average,
    fixed,
  };
}

/**
 * @return {Promise<BudgetItemsResponse>}
 * */
export async function budgetFetchAverage() {
  const response = await budgetObtainAverageValues();
  const { status, body: { ok, data } } = response;
  if (status === 'success' && ok) {
    const nextValues = new Map();
    data.forEach((item) => {
      nextValues.set(item.categoryId, item.value);
    });
    budgetDispatch(ACTION_TYPES.AVERAGE, {
      average: nextValues,
    });
  }
  return response;
}

/**
 * @return {Promise<BudgetDataResponse>}
 * */
export async function budgetFetchFixedData() {
  const response = await budgetObtainFixedValues();
  const { status, body: { ok, data } } = response;
  if (status === 'success' && ok) {
    budgetSetIncome(data.income);
    const nextValues = new Map();
    data.items.forEach((item) => {
      nextValues.set(item.categoryId, item.value);
    });
    budgetDispatch(ACTION_TYPES.FIXED, {
      fixed: nextValues,
    });
  }
  return response;
}

/**
 * @return {Promise<BudgetDataResponse>}
 * */
export async function budgetSaveFixedData() {
  const { items: categories } = categoriesGetState();
  const { income, fixed } = budgetGetState();
  const items = categories
    .filter((category) => category.type === 'expense')
    .map((category) => ({
      categoryId: category.id,
      value: fixed.get(category.id) || 0.00,
    }));
  const response = await budgetUpdateFixedValues({
    items,
    income,
  });
  const { status, body: { ok, data } } = response;
  if (status === 'success' && ok) {
    budgetSetIncome(data.income);
    const nextValues = new Map();
    data.items.forEach((item) => {
      nextValues.set(item.categoryId, item.value);
    });
    budgetDispatch(ACTION_TYPES.FIXED, {
      fixed: nextValues,
    });
  }
  return response;
}

/**
 * @param {number} nextIncome
 * @return {void}
 * */
export function budgetSetIncome(nextIncome) {
  budgetDispatch(ACTION_TYPES.INCOME, {
    income: nextIncome,
  });
}

/**
 * @param {string} categoryId
 * @param {number} value
 * @return {void}
 * */
export function budgetSetItemValue(categoryId, value) {
  const { fixed: prevFixed } = budgetGetState();
  const nextFixed = new Map(prevFixed);
  nextFixed.set(categoryId, value);
  budgetDispatch(ACTION_TYPES.FIXED, {
    fixed: nextFixed,
  });
}

/**
 * @return {UseBudgetStore}
 * */
export function useBudget() {
  const {
    readyState,
    initial,
    fetching,
    pending,
    ready,
    updating,
    income,
    average,
    fixed,
  } = budgetGetState();

  useStore();

  return {
    readyState,
    initial,
    fetching,
    pending,
    ready,
    updating,
    income,
    average,
    fixed,
    READY_STATE,
  };
}

/**
 * @typedef {Object} UseBudgetStore
 * @property {BudgetStoreReadyState} readyState
 * @property {boolean} initial
 * @property {boolean} fetching
 * @property {boolean} pending
 * @property {boolean} ready
 * @property {boolean} updating
 * @property {number} income
 * @property {Map<string, number>} average
 * @property {Map<string, number>} fixed
 * @property {Record<BudgetStoreReadyState>} READY_STATE
 * */

/**
 * @param {BudgetStoreState} state
 * @param {{
 *   type: BudgetStoreActionType
 *   payload: BudgetStorePayload
 * }} action
 * @return {BudgetStoreState}
 * */
function reducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.READY_STATE:
      return {
        ...state,
        readyState: action.payload.readyState,
        initial: action.payload.readyState === READY_STATE.INITIAL,
        fetching: action.payload.readyState === READY_STATE.FETCHING,
        pending: [
          READY_STATE.INITIAL,
          READY_STATE.FETCHING,
        ].includes(action.payload.readyState),
        ready: [
          READY_STATE.READY,
          READY_STATE.UPDATING,
        ].includes(action.payload.readyState),
        updating: action.payload.readyState === READY_STATE.UPDATING,
      };
    case ACTION_TYPES.INCOME:
      return {
        ...state,
        income: action.payload.income,
      };
    case ACTION_TYPES.AVERAGE:
      return {
        ...state,
        average: action.payload.average,
      };
    case ACTION_TYPES.FIXED:
      return {
        ...state,
        fixed: action.payload.fixed,
      };
    default:
      return state;
  }
}
