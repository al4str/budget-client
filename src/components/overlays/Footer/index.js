import propTypes from 'prop-types';
import cn from 'classnames';
import s from './styles.scss';

OverlayFooter.propTypes = {
  className: propTypes.string,
  children: propTypes.node,
};

OverlayFooter.defaultProps = {
  className: '',
  children: null,
};

/**
 * @param {Object} props
 * @param {string} props.className
 * */
function OverlayFooter(props) {
  const {
    className,
    children,
  } = props;

  return (
    <div className={cn(s.footer, className)}>
      {children}
    </div>
  );
}

export default OverlayFooter;
