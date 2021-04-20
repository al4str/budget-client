import { matchPath } from 'react-router-dom';

export const ROUTES = {
  main: '/',
  profile: '/profile',
  backups: '/backups',
  transactionsCreate: '/transactions/create/:type',
  transactionsCreateIncome: '/transactions/create/income',
  transactionsCreateExpense: '/transactions/create/expense',
  transactionsItem: '/transactions/item/:id',
};

const ROUTE_PARAMS = {
  [ROUTES.main]: {
    chunks: ['pageMain'],
  },
  [ROUTES.profile]: {
    chunks: ['pageProfile'],
  },
  [ROUTES.backups]: {
    chunks: ['pageBackups'],
  },
  [ROUTES.transactionsCreate]: {
    chunks: ['pageTransactionsCreate'],
  },
  [ROUTES.transactionsCreateIncome]: {
    chunks: ['pageTransactionsCreate'],
  },
  [ROUTES.transactionsCreateExpense]: {
    chunks: ['pageTransactionsCreate'],
  },
  [ROUTES.transactionsItem]: {
    chunks: ['pageTransactionsCreate'],
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
