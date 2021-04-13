import propTypes from 'prop-types';
import Icon from '@/vectors/edit.svg';

IconEdit.propTypes = {
  className: propTypes.string,
};

IconEdit.defaultProps = {
  className: '',
};

function IconEdit(props) {
  return (
    <Icon {...props} />
  );
}

export default IconEdit;
