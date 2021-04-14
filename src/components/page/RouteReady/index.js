import { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { connectUseHook } from '@/libs/connect';
import { routeMountPublish } from '@/libs/routeMounting';
import { historyGetCurrentLocationKey } from '@/libs/navigationManager';
import { sessionsTokenFromStorage } from '@/helpers/sessions';
import { sessionValidate } from '@/hooks/useSession';
import { useI18n } from '@/hooks/useI18n';
import { hideSplashScreen } from '@/components/splash';

let isInitialPageLoad = true;

function useHook() {
  const { ready } = useI18n();
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (isInitialPageLoad) {
      isInitialPageLoad = false;
      if (sessionsTokenFromStorage()) {
        sessionValidate()
          .then(() => setValidated(true))
          .catch();
      }
      else {
        setValidated(true);
      }
    }
  }, []);
  useEffect(() => {
    const locationKey = historyGetCurrentLocationKey();
    routeMountPublish(locationKey);
  }, []);
  useEffect(() => {
    if (ready && validated) {
      hideSplashScreen();
    }
  }, [
    ready,
    validated,
  ]);

  return {};
}

RouteReady.propTypes = {
  children: propTypes.node,
};

RouteReady.defaultProps = {
  children: null,
};

function RouteReady(props) {
  const { children } = props;

  return children;
}

export default connectUseHook(useHook)(RouteReady);
