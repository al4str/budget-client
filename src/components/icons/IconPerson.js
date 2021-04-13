import propTypes from 'prop-types';
import Icon from '@/vectors/person.svg';

IconPerson.propTypes = {
  className: propTypes.string,
};

IconPerson.defaultProps = {
  className: '',
};

function IconPerson(props) {
  return (
    <Icon {...props} />
  );
}

export default IconPerson;
