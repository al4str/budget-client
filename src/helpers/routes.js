import { matchPath } from 'react-router-dom';

export const ROUTES = {
  main: '/',
  profile: '/profile',
  createIncome: '/create-income',
  createExpense: '/create-expense',
};

const ROUTE_PARAMS = {
  [ROUTES.main]: {
    chunks: ['pageMain'],
  },
  [ROUTES.profile]: {
    chunks: ['pageProfile'],
  },
  [ROUTES.createIncome]: {
    chunks: ['pageCreateIncome'],
  },
  [ROUTES.createExpense]: {
    chunks: ['pageCreateExpense'],
  },
};

/**
 * @param {string} pathname
 * @return {RouteParams}
 * */
export function routesGetParams(pathname) {
  const [, { chunks = [] }] = Object
    .entries(ROUTE_PARAMS)
    .find(([routePath]) => {
      return matchPath(pathname, {
        path: routePath,
        exact: true,
      });
    })
    || ['', { chunks: [] }];

  return {
    chunks,
  };
}

/**
 * @typedef {Object} RouteParams
 * @property {Array<string>} chunks
 * */

/**
 * @param {string} pathname
 * @param {Array<string>} matchers
 * @return {boolean}
 * */
export function routesIsMatched(pathname = '', matchers = []) {
  const index = matchers.findIndex((routePath) => matchPath(pathname, {
    path: routePath,
    exact: true,
  }));
  return index !== -1;
}
