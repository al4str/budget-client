let SPLASH_SCREEN_EL = null;

/**
 * @return {void}
 * */
export function handleSplashScreen() {
  SPLASH_SCREEN_EL = window.document.getElementById('app-splash');

  if (SPLASH_SCREEN_EL instanceof HTMLElement) {
    SPLASH_SCREEN_EL.onanimationend = (e) => {
      if (e.animationName === 'splash-hide') {
        SPLASH_SCREEN_EL.parentElement.removeChild(SPLASH_SCREEN_EL);
      }
    };
  }
}

/**
 * @return {void}
 * */
export function hideSplashScreen() {
  if (SPLASH_SCREEN_EL instanceof HTMLElement) {
    SPLASH_SCREEN_EL.classList.add('splash_hidden');
  }
}
