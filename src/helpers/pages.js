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
    url: ROUTES.backups,
    chunkGroupName: 'pageBackups',
    Component: lazy(() => import(
      /* webpackChunkName: "pageBackups" */
      '@/components/backups/Page'
    )),
  },
  {
    url: ROUTES.transactionsCreate,
    chunkGroupName: 'pageTransactionsCreate',
    Component: lazy(() => import(
      /* webpackChunkName: "pageTransactionsCreate" */
      '@/components/transaction/Page'
    )),
  },
  {
    url: ROUTES.transactionsItem,
    chunkGroupName: 'pageTransactionsCreate',
    Component: lazy(() => import(
      /* webpackChunkName: "pageTransactionsCreate" */
      '@/components/transaction/Page'
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
