import propTypes from 'prop-types';
import cn from 'classnames';
import Submit from '@/components/ui/Submit';
import s from './styles.scss';

SubmitSticky.propTypes = {
  className: propTypes.string,
  pending: propTypes.bool,
  shown: propTypes.bool,
  disabled: propTypes.bool,
  type: propTypes.string,
  label: propTypes.string,
  onClick: propTypes.func,
};

SubmitSticky.defaultProps = {
  className: '',
  pending: false,
  shown: false,
  disabled: false,
  type: 'submit',
  label: '',
  onClick: null,
};

/**
 * @param {Object} props
 * @param {string} props.className
 * @param {boolean} props.pending
 * @param {boolean} props.shown
 * @param {boolean} props.disabled
 * @param {'button'|'submit'} props.type
 * @param {string} props.label
 * @param {Function} props.onClick
 * */
function SubmitSticky(props) {
  const {
    className,
    pending,
    shown,
    disabled,
    type,
    label,
    onClick,
    ...restProps
  } = props;

  return (
    <div className={cn(s.wrp, shown && s.shown, className)}>
      <Submit
        className={s.submit}
        pending={pending}
        disabled={!shown || disabled}
        type={type}
        label={label}
        onClick={onClick}
        {...restProps}
      />
    </div>
  );
}

export default SubmitSticky;
