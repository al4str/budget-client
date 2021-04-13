import propTypes from 'prop-types';
import Icon from '@/vectors/subtract.svg';

IconSubtract.propTypes = {
  className: propTypes.string,
};

IconSubtract.defaultProps = {
  className: '',
};

function IconSubtract(props) {
  return (
    <Icon {...props} />
  );
}

export default IconSubtract;
