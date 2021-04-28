import {
  forwardRef,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { sumFormat } from '@/libs/sum';
import { useSetRef } from '@/hooks/useSetRef';
import { usePointerMove } from '@/hooks/usePointerMove';
import IconUpDown from '@/components/icons/IconUpDown';
import common from '@/styles/common.scss';
import input from '@/styles/input.scss';
import s from './styles.scss';

const E_OPT = {
  passive: false,
  capture: false,
};

/**
 * @param {string} value
 * @return {number}
 * */
function parseValue(value) {
  return parseFloat(value
    .replace(/[^0-9.,]/g, '')
    .replace(/[.,]/g, '.')) || 0;
}

/**
 * @param {number|string} value
 * @param {'numeric'|'decimal'} mode
 * @return {string}
 * */
function formatValue(value, mode) {
  const parsedValue = typeof value === 'string'
    ? parseValue(value)
    : value;

  return mode === 'numeric'
    ? sumFormat(parsedValue, { sign: 'never', fraction: 0 })
    : sumFormat(parsedValue, { sign: 'never' });
}

const FieldNumber = forwardRef((props, ref) => {
  const {
    className,
    wrapperClassName,
    failed,
    min,
    max,
    step,
    inputMode,
    placeholder,
    name,
    theme,
    disabled,
    value,
    onChange,
    ...restProps
  } = props;
  /** @type {React.RefObject<HTMLInputElement>} */
  const fieldRef = useRef(null);
  const setRef = useSetRef([ref, fieldRef]);

  /** @type {function(function(number): number): void} */
  const setInputValue = useCallback((updater) => {
    const field = fieldRef.current;
    const fieldValue = parseValue(field.value);
    const nextValue = updater(value);
    const limitedValue = Math.max(min, Math.min(nextValue, max));
    if (limitedValue === fieldValue) {
      return;
    }
    field.value = formatValue(limitedValue, inputMode);
  }, [
    min,
    max,
    inputMode,
    value,
  ]);
  /** @type {function(function(number): number): void} */
  const handleChange = useCallback((updater) => {
    if (typeof onChange === 'function') {
      const computedValue = updater(value);
      const limitedValue = Math.max(min, Math.min(computedValue, max));
      onChange(limitedValue);
    }
  }, [
    min,
    max,
    value,
    onChange,
  ]);
  /** @type {function(InputEvent): void} */
  const handleInput = useCallback((e) => {
    const { target: { value: nextValue } } = e;
    handleChange(() => parseValue(nextValue));
  }, [
    handleChange,
  ]);
  const handleBlur = useCallback(() => {
    const field = fieldRef.current;
    field.value = formatValue(field.value, field.inputMode);
  }, []);
  /** @type {function(KeyboardEvent): void} */
  const handleKeyboardArrows = useCallback((e) => {
    let nextStep = step;
    if (e.metaKey) {
      nextStep = step * 100;
    }
    else if (e.shiftKey) {
      nextStep = step * 10;
    }
    else if (inputMode === 'decimal' && e.ctrlKey) {
      nextStep = step / 10;
    }
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        handleChange((prevValue) => prevValue + nextStep);
        break;
      case 'ArrowDown':
        e.preventDefault();
        handleChange((prevValue) => prevValue - nextStep);
        break;
      default:
        break;
    }
  }, [
    step,
    inputMode,
    handleChange,
  ]);
  /** @type {function(WheelEvent): void} */
  const handleScrollWheel = useCallback((e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    const amount = -1 * step * Math.trunc(e.deltaY);
    handleChange((prevValue) => prevValue + amount);
  }, [
    step,
    handleChange,
  ]);
  /** @type {UsePointerHandler} */
  const handlePointerDown = useCallback((ctx, data) => {
    window.document.body.classList.add(common.bodyConstrains);
    data.cancelEvent();
    const startY = data.clientY;
    ctx.setValue('startY', startY);
  }, []);
  /** @type {UsePointerHandler} */
  const handlePointerMove = useCallback((ctx, data) => {
    fieldRef.current.blur();
    const startY = ctx.getValue('startY');
    const deltaY = startY - data.clientY;
    const amount = step * Math.ceil(deltaY);
    handleChange((prevValue) => prevValue + amount);
  }, [
    step,
    handleChange,
  ]);
  /** @type {UsePointerHandler} */
  const handlePointerUp = useCallback(() => {
    window.document.body.classList.remove(common.bodyConstrains);
  }, []);

  const { onPointerDown } = usePointerMove({
    onDown: handlePointerDown,
    onMove: handlePointerMove,
    onUp: handlePointerUp,
  });

  useEffect(() => {
    const field = fieldRef.current;
    field.value = formatValue(field.value, field.inputMode);
  }, []);
  useEffect(() => {
    const field = fieldRef.current;
    field.addEventListener('input', handleInput, E_OPT);
    field.addEventListener('blur', handleBlur, E_OPT);
    field.addEventListener('keydown', handleKeyboardArrows, E_OPT);
    field.addEventListener('wheel', handleScrollWheel, E_OPT);

    return () => {
      field.removeEventListener('input', handleInput, E_OPT);
      field.removeEventListener('blur', handleBlur, E_OPT);
      field.removeEventListener('keydown', handleKeyboardArrows, E_OPT);
      field.removeEventListener('wheel', handleScrollWheel, E_OPT);
    };
  }, [
    handleInput,
    handleBlur,
    handleKeyboardArrows,
    handleScrollWheel,
  ]);
  useEffect(() => {
    setInputValue((nextValue) => nextValue);
  }, [
    setInputValue,
  ]);

  return (
    <div className={cn(s.field, wrapperClassName)}>
      <input
        className={cn(
          input.input,
          input[theme],
          failed && input.failed,
          s.input,
          className,
        )}
        ref={setRef}
        autoComplete="off"
        type="text"
        inputMode={inputMode}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        name={name}
        disabled={disabled}
        defaultValue={value}
        {...restProps}
      />
      <span
        className={s.iconWrp}
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}
      >
        <IconUpDown className={s.icon} />
      </span>
    </div>
  );
});

FieldNumber.displayName = 'FieldNumber';

FieldNumber.propTypes = {
  className: propTypes.string,
  wrapperClassName: propTypes.string,
  failed: propTypes.bool,
  min: propTypes.number,
  max: propTypes.number,
  step: propTypes.number,
  inputMode: propTypes.oneOf([
    'decimal',
    'numeric',
  ]),
  placeholder: propTypes.string,
  name: propTypes.string,
  theme: propTypes.oneOf([
    '',
    'default',
  ]),
  disabled: propTypes.bool,
  value: propTypes.number,
  onChange: propTypes.func,
};

FieldNumber.defaultProps = {
  className: '',
  wrapperClassName: '',
  failed: false,
  min: 0,
  max: 1,
  step: 0.01,
  inputMode: 'decimal',
  placeholder: '',
  name: '',
  theme: 'default',
  disabled: false,
  value: 0,
  onChange: null,
};

export default FieldNumber;
