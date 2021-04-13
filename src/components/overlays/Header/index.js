import propTypes from 'prop-types';
import cn from 'classnames';
import IconArrowLeft from '@/components/icons/IconArrowLeft';
import IconCross from '@/components/icons/IconCross';
import Action from '@/components/ui/Action';
import btn from '@/styles/button.scss';
import s from './styles.scss';

OverlayHeader.propTypes = {
  className: propTypes.string,
  title: propTypes.string,
  onBack: propTypes.func,
  onClose: propTypes.func,
};

OverlayHeader.defaultProps = {
  className: '',
  title: '',
  onBack: null,
  onClose: null,
};

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {Function} props.onBack
 * @param {Function} props.onClose
 * */
function OverlayHeader(props) {
  const {
    className,
    title,
    onBack,
    onClose,
  } = props;
  const withBack = typeof onBack === 'function';
  const withClose = typeof onClose === 'function';

  return (
    <div className={cn(s.header, className)}>
      <div className={s.wrp}>
        <Action
          className={cn(s.action, !withBack && s.actionHidden)}
          disabled={!withBack}
          onClick={withBack ? onBack : null}
        >
          <span className={btn.wrp}>
            <IconArrowLeft className={btn.icon} />
          </span>
        </Action>
        <p className={s.title}>
          {title}
        </p>
        <Action
          className={cn(s.action, !withClose && s.actionHidden)}
          disabled={!withClose}
          onClick={withClose ? onClose : null}
        >
          <span className={btn.wrp}>
            <IconCross className={btn.icon} />
          </span>
        </Action>
      </div>
    </div>
  );
}

export default OverlayHeader;
