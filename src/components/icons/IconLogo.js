import propTypes from 'prop-types';
import Icon from '@/vectors/logo.svg';

IconLogo.propTypes = {
  className: propTypes.string,
};

IconLogo.defaultProps = {
  className: '',
};

function IconLogo(props) {
  return (
    <Icon {...props} />
  );
}

export default IconLogo;
