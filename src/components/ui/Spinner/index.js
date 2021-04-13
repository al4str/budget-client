import propTypes from 'prop-types';
import cn from 'classnames';
import IconSpinner from '@/components/icons/IconSpinner';
import s from './styles.scss';

Spinner.propTypes = {
  className: propTypes.string,
};

Spinner.defaultProps = {
  className: '',
};

function Spinner(props) {
  const { className } = props;

  return (
    <span className={cn(s.spinner, className)}>
      <IconSpinner className={s.icon} />
    </span>
  );
}

export default Spinner;
