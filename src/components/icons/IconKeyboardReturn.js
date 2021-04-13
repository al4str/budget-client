import propTypes from 'prop-types';
import Icon from '@/vectors/keyboard-return.svg';

IconKeyboardReturn.propTypes = {
  className: propTypes.string,
};

IconKeyboardReturn.defaultProps = {
  className: '',
};

function IconKeyboardReturn(props) {
  return (
    <Icon {...props} />
  );
}

export default IconKeyboardReturn;
