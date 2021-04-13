import { useMemo } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import s from './styles.scss';

Pender.propTypes = {
  className: propTypes.string,
  color: propTypes.string,
  finished: propTypes.bool,
};

Pender.defaultProps = {
  className: '',
  color: '',
  finished: false,
};

function Pender(props) {
  const {
    className,
    color,
    finished,
  } = props;

  const backgroundImage = useMemo(() => {
    const transparent = color.replace(/[.\d]+\)$/, '0)');
    return `linear-gradient(100deg, ${transparent} 10%, ${color} 40%, ${transparent} 80%)`;
  }, [
    color,
  ]);

  return (
    <span className={cn(s.pender, className, finished && s.finished)}>
      <span
        className={s.runner}
        style={{ backgroundImage }}
      />
    </span>
  );
}

export default Pender;
