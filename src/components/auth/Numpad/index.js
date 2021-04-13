import { useMemo, useCallback } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import IconKeyboardDelete from '@/components/icons/IconKeyboardDelete';
import IconKeyboardReturn from '@/components/icons/IconKeyboardReturn';
import Action from '@/components/ui/Action';
import btn from '@/styles/button.scss';
import s from './styles.scss';

AuthNumpad.propTypes = {
  className: propTypes.string,
  failure: propTypes.string,
  userPIN: propTypes.string,
  onPINChange: propTypes.func,
};

AuthNumpad.defaultProps = {
  className: '',
  failure: '',
  userPIN: '',
  onPINChange: null,
};

function AuthNumpad(props) {
  const {
    className,
    failure,
    userPIN,
    onPINChange,
  } = props;

  /** @type {function(string): void} */
  const handleAdd = useCallback((num) => {
    onPINChange(userPIN.concat(num));
  }, [
    userPIN,
    onPINChange,
  ]);
  const handleDelete = useCallback(() => {
    onPINChange(userPIN.slice(0, userPIN.length - 1));
  }, [
    userPIN,
    onPINChange,
  ]);

  /** @type {Array<{
   *   key: string
   *   filled: boolean
   * }>} */
  const dots = useMemo(() => {
    return new Array(4)
      .fill(0)
      .map((_, i) => ({
        key: i.toString(),
        filled: i < userPIN.length,
      }));
  }, [
    userPIN,
  ]);
  /** @type {Array<{
   *   key: string
   *   label: string
   *   Icon?: Function
   *   onClick: Function
   * }>} */
  const nums = useMemo(() => {
    return new Array(9)
      .fill(0)
      .map((_, i) => ({
        key: i.toString(),
        label: (i + 1).toString(),
        onClick: handleAdd.bind(null, i + 1),
      }))
      .concat([
        {
          key: 'del',
          label: '⌫',
          Icon: IconKeyboardDelete,
          onClick: handleDelete,
        },
        {
          key: 'zero',
          label: '0',
          onClick: handleAdd.bind(null, 0),
        },
        {
          key: 'submit',
          label: '⏎',
          Icon: IconKeyboardReturn,
          onClick: handleAdd.bind(null, ''),
        },
      ]);
  }, [
    handleAdd,
    handleDelete,
  ]);

  return (
    <div className={cn(s.numpad, className)}>
      <ul className={s.dotsList}>
        {dots.map((dot) => (
          <li
            className={s.dotsItem}
            key={dot.key}
          >
            <span className={cn(
              s.dot,
              dot.filled && s.filled,
              !!failure && s.failed,
            )} />
          </li>
        ))}
      </ul>
      <div className={s.numsWrp}>
        <ul className={s.numsList}>
          {nums.map((num) => (
            <li
              className={s.numsItem}
              key={num.key}
            >
              <Action
                className={s.numsBtn}
                onClick={num.onClick}
              >
                <span className={btn.wrp}>
                  {typeof num.Icon === 'function'
                  && <num.Icon className={cn(btn.icon, s.numsIcon)} />}
                  <span className={cn(btn.label, s.numsLabel)}>
                    {num.label}
                  </span>
                </span>
              </Action>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AuthNumpad;
