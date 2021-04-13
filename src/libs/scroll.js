/**
 * @param {number} [to=0]
 * @return {void}
 * */
export function scrollToY(to = 0) {
  window.scrollTo(0, to);
}

/**
 * @param {HTMLElement} [el=window.document.body]
 * @param {'start'|'center'|'end'|'nearest'} [block='end']
 * @param {'start'|'center'|'end'|'nearest'} [inline='nearest']
 * @return {void}
 * */
export function scrollToEl(el = window.document.body, block = 'end', inline = 'nearest') {
  if (el instanceof HTMLElement) {
    el.scrollIntoView({
      behavior: 'smooth',
      block,
      inline,
    });
  }
}
