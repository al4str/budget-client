import propTypes from 'prop-types';
import Icon from '@/vectors/backup.svg';

IconBackup.propTypes = {
  className: propTypes.string,
};

IconBackup.defaultProps = {
  className: '',
};

function IconBackup(props) {
  return (
    <Icon {...props} />
  );
}

export default IconBackup;
