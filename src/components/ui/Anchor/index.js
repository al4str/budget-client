import { forwardRef, useRef, useEffect } from 'react';
import propTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import { chunksPrefetchRoute, chunksWatchLink, chunksUnWatchLink } from '@/libs/chunks';
import { refGetElement } from '@/libs/ref';
import { useSetRef } from '@/hooks/useSetRef';

const Anchor = forwardRef((props, ref) => {
  const {
    className,
    activeClassName,
    type,
    to,
    children,
    ...restProps
  } = props;
  /** @type {React.RefObject<HTMLAnchorElement>} */
  const elRef = useRef(null);
  const setRef = useSetRef([ref, elRef]);

  useEffect(() => {
    /** @type {null|HTMLAnchorElement} */
    const link = refGetElement(elRef);
    if (link) {
      chunksPrefetchRoute(link.pathname);
      chunksWatchLink(link);
    }

    return () => {
      if (link) {
        chunksUnWatchLink(link);
      }
    };
  }, []);

  switch (type) {
    case 'link':
      return (
        <Link
          className={className}
          ref={setRef}
          to={to}
          {...restProps}
        >
          {children}
        </Link>
      );
    case 'nav':
      return (
        <NavLink
          className={className}
          activeClassName={activeClassName}
          ref={setRef}
          to={to}
          {...restProps}
        >
          {children}
        </NavLink>
      );
    case 'anchor':
      return (
        <a
          className={className}
          ref={setRef}
          href={to}
          {...restProps}
        >
          {children}
        </a>
      );
    default:
      return null;
  }
});

Anchor.displayName = 'Anchor';

Anchor.propTypes = {
  className: propTypes.string,
  activeClassName: propTypes.string,
  type: propTypes.oneOf([
    'link',
    'nav',
    'anchor',
  ]),
  to: propTypes.string,
  children: propTypes.node,
};

Anchor.defaultProps = {
  className: '',
  activeClassName: '',
  type: 'anchor',
  to: '',
  children: null,
};

export default Anchor;
