import propTypes from 'prop-types';
import Icon from '@/vectors/check-box.svg';

IconCheckBox.propTypes = {
  className: propTypes.string,
};

IconCheckBox.defaultProps = {
  className: '',
};

function IconCheckBox(props) {
  return (
    <Icon {...props} />
  );
}

export default IconCheckBox;
