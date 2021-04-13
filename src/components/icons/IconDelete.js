import propTypes from 'prop-types';
import Icon from '@/vectors/delete.svg';

IconDelete.propTypes = {
  className: propTypes.string,
};

IconDelete.defaultProps = {
  className: '',
};

function IconDelete(props) {
  return (
    <Icon {...props} />
  );
}

export default IconDelete;
