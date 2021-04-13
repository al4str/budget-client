import { forwardRef, useRef, useCallback } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { useSetRef } from '@/hooks/useSetRef';
import Anchor from '@/components/ui/Anchor';
import b from '@/styles/button.scss';

const Action = forwardRef((props, ref) => {
  const {
    className,
    activeClassName,
    disabled,
    looseFocus,
    theme,
    type,
    to,
    onClick,
    children,
    ...restProps
  } = props;
  const classNames = cn(b.button, b[theme], className);
  const tabIndex = disabled
    ? '-1'
    : '0';

  /** @type {React.RefObject<HTMLButtonElement|HTMLAnchorElement>} */
  const elRef = useRef(null);
  const setRef = useSetRef([ref, elRef]);

  /** @type {function(React.MouseEvent<HTMLButtonElement>)} */
  const handleClick = useCallback((e) => {
    if (typeof onClick === 'function' && e.button === 0) {
      onClick(e);
    }
    if (looseFocus) {
      elRef.current.blur();
    }
  }, [
    looseFocus,
    onClick,
  ]);
  /** @type {function(React.MouseEvent<HTMLButtonElement>)} */
  const handlePrevent = useCallback((e) => {
    e.preventDefault();
  }, []);

  const clickHandler = disabled
    ? handlePrevent
    : handleClick;

  switch (type) {
    case 'button':
    case 'submit':
      return (
        <button
          className={classNames}
          ref={setRef}
          type={type}
          disabled={disabled}
          onClick={clickHandler}
          {...restProps}
        >
          {children}
        </button>
      );
    case 'link':
    case 'nav':
    case 'anchor':
      return (
        <Anchor
          className={classNames}
          activeClassName={activeClassName}
          ref={setRef}
          type={type}
          to={to}
          tabIndex={tabIndex}
          onClick={clickHandler}
          {...restProps}
        >
          {children}
        </Anchor>
      );
    default:
      return null;
  }
});

Action.displayName = 'Action';

Action.propTypes = {
  className: propTypes.string,
  activeClassName: propTypes.string,
  disabled: propTypes.bool,
  looseFocus: propTypes.bool,
  theme: propTypes.oneOf([
    '',
  ]),
  type: propTypes.oneOf([
    'button',
    'submit',
    'link',
    'nav',
    'anchor',
  ]),
  to: propTypes.string,
  onClick: propTypes.func,
  children: propTypes.node,
};

Action.defaultProps = {
  className: '',
  activeClassName: '',
  disabled: false,
  looseFocus: false,
  theme: '',
  type: 'button',
  to: '',
  onClick: null,
  children: null,
};

export default Action;
