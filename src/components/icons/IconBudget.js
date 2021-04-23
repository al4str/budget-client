import propTypes from 'prop-types';
import Icon from '@/vectors/budget.svg';

IconBudget.propTypes = {
  className: propTypes.string,
};

IconBudget.defaultProps = {
  className: '',
};

function IconBudget(props) {
  return (
    <Icon {...props} />
  );
}

export default IconBudget;
