import propTypes from 'prop-types';
import cn from 'classnames';
import { OVERLAYS_ELEMENT_ID } from '@/hooks/useOverlays';
import s from './styles.scss';

OverlaysContainer.propTypes = {
  className: propTypes.string,
};

OverlaysContainer.defaultProps = {
  className: '',
};

function OverlaysContainer(props) {
  const { className } = props;

  return (
    <div
      className={cn(s.container, className)}
      id={OVERLAYS_ELEMENT_ID}
    />
  );
}

export default OverlaysContainer;
