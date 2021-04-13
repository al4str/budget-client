import { Suspense } from 'react';
import { Router } from 'react-router-dom';
import '@/styles/global.scss';
import { PAGES } from '@/helpers/pages';
import { historyGet } from '@/libs/navigationManager';
import { handleSplashScreen } from '@/components/splash';
import RoutesSwitcher from '@/components/page/RoutesSwitcher';

handleSplashScreen();

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
