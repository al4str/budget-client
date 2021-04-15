import { Suspense } from 'react';
import { Router } from 'react-router-dom';
import '@/styles/global.scss';
import { PAGES } from '@/helpers/pages';
import { historyGet } from '@/libs/navigationManager';
import { viewportHeightProvide } from '@/libs/viewportHeight';
import { isAppStaleInit } from '@/helpers/isAppStale';
import { i18nInit } from '@/hooks/useI18n';
import { sessionHandle403 } from '@/hooks/useSession';
import { handleSplashScreen } from '@/components/splash';
import RoutesSwitcher from '@/components/page/RoutesSwitcher';

handleSplashScreen();

viewportHeightProvide();

isAppStaleInit();

sessionHandle403();

i18nInit().catch();

function App() {
  return (
    <Suspense fallback={null}>
      <Router history={historyGet()}>
        <RoutesSwitcher pages={PAGES} />
      </Router>
    </Suspense>
  );
}

export default App;
