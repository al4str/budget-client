import propTypes from 'prop-types';
import cn from 'classnames';
import s from './styles.scss';

OverlayBody.propTypes = {
  className: propTypes.string,
  children: propTypes.node,
};

OverlayBody.defaultProps = {
  className: '',
  children: null,
};

/**
 * @param {Object} props
 * @param {string} props.className
 * */
function OverlayBody(props) {
  const {
    className,
    children,
  } = props;

  return (
    <div className={cn(s.body, className)}>
      {children}
    </div>
  );
}

export default OverlayBody;
