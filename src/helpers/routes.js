import { matchPath } from 'react-router-dom';

export const ROUTES = {
  main: '/',
  profile: '/profile',
  createIncome: '/create-income',
  createExpense: '/create-expense',
  categories: '/categories',
  categoriesCreate: '/categories/create',
  categoriesItem: '/categories/:id',
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
  [ROUTES.categories]: {
    chunks: ['pageCategories'],
  },
  [ROUTES.categoriesCreate]: {
    chunks: ['pageCategoriesCreate'],
  },
  [ROUTES.categoriesItem]: {
    chunks: ['pageCategoriesItem'],
  },
};

/**
 * @param {string} pathname
 * @return {RouteParams}
 * */
export function getRouteParams(pathname) {
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
export function isPathnameMatched(pathname = '', matchers = []) {
  const index = matchers.findIndex((routePath) => matchPath(pathname, {
    path: routePath,
    exact: true,
  }));
  return index !== -1;
}
