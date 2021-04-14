import { forwardRef, useRef, useCallback } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { idGet } from '@/libs/id';
import { useT9ns } from '@/hooks/useI18n';
import IconArrowDropDown from '@/components/icons/IconArrowDropDown';
import input from '@/styles/input.scss';
import btn from '@/styles/button.scss';
import s from './styles.scss';

const FieldSelect = forwardRef((props, ref) => {
  const {
    className,
    failed,
    disabled,
    placeholder,
    values,
    value,
    onChange,
    ...restProps
  } = props;
  const idRef = useRef(idGet());
  const { nothing } = useT9ns({
    nothing: 'forms.select.placeholder',
  });
  const id = idRef.current;
  const selectedItem = values.find((item) => item.value === value);
  const label = selectedItem
    ? selectedItem.label
    : placeholder;

  /** @type {function(React.ChangeEvent<HTMLSelectElement>)}*/
  const handleChange = useCallback((e) => {
    if (typeof onChange === 'function') {
      onChange(e.target.value);
    }
  }, [
    onChange,
  ]);

  return (
    <div className={cn(
      s.select,
      failed && s.failed,
      disabled && s.disabled,
      className,
    )}>
      <select
        className={s.field}
        id={id}
        ref={ref}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        {...restProps}
      >
        {values.length === 0
        && <option
          disabled
          value=""
        >
          {nothing}
        </option>}
        {values.map((item) => (
          <option
            key={item.key}
            disabled={item.disabled}
            value={item.value}
          >
            {item.label}
          </option>
        ))}
      </select>
      <label
        className={cn(btn.button, input.default, s.button)}
        htmlFor={id}
      >
        <span className={cn(btn.wrp, s.wrp)}>
          <span className={cn(btn.label, s.label)}>
            {label}
          </span>
          <IconArrowDropDown className={cn(btn.icon, s.icon)} />
        </span>
      </label>
    </div>
  );
});

FieldSelect.displayName = 'FieldSelect';

FieldSelect.propTypes = {
  className: propTypes.string,
  failed: propTypes.bool,
  disabled: propTypes.bool,
  placeholder: propTypes.string,
  values: propTypes.arrayOf(propTypes.shape({
    key: propTypes.string,
    disabled: propTypes.bool,
    value: propTypes.string,
    label: propTypes.string,
  })),
  value: propTypes.string,
  onChange: propTypes.func,
};

FieldSelect.defaultProps = {
  className: '',
  failed: false,
  disabled: false,
  placeholder: '',
  values: [],
  value: '',
  onChange: null,
};

/**
 * @typedef {Object} FieldSelectItem
 * @property {string} key
 * @property {boolean} disabled
 * @property {string} value
 * @property {string} label
 * */

export default FieldSelect;
