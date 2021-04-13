import { useRef, useCallback, useEffect } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import s from './styles.scss';

FieldFileDropZone.propTypes = {
  className: propTypes.string,
  disabled: propTypes.bool,
  onSelect: propTypes.func,
};

FieldFileDropZone.defaultProps = {
  className: '',
  disabled: false,
  onSelect: null,
};

function FieldFileDropZone(props) {
  const {
    className,
    disabled,
    onSelect,
  } = props;
  /** @type {{ current: HTMLDivElement }} */
  const elRef = useRef(null);

  /** @type {function(DragEvent<HTMLElement>)} */
  const handleDragEnter = useCallback((e) => {
    elRef.current.classList.add(s.dragging);
    if (e.target === elRef.current) {
      e.dataTransfer.dropEffect = 'copy';
      elRef.current.classList.add(s.over);
    }
  }, []);
  /** @type {function(DragEvent<HTMLElement>)} */
  const handleDragLeave = useCallback((e) => {
    if (e.target === elRef.current) {
      elRef.current.classList.remove(s.over);
    }
    if (e.target === window.document) {
      elRef.current.classList.remove(s.dragging);
    }
  }, []);
  /** @type {function(DragEvent<HTMLElement>)} */
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);
  /** @type {function(DragEvent<HTMLElement>)} */
  const handleDragEnd = useCallback(() => {
    elRef.current.classList.remove(s.dragging, s.over);
  }, []);
  /** @type {function(DragEvent<HTMLElement>)} */
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (e.target === elRef.current) {
      if (typeof onSelect === 'function') {
        const files = Array.from(e.dataTransfer.files);
        onSelect(files);
      }
    }
    elRef.current.classList.remove(s.dragging, s.over);
  }, [
    onSelect,
  ]);

  useEffect(() => {
    if (!disabled) {
      window.addEventListener('dragenter', handleDragEnter, false);
      window.addEventListener('dragleave', handleDragLeave, false);
      window.addEventListener('dragover', handleDragOver, false);
      window.addEventListener('dragend', handleDragEnd, false);
      window.addEventListener('drop', handleDrop, false);
    }
    return () => {
      window.removeEventListener('dragenter', handleDragEnter, false);
      window.removeEventListener('dragleave', handleDragLeave, false);
      window.removeEventListener('dragover', handleDragOver, false);
      window.removeEventListener('dragend', handleDragEnd, false);
      window.removeEventListener('drop', handleDrop, false);
    };
  }, [
    disabled,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDragEnd,
    handleDrop,
  ]);

  return (
    <div
      className={cn(s.dropZone, className)}
      ref={elRef}
    />
  );
}

export default FieldFileDropZone;
