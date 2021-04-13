import { useCallback } from 'react';
import propTypes from 'prop-types';

FieldFileInput.propTypes = {
  className: propTypes.string,
  disabled: propTypes.bool,
  multiple: propTypes.bool,
  capture: propTypes.oneOf([
    '',
    'user',
    'environment',
  ]),
  accept: propTypes.oneOfType([
    propTypes.string,
    propTypes.oneOf([
      '',
      'image/*',
    ]),
  ]),
  onSelect: propTypes.func,
};

FieldFileInput.defaultProps = {
  className: '',
  disabled: false,
  multiple: undefined,
  capture: undefined,
  accept: undefined,
  onSelect: null,
};

/**
 * @param {Object} props
 * @param {function(Array<File>)} props.onSelect
 * */
function FieldFileInput(props) {
  const {
    className,
    disabled,
    multiple,
    capture,
    accept,
    onSelect,
  } = props;

  /** @type {function(React.ChangeEvent<HTMLInputElement>)} */
  const handleChange = useCallback((e) => {
    e.preventDefault();
    const fileInput = e.target;
    if (typeof onSelect === 'function') {
      onSelect(Array.from(fileInput.files));
    }
    fileInput.value = null;
    fileInput.blur();
  }, [
    onSelect,
  ]);

  return (
    <input
      className={className}
      type="file"
      multiple={multiple}
      disabled={disabled}
      capture={capture || undefined}
      accept={accept}
      onChange={handleChange}
    />
  );
}

export default FieldFileInput;
