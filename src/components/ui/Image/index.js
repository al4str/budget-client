import { forwardRef, useRef, useEffect } from 'react';
import propTypes from 'prop-types';
import { useSetRef } from '@/hooks/useSetRef';

const Image = forwardRef((props, ref) => {
  const {
    className,
    src,
    alt,
    onLoad,
    onError,
    ...restProps
  } = props;
  /** @type {React.RefObject<HTMLImageElement>} */
  const elRef = useRef(null);
  const setRef = useSetRef([ref, elRef]);

  useEffect(() => {
    const el = elRef.current;
    el.onerror = onError;
    el.onload = onLoad;
    if (el.complete && typeof onLoad === 'function') {
      onLoad();
    }
  }, [
    onLoad,
    onError,
  ]);

  return (
    <img
      className={className}
      ref={setRef}
      src={src}
      alt={alt}
      {...restProps}
    />
  );
});

Image.displayName = 'Image';

Image.propTypes = {
  className: propTypes.string,
  src: propTypes.string,
  alt: propTypes.string,
  onLoad: propTypes.func,
  onError: propTypes.func,
};

Image.defaultProps = {
  className: '',
  src: '',
  alt: '',
  onLoad: null,
  onError: null,
};

export default Image;
