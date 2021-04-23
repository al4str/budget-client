import propTypes from 'prop-types';
import Icon from '@/vectors/up-down.svg';

IconUpDown.propTypes = {
  className: propTypes.string,
};

IconUpDown.defaultProps = {
  className: '',
};

function IconUpDown(props) {
  return (
    <Icon {...props} />
  );
}

export default IconUpDown;
