import { lazyGetComponent } from '@/libs/lazy';
import { ROUTES } from '@/helpers/routes';
import PageLoading from '@/components/page/Loading';

export const PAGES = [
  {
    url: ROUTES.main,
    chunkGroupName: 'pageMain',
    Component: lazy(() => import(
      /* webpackChunkName: "pageMain" */
      '@/components/main/Page'
    )),
  },
  {
    url: ROUTES.profile,
    chunkGroupName: 'pageProfile',
    Component: lazy(() => import(
      /* webpackChunkName: "pageProfile" */
      '@/components/profile/Page'
    )),
  },
  {
    url: ROUTES.createIncome,
    chunkGroupName: 'pageCreateIncome',
    Component: lazy(() => import(
      /* webpackChunkName: "pageCreateIncome" */
      '@/components/create/PageIncome'
    )),
  },
  {
    url: ROUTES.createExpense,
    chunkGroupName: 'pageCreateExpense',
    Component: lazy(() => import(
      /* webpackChunkName: "pageCreateExpense" */
      '@/components/create/PageExpense'
    )),
  },
];

/**
 * @param {Function} factory
 * @return {Function}
 * */
function lazy(factory) {
  return lazyGetComponent({
    factory,
    Loader: PageLoading,
  });
}

/**
 * @typedef {Object} RoutePage
 * @property {string} url
 * @property {React.LazyExoticComponent} Component
 * */
