import { useRef, useCallback, useEffect } from 'react';

/** @type {Map<UsePointerContext, {
 *    handlePointerMove: Function
 *    handlePointerUp: Function
 * }>} */
const HANDLERS_MAP = new Map();

const E_ACTIVE = {
  passive: false,
  capture: false,
};

const E_PASSIVE = {
  passive: true,
  capture: false,
};

/**
 * @param {Object} params
 * @param {UsePointerHandler} [params.onDown]
 * @param {UsePointerHandler} [params.onMove]
 * @param {UsePointerHandler} [params.onUp]
 * @return {{
 *   onPointerDown: function(TouchEvent|MouseEvent): void
 * }}
 * */
export function usePointerMove(params) {
  const {
    onDown,
    onMove,
    onUp,
  } = params;
  /** @type {React.RefObject<UsePointerContext>} */
  const contextRef = useRef(createContext());

  /** @type {function(TouchEvent|MouseEvent): void} */
  const handlePointerMove = useCallback((e) => {
    if (typeof onMove === 'function') {
      onMove(contextRef.current, getDataFromEvent(e), e);
    }
  }, [
    onMove,
  ]);
  /** @type {function(TouchEvent|MouseEvent): void} */
  const handlePointerUp = useCallback((e) => {
    if (typeof onUp === 'function') {
      onUp(contextRef.current, getDataFromEvent(e), e);
    }
    window.document.removeEventListener('touchmove', handlePointerMove, E_ACTIVE);
    window.document.removeEventListener('mousemove', handlePointerMove, E_ACTIVE);
    window.document.removeEventListener('touchend', handlePointerUp, E_PASSIVE);
    window.document.removeEventListener('touchcancel', handlePointerUp, E_PASSIVE);
    window.document.removeEventListener('mouseup', handlePointerUp, E_PASSIVE);
    contextRef.current = createContext();
  }, [
    onUp,
    handlePointerMove,
  ]);
  /** @type {function(TouchEvent|MouseEvent): void} */
  const handlePointerDown = useCallback((e) => {
    if (isMultiFingerTouch(e)) {
      return;
    }
    if (typeof onDown === 'function') {
      onDown(contextRef.current, getDataFromEvent(e), e);
    }
    HANDLERS_MAP.set(contextRef.current, {
      handlePointerMove,
      handlePointerUp,
    });
    window.document.addEventListener('touchmove', handlePointerMove, E_ACTIVE);
    window.document.addEventListener('mousemove', handlePointerMove, E_ACTIVE);
    window.document.addEventListener('touchend', handlePointerUp, E_PASSIVE);
    window.document.addEventListener('touchcancel', handlePointerUp, E_PASSIVE);
    window.document.addEventListener('mouseup', handlePointerUp, E_PASSIVE);
  }, [
    onDown,
    handlePointerUp,
    handlePointerMove,
  ]);

  useEffect(() => {
    const handlers = HANDLERS_MAP.get(contextRef.current)
      || {};

    return () => {
      const moveHandler = handlers.handlePointerMove;
      const upHandler = handlers.handlePointerUp;
      if (typeof moveHandler === 'function') {
        window.document.removeEventListener('touchmove', moveHandler, E_ACTIVE);
        window.document.removeEventListener('mousemove', moveHandler, E_ACTIVE);
      }
      if (typeof upHandler === 'function') {
        window.document.removeEventListener('touchend', upHandler, E_PASSIVE);
        window.document.removeEventListener('touchcancel', upHandler, E_PASSIVE);
        window.document.removeEventListener('mouseup', upHandler, E_PASSIVE);
      }
      contextRef.current = null;
    };
  }, []);

  return {
    onPointerDown: handlePointerDown,
  };
}

/**
 * @template {string} ContextName
 * @template {*} ContextValue
 *
 * @return {{
 *   getValue: function(ContextName): ContextValue
 *   setValue: function(ContextName, ContextValue): void
 * }}
 * */
function createContext() {
  const values = {};

  return {
    getValue(name) {
      return values[name];
    },
    setValue(name, value) {
      values[name] = value;
    },
  };
}

/**
 * @typedef {Object} UsePointerContext
 * @property {function(string): *} getValue
 * @property {function(string, *): void} setValue
 * */

/**
 * @param {UsePointerEvent} e
 * @return {boolean}
 * */
function isMultiFingerTouch(e) {
  return ('targetTouches' in e && e.targetTouches.length > 1);
}

/**
 * @param {UsePointerEvent} e
 * @return {void}
 * */
function cancelEvent(e) {
  if (e.cancelable) {
    e.preventDefault();
  }
}

/**
 * @param {UsePointerEvent} e
 * @return {void}
 * */
function cancelPropagation(e) {
  e.stopPropagation();
}

/**
 * @param {UsePointerEvent} e
 * @return {UsePointerData}
 * */
function getDataFromEvent(e) {
  const event = 'changedTouches' in e
    ? e.changedTouches[0]
    : e;
  return {
    clientX: event.clientX,
    clientY: event.clientY,
    pageX: event.pageX,
    pageY: event.pageY,
    cancelEvent: cancelEvent.bind(null, e),
    cancelPropagation: cancelPropagation.bind(null, e),
  };
}

/**
 * @typedef {Function} UsePointerHandler
 * @param {UsePointerContext} context
 * @param {UsePointerData} data
 * @param {UsePointerEvent} event
 * @return {void}
 * */

/**
 * @typedef {Object} UsePointerData
 * @property {number} clientX
 * @property {number} clientY
 * @property {number} pageX
 * @property {number} pageY
 * @property {Function} cancelEvent
 * @property {Function} cancelPropagation
 * */

/**
 * @typedef {TouchEvent|MouseEvent
 * |React.MouseEvent<HTMLElement>
 * |React.TouchEvent<HTMLElement>} UsePointerEvent
 * */
