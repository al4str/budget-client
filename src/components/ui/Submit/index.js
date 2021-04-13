import { forwardRef, useRef } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { useSetRef } from '@/hooks/useSetRef';
import IconSpinner from '@/components/icons/IconSpinner';
import Action from '@/components/ui/Action';
import common from '@/styles/common.scss';
import btn from '@/styles/button.scss';
import s from './styles.scss';

const Submit = forwardRef((props, ref) => {
  const {
    className,
    disabled,
    pending,
    multiline,
    looseFocus,
    theme,
    label,
    type,
    onClick,
  } = props;
  /** @type {React.RefObject<HTMLButtonElement>} */
  const elRef = useRef(null);
  const setRef = useSetRef([ref, elRef]);

  return (
    <Action
      className={cn(
        btn.button,
        s.submit,
        pending && s.pending,
        className,
      )}
      disabled={disabled}
      looseFocus={looseFocus}
      ref={setRef}
      theme={theme}
      type={type}
      tabIndex={pending ? '-1' : '0'}
      onClick={pending ? null : onClick}
    >
      <span className={cn(btn.wrp, s.wrapper)}>
        <span className={cn(
          btn.label,
          multiline && common.multiline,
          s.label,
        )}>
          {label}
        </span>
        <span className={s.spinnerWrp}>
          <IconSpinner className={s.spinner} />
        </span>
      </span>
    </Action>
  );
});

Submit.displayName = 'Submit';

Submit.propTypes = {
  className: propTypes.string,
  disabled: propTypes.bool,
  pending: propTypes.bool,
  multiline: propTypes.bool,
  looseFocus: propTypes.bool,
  theme: propTypes.string,
  label: propTypes.string,
  type: propTypes.oneOf([
    'button',
    'submit',
  ]),
  onClick: propTypes.func,
};

Submit.defaultProps = {
  className: '',
  disabled: false,
  pending: false,
  multiline: false,
  looseFocus: false,
  theme: '',
  type: 'submit',
  label: '',
  onClick: null,
};

export default Submit;
