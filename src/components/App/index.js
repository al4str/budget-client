import { useEffect, Suspense } from 'react';
import { Router } from 'react-router-dom';
import '@/styles/global.scss';
import { PAGES } from '@/helpers/pages';
import { historyGet } from '@/libs/navigationManager';
import { connectUseHook } from '@/libs/connect';
import { viewportHeightProvide } from '@/libs/viewportHeight';
import { isAppStaleInit } from '@/helpers/isAppStale';
import { i18nInit } from '@/hooks/useI18n';
import { sessionHandle403, useSession } from '@/hooks/useSession';
import { usersFetchList } from '@/hooks/useUsers';
import { categoriesFetchList } from '@/hooks/useCategories';
import { commoditiesFetchList } from '@/hooks/useCommodities';
import { transactionsFetchList } from '@/hooks/useTransactions';
import { expendituresFetchList } from '@/hooks/useExpenditures';
import { handleSplashScreen } from '@/components/splash';
import RoutesSwitcher from '@/components/page/RoutesSwitcher';

handleSplashScreen();

viewportHeightProvide();

isAppStaleInit();

sessionHandle403();

i18nInit().catch();

function useHook() {
  const { authed } = useSession();

  useEffect(() => {
    if (authed) {
      Promise
        .all([
          usersFetchList(),
          categoriesFetchList(),
          commoditiesFetchList(),
          transactionsFetchList(),
          expendituresFetchList(),
        ])
        .catch();
    }
  }, [
    authed,
  ]);

  return {};
}

function App() {
  return (
    <Suspense fallback={null}>
      <Router history={historyGet()}>
        <RoutesSwitcher pages={PAGES} />
      </Router>
    </Suspense>
  );
}

export default connectUseHook(useHook)(App);
