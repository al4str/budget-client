import propTypes from 'prop-types';
import Icon from '@/vectors/arrow-drop-down.svg';

IconArrowDropDown.propTypes = {
  className: propTypes.string,
};

IconArrowDropDown.defaultProps = {
  className: '',
};

function IconArrowDropDown(props) {
  return (
    <Icon {...props} />
  );
}

export default IconArrowDropDown;
