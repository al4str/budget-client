import { useEffect } from 'react';
import propTypes from 'prop-types';
import { routeMountPublish } from '@/libs/routeMounting';
import { historyGetCurrentLocationKey } from '@/libs/navigationManager';
import { sessionsTokenFromStorage } from '@/helpers/sessions';
import { sessionValidate } from '@/hooks/useSession';
import { hideSplashScreen } from '@/components/splash';

// TODO: page/app readiness store

let isInitialPageLoad = true;

RouteReady.propTypes = {
  children: propTypes.node,
};

RouteReady.defaultProps = {
  children: null,
};

function RouteReady(props) {
  const { children } = props;

  useEffect(() => {
    const locationKey = historyGetCurrentLocationKey();
    if (isInitialPageLoad) {
      isInitialPageLoad = false;
      if (sessionsTokenFromStorage()) {
        sessionValidate()
          .then(hideSplashScreen)
          .catch();
      }
      else {
        hideSplashScreen();
      }
    }
    routeMountPublish(locationKey);
  }, []);

  return children;
}

export default RouteReady;
