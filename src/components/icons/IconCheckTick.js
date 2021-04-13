import propTypes from 'prop-types';
import Icon from '@/vectors/check-tick.svg';

IconCheckTick.propTypes = {
  className: propTypes.string,
};

IconCheckTick.defaultProps = {
  className: '',
};

function IconCheckTick(props) {
  return (
    <Icon {...props} />
  );
}

export default IconCheckTick;
