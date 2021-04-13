import propTypes from 'prop-types';
import cn from 'classnames';
import s from './styles.scss';

PageLoading.propTypes = {
  className: propTypes.string,
};

PageLoading.defaultProps = {
  className: '',
};

function PageLoading(props) {
  const { className } = props;

  return (
   <div className={cn(s.loading, className)}>
   </div>
  );
}

export default PageLoading;
