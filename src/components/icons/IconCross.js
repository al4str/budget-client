import propTypes from 'prop-types';
import Icon from '@/vectors/cross.svg';

IconCross.propTypes = {
  className: propTypes.string,
};

IconCross.defaultProps = {
  className: '',
};

function IconCross(props) {
  return (
    <Icon {...props} />
  );
}

export default IconCross;
