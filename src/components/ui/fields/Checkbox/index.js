import { forwardRef, useRef, useCallback } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { idGet } from '@/libs/id';
import IconCheckBox from '@/components/icons/IconCheckBox';
import IconCheckTick from '@/components/icons/IconCheckTick';
import s from './styles.scss';

const FieldCheckbox = forwardRef((props, ref) => {
  const {
    className,
    label,
    name,
    disabled,
    value,
    onChange,
    ...restProps
  } = props;
  const idRef = useRef(idGet());
  const id = idRef.current;
  const Icon = value
    ? IconCheckTick
    : IconCheckBox;

  /** @type {function(React.ChangeEvent<HTMLInputElement>)} */
  const handleChange = useCallback((e) => {
    const { target: { checked } } = e;
    if (typeof onChange === 'function') {
      onChange(checked);
    }
  }, [
    onChange,
  ]);

  return (
    <div className={cn(s.field, disabled && s.disabled, className)}>
      <input
        className={s.input}
        ref={ref}
        id={id}
        type="checkbox"
        name={name}
        disabled={disabled}
        checked={value}
        onChange={handleChange}
        {...restProps}
      />
      <label
        className={s.wrp}
        htmlFor={id}
      >
        <Icon className={s.icon} />
        {!!label
        && <span className={s.label}>
          {label}
        </span>}
      </label>
    </div>
  );
});

FieldCheckbox.displayName = 'FieldCheckbox';

FieldCheckbox.propTypes = {
  className: propTypes.string,
  label: propTypes.string,
  name: propTypes.string,
  disabled: propTypes.bool,
  value: propTypes.bool,
  onChange: propTypes.func,
};

FieldCheckbox.defaultProps = {
  className: '',
  label: '',
  name: '',
  disabled: false,
  value: false,
  onChange: null,
};

export default FieldCheckbox;
