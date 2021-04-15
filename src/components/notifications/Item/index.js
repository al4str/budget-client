import { useState, useRef, useCallback, useEffect } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { NOTIFICATIONS_TYPES } from '@/helpers/notifications';
import { usePointerMove } from '@/hooks/usePointerMove';
import IconCross from '@/components/icons/IconCross';
import Action from '@/components/ui/Action';
import btn from '@/styles/button.scss';
import s from './styles.scss';

const TIMEOUT = 5 * 1000;

const INTERVAL = Math.floor(1000 / 60);

const INITIAL_THRESHOLD = 5;

const DECISION_THRESHOLD = 40;

NotificationsItem.propTypes = {
  countDown: propTypes.bool,
  withClose: propTypes.bool,
  autoClose: propTypes.bool,
  type: propTypes.string,
  title: propTypes.string,
  text: propTypes.string,
  renderContent: propTypes.func,
  onRemove: propTypes.func,
};

NotificationsItem.defaultProps = {
  countDown: false,
  withClose: true,
  autoClose: true,
  type: NOTIFICATIONS_TYPES.INFO,
  title: '',
  text: '',
  renderContent: null,
  onRemove: null,
};

/**
 * @param {Object} props
 * @param {boolean} props.countDown
 * @param {boolean} props.withClose
 * @param {boolean} props.autoClose
 * @param {NotificationsTypes} props.type
 * @param {string} props.title
 * @param {string} props.text
 * @param {Function} props.renderContent
 * @param {Function} props.onRemove
 * */
function NotificationsItem(props) {
  const {
    countDown,
    withClose,
    autoClose,
    type,
    title,
    text,
    renderContent,
    onRemove,
  } = props;
  const showTimeOut = countDown && autoClose;
  const [hidden, setHidden] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMEOUT);
  /** @type {React.RefObject<number>} */
  const timeLeftRef = useRef(timeLeft);
  /** @type {React.RefObject<number>} */
  const closeTimerRef = useRef(null);
  /** @type {React.RefObject<HTMLDivElement>} */
  const elRef = useRef(null);
  const closePercentage = Math.round(100 * (timeLeft / TIMEOUT));

  const handleTimerStop = useCallback(() => {
    clearInterval(closeTimerRef.current);
    timeLeftRef.current = TIMEOUT;
    setTimeLeft(TIMEOUT);
  }, []);
  const handleTimerTick = useCallback(() => {
    if (timeLeftRef.current <= 0) {
      setHidden(true);
      handleTimerStop();
      return;
    }
    setTimeLeft((prevTimeLeft) => {
      const nextTimeLeft = prevTimeLeft - INTERVAL;
      timeLeftRef.current = nextTimeLeft;
      return nextTimeLeft;
    });
  }, [
    handleTimerStop,
  ]);
  const handleTimerStart = useCallback(() => {
    handleTimerStop();
    closeTimerRef.current = setInterval(handleTimerTick, INTERVAL);
  }, [
    handleTimerStop,
    handleTimerTick,
  ]);
  /** @type {function(React.AnimationEvent<HTMLDivElement>): void} */
  const handleAnimationEnd = useCallback((e) => {
    if (e.animationName === s.hide) {
      onRemove();
    }
  }, [
    onRemove,
  ]);
  /** @type {UsePointerHandler} */
  const handlePointerDown = useCallback((ctx, data) => {
    handleTimerStop();
    ctx.setValue('prevClientX', data.clientX);
    ctx.setValue('prevClientY', data.clientY);
  }, [
    handleTimerStop,
  ]);
  /** @type {UsePointerHandler} */
  const handlePointerMove = useCallback((ctx, data) => {
    const diffX = data.clientX - ctx.getValue('prevClientX');
    const diffY = data.clientY - ctx.getValue('prevClientY');
    const swiping = Math.abs(diffX) > Math.abs(diffY);
    const enoughDistance = Math.abs(diffX) > INITIAL_THRESHOLD;
    if (swiping) {
      data.cancelEvent();
    }
    if (swiping && enoughDistance) {
      elRef.current.style.transform = `translateX(${diffX}px)`;
      elRef.current.classList.add(s.noTransition);
    }
  }, []);
  /** @type {UsePointerHandler} */
  const handlePointerUp = useCallback((ctx, data) => {
    elRef.current.classList.remove(s.noTransition);
    const diffX = data.clientX - ctx.getValue('prevClientX');
    if (Math.abs(diffX) > INITIAL_THRESHOLD) {
      data.cancelEvent();
    }
    if (Math.abs(diffX) > DECISION_THRESHOLD) {
      setHidden(true);
    }
    else {
      elRef.current.style.transitionProperty = 'transform';
      elRef.current.style.transform = 'translateX(0)';
    }
  }, []);
  const handleMouseOver = useCallback(() => {
    handleTimerStop();
  }, [
    handleTimerStop,
  ]);
  const handleMouseOut = useCallback(() => {
    handleTimerStart();
  }, [
    handleTimerStart,
  ]);
  const handleClose = useCallback(() => {
    clearInterval(closeTimerRef.current);
    setHidden(true);
  }, []);

  const { onPointerDown } = usePointerMove({
    onDown: handlePointerDown,
    onMove: handlePointerMove,
    onUp: handlePointerUp,
  });

  useEffect(() => {
    if (showTimeOut) {
      handleTimerStart();
    }
    else {
      handleTimerStop();
    }
  }, [
    showTimeOut,
    handleTimerStop,
    handleTimerStart,
  ]);
  useEffect(() => {
    if (elRef.current instanceof HTMLElement) {
      elRef.current.style.height = `${elRef.current.clientHeight}px`;
    }
  }, []);
  useEffect(() => {
    return () => {
      clearInterval(closeTimerRef.current);
    };
  }, []);

  return (
    <div
      className={cn(
        s.notification,
        s[type],
        hidden && s.hidden,
      )}
      ref={elRef}
      onTouchStart={onPointerDown}
      onMouseDown={onPointerDown}
      onMouseOver={showTimeOut
        ? handleMouseOver
        : null}
      onMouseOut={showTimeOut
        ? handleMouseOut
        : null}
      onAnimationEnd={handleAnimationEnd}
    >
      <Action
        className={s.closeBtn}
        tabIndex={-1}
        disabled={hidden || !withClose}
        onClick={handleClose}
      >
        <span className={btn.wrp}>
          {showTimeOut
          && <svg
            className={s.closeTimeOut}
            viewBox="0 0 32 32"
          >
            <circle
              className={s.closeTimeOutCircle}
              r="16"
              cx="16"
              cy="16"
              style={{ strokeDasharray: `${closePercentage} 100` }}
            />
          </svg>}
          {withClose
          && <IconCross className={cn(btn.icon, s.closeIcon)} />}
        </span>
      </Action>
      <div className={s.wrp}>
        {title
        && <span className={cn(s.title, withClose && s.titlePadded)}>
          {title}
        </span>}
        {text
        && <div className={s.text}>
          {text}
        </div>}
        {typeof renderContent === 'function'
        && <div className={s.text}>
          {renderContent(props)}
        </div>}
        {(!title && !text && typeof renderContent !== 'function')
        && <div className={s.text}>
          &nbsp;
        </div>}
      </div>
    </div>
  );
}

export default NotificationsItem;
