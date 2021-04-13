import propTypes from 'prop-types';
import Icon from '@/vectors/arrow-left.svg';

IconArrowLeft.propTypes = {
  className: propTypes.string,
};

IconArrowLeft.defaultProps = {
  className: '',
};

function IconArrowLeft(props) {
  return (
    <Icon {...props} />
  );
}

export default IconArrowLeft;
