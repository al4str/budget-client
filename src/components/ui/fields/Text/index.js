import { forwardRef, useRef, useCallback } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { useSetRef } from '@/hooks/useSetRef';
import input from '@/styles/input.scss';

const FieldText = forwardRef((props, ref) => {
  const {
    className,
    failed,
    minLength,
    maxLength,
    autoComplete,
    inputMode,
    placeholder,
    name,
    type,
    theme,
    disabled,
    value,
    onChange,
    ...restProps
  } = props;
  /** @type {{ current: HTMLInputElement }} */
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

  return (
    <input
      className={cn(
        input.input,
        input[theme],
        failed && input.failed,
        className,
      )}
      ref={setRef}
      autoComplete={autoComplete}
      type={type}
      inputMode={inputMode}
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

FieldText.displayName = 'FieldText';

FieldText.propTypes = {
  className: propTypes.string,
  failed: propTypes.bool,
  minLength: propTypes.number,
  maxLength: propTypes.number,
  autoComplete: propTypes.oneOf([
    'off',
    'on',
    'name',
    'honorific-prefix',
    'given-name',
    'additional-name',
    'family-name',
    'honorific-suffix',
    'nickname',
    'email',
    'username',
    'new-password',
    'current-password',
    'one-time-code',
    'organization-title',
    'organization',
    'street-address',
    'address-line1',
    'address-line2',
    'address-line3',
    'address-level4',
    'address-level3',
    'address-level2',
    'address-level1',
    'country',
    'country-name',
    'postal-code',
    'cc-name',
    'cc-given-name',
    'cc-additional-name',
    'cc-family-name',
    'cc-number',
    'cc-exp',
    'cc-exp-month',
    'cc-exp-year',
    'cc-csc',
    'cc-type',
    'transaction-currency',
    'transaction-amount',
    'language',
    'bday',
    'bday-day',
    'bday-month',
    'bday-year',
    'sex',
    'tel',
    'tel-country-code',
    'tel-national',
    'tel-area-code',
    'tel-local',
    'tel-extension',
    'impp',
    'url',
    'photo',
  ]),
  inputMode: propTypes.oneOf([
    'none',
    'text',
    'decimal',
    'numeric',
    'tel',
    'search',
    'email',
    'url',
  ]),
  placeholder: propTypes.string,
  name: propTypes.string,
  type: propTypes.oneOf([
    'button',
    'checkbox',
    'color',
    'date',
    'datetime-local',
    'email',
    'file',
    'hidden',
    'image',
    'month',
    'number',
    'password',
    'radio',
    'range',
    'reset',
    'search',
    'submit',
    'tel',
    'text',
    'time',
    'url',
    'week',
  ]),
  theme: propTypes.oneOf([
    '',
    'default',
  ]),
  disabled: propTypes.bool,
  value: propTypes.string,
  onChange: propTypes.func,
};

FieldText.defaultProps = {
  className: '',
  failed: false,
  minLength: undefined,
  maxLength: undefined,
  autoComplete: 'off',
  inputMode: 'text',
  placeholder: '',
  name: '',
  type: 'text',
  theme: 'default',
  disabled: false,
  value: '',
  onChange: null,
};

export default FieldText;
