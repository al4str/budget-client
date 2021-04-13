import propTypes from 'prop-types';
import Icon from '@/vectors/add.svg';

IconAdd.propTypes = {
  className: propTypes.string,
};

IconAdd.defaultProps = {
  className: '',
};

function IconAdd(props) {
  return (
    <Icon {...props} />
  );
}

export default IconAdd;
