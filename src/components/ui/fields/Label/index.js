import { useMemo } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import s from './styles.scss';

FieldLabel.propTypes = {
  className: propTypes.string,
  failed: propTypes.bool,
  label: propTypes.string,
  messages: propTypes.object,
  validations: propTypes.object,
  description: propTypes.string,
  children: propTypes.node,
};

FieldLabel.defaultProps = {
  className: '',
  failed: false,
  label: '',
  messages: {},
  validations: {},
  description: '',
  children: null,
};

/**
 * @param {Object} props
 * @param {string} props.className
 * @param {boolean} props.failed
 * @param {string} props.label
 * @param {Object<string, string>} props.messages
 * @param {Object<string, boolean>} props.validations
 * @param {string} props.description
 * */
function FieldLabel(props) {
  const {
    className,
    failed,
    label,
    messages,
    validations,
    description,
    children,
  } = props;

  /** @type {Array<{ key: string label: string }>} */
  const errors = useMemo(() => {
    if (!failed) {
      return [];
    }
    return Object
      .entries(validations)
      .reduce((result, [name, invalid]) => {
        if (invalid) {
          return result.concat([{
            key: name,
            label: messages[name] || name,
          }]);
        }
        return result;
      }, []);
  }, [
    failed,
    messages,
    validations,
  ]);

  return (
    <div className={cn(s.wrapper, className)}>
      {!!label
      && <div className={s.labelWrp}>
        <span className={s.label}>
          {label}
        </span>
      </div>}
      <div className={s.field}>
        {children}
        {errors.length > 0
        && <ul className={s.errorsList}>
          {errors.map((error) => (
            <li
              className={s.errorItem}
              key={error.key}
            >
              {error.label}
            </li>
          ))}
        </ul>}
        {description
        && <p className={s.description}>
          {description}
        </p>}
      </div>
    </div>
  );
}

export default FieldLabel;
