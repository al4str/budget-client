import propTypes from 'prop-types';
import Icon from '@/vectors/upload.svg';

IconUpload.propTypes = {
  className: propTypes.string,
};

IconUpload.defaultProps = {
  className: '',
};

function IconUpload(props) {
  return (
    <Icon {...props} />
  );
}

export default IconUpload;
