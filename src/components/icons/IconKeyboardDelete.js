import propTypes from 'prop-types';
import Icon from '@/vectors/keyboard-delete.svg';

IconKeyboardDelete.propTypes = {
  className: propTypes.string,
};

IconKeyboardDelete.defaultProps = {
  className: '',
};

function IconKeyboardDelete(props) {
  return (
    <Icon {...props} />
  );
}

export default IconKeyboardDelete;
