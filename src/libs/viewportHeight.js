/**
 * @return {void}
 * */
export function viewportHeightProvide() {
  let vh = window.innerHeight * 0.01;
  window.document.documentElement.style.setProperty('--vh', `${vh}px`);

  window.addEventListener('resize', () => {
    vh = window.innerHeight * 0.01;
    window.document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, {
    capture: true,
    passive: true,
  });
}
