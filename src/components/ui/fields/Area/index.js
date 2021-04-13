import { forwardRef, useRef, useCallback, useLayoutEffect } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { useSetRef } from '@/hooks/useSetRef';
import input from '@/styles/input.scss';
import s from './styles.scss';

const FieldArea = forwardRef((props, ref) => {
  const {
    className,
    failed,
    autoHeight,
    rows,
    maxRows,
    minLength,
    maxLength,
    autoComplete,
    placeholder,
    name,
    theme,
    disabled,
    value,
    onChange,
    ...restProps
  } = props;
  /** @type {{ current: HTMLAreaElement }} */
  const fieldRef = useRef(null);
  const setRef = useSetRef([ref, fieldRef]);

  const handleChange = useCallback((e) => {
    const { target: { value: nextValue } } = e;
    if (typeof onChange === 'function') {
      onChange(nextValue.slice(0, maxLength));
    }
  }, [
    maxLength,
    onChange,
  ]);

  useLayoutEffect(() => {
    const field = fieldRef.current;
    if (autoHeight) {
      field.style.setProperty('min-height', '1px');
      const bloodyMagic = 2;
      if (maxRows > 0) {
        const styles = window.getComputedStyle(field);
        const { lineHeight } = styles;
        const maxHeight = maxRows * parseFloat(lineHeight);
        const scrollHeight = Math.min(maxHeight, field.scrollHeight + bloodyMagic);
        field.style.setProperty('min-height', `${scrollHeight}px`);
      }
      else {
        const scrollHeight = field.scrollHeight + bloodyMagic;
        field.style.setProperty('min-height', `${scrollHeight}px`);
      }
    }
  });

  return (
    <textarea
      className={cn(
        input.input,
        input.area,
        input[theme],
        failed && s.failed,
        className,
      )}
      ref={setRef}
      rows={rows}
      autoComplete="off"
      minLength={minLength}
      maxLength={maxLength}
      placeholder={placeholder}
      name={name}
      disabled={disabled}
      value={value}
      onChange={handleChange}
      {...restProps}
    />
  );
});

FieldArea.displayName = 'FieldArea';

FieldArea.propTypes = {
  className: propTypes.string,
  failed: propTypes.bool,
  autoHeight: propTypes.bool,
  rows: propTypes.number,
  maxRows: propTypes.number,
  minLength: propTypes.number,
  maxLength: propTypes.number,
  autoComplete: propTypes.string,
  placeholder: propTypes.string,
  name: propTypes.string,
  theme: propTypes.oneOf([
    '',
    'default',
  ]),
  disabled: propTypes.bool,
  value: propTypes.string,
  onChange: propTypes.func,
};

FieldArea.defaultProps = {
  className: '',
  failed: false,
  autoHeight: false,
  rows: 3,
  maxRows: 0,
  minLength: undefined,
  maxLength: undefined,
  autoComplete: 'off',
  placeholder: '',
  name: '',
  theme: 'default',
  disabled: false,
  value: '',
  onChange: null,
};

export default FieldArea;
