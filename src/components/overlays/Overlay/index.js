import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import propTypes from 'prop-types';
import cn from 'classnames';
import { idGet } from '@/libs/id';
import { usePrevious } from '@/hooks/usePrevious';
import {
  OVERLAYS_ELEMENT_ID,
  overlaysRegister,
  overlaysOpen,
  overlaysClose,
  overlaysUnregister,
  overlaysGetScroll,
  useOverlays,
} from '@/hooks/useOverlays';
import s from './styles.scss';

Overlay.propTypes = {
  opened: propTypes.bool,
  onClose: propTypes.func,
  children: propTypes.node,
};

Overlay.defaultProps = {
  opened: false,
  onClose: null,
  children: null,
};

/**
 * @param {Object} props
 * @param {boolean} props.opened
 * @param {Function} props.onClose
 * */
function Overlay(props) {
  const {
    opened,
    onClose,
    children,
  } = props;
  const prevOpened = usePrevious(opened);
  /** @type {React.RefObject<string>} */
  const idRef = useRef(idGet());
  const { current } = useOverlays();
  const shown = !!current && current === idRef.current;

  useEffect(() => {
    const overlayId = idRef.current;
    overlaysRegister(overlayId);

    return () => {
      overlaysUnregister(overlayId);
    };
  }, []);
  useEffect(() => {
    const overlayId = idRef.current;
    if (opened && !prevOpened) {
      overlaysOpen(overlayId);
    }
  }, [
    opened,
    prevOpened,
  ]);
  useEffect(() => {
    const overlayId = idRef.current;
    if (!opened && prevOpened) {
      overlaysClose(overlayId);
      if (typeof onClose === 'function') {
        onClose();
      }
    }
  }, [
    opened,
    onClose,
    prevOpened,
  ]);
  useEffect(() => {
    if (shown) {
      const overlayId = idRef.current;
      const y = overlaysGetScroll(overlayId);
      window.scrollTo(0, y);
    }
  }, [
    shown,
  ]);

  return createPortal(
    <div className={cn(s.overlay, shown && s.shown)}>
      <div className={s.wrp}>
        {children}
      </div>
    </div>,
    window.document.getElementById(OVERLAYS_ELEMENT_ID),
  );
}

export default Overlay;
