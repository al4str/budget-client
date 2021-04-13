import propTypes from 'prop-types';
import Icon from '@/vectors/spinner.svg';

IconSpinner.propTypes = {
  className: propTypes.string,
};

IconSpinner.defaultProps = {
  className: '',
};

function IconSpinner(props) {
  return (
    <Icon {...props} />
  );
}

export default IconSpinner;
