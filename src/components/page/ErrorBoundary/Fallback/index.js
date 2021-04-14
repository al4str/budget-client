import { useMemo } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { useT9ns } from '@/hooks/useI18n';
import s from './styles.scss';

ErrorBoundaryFallback.propTypes = {
  className: propTypes.string,
  errorType: propTypes.oneOf([
    'OFFLINE',
    'CHUNK_LOADING',
    'RUNTIME',
  ]),
};

ErrorBoundaryFallback.defaultProps = {
  className: '',
  errorType: 'RUNTIME',
};

/**
 * @param {Object} props
 * @param {'OFFLINE'|'CHUNK_LOADING'|'RUNTIME'} props.errorType
 * */
function ErrorBoundaryFallback(props) {
  const {
    className,
    errorType,
  } = props;
  const {
    errorsOfflineTitle,
    errorsOfflineMessage,
    errorsChunksTitle,
    errorsChunksMessages,
    errorsDefaultTitle,
    errorsReload,
  } = useT9ns({
    errorsOfflineTitle: 'errors.offline.title',
    errorsOfflineMessage: 'errors.offline.message',
    errorsChunksTitle: 'errors.chunks.title',
    errorsChunksMessages: 'errors.chunks.messages',
    errorsDefaultTitle: 'errors.default.title',
    errorsReload: 'errors.reload',
  });

  const {
    title,
    message,
  } = useMemo(() => {
    switch (errorType) {
      case 'OFFLINE':
        return {
          title: errorsOfflineTitle,
          message: errorsOfflineMessage,
        };
      case 'CHUNK_LOADING':
        return {
          title: errorsChunksTitle,
          message: errorsChunksMessages,
        };
      case 'RUNTIME':
      default:
        return {
          title: errorsDefaultTitle,
          message: '',
        };
    }
  }, [
    errorType,
    errorsOfflineTitle,
    errorsOfflineMessage,
    errorsChunksTitle,
    errorsChunksMessages,
    errorsDefaultTitle,
  ]);

  if (!errorType) {
    return null;
  }
  return (
    <div className={cn(s.fallback, className)}>
      <div className={s.wrapper}>
        {title
        && <h1 className={s.title}>
          {title}
        </h1>}
        {message
        && <p className={s.message}>
          {message}
        </p>}
        <a
          className={cn('link', s.reloadLink)}
          href={window.location.href}
        >
          <span className="btn__wrp">
            <span className="btn__label">
              {errorsReload}
            </span>
          </span>
        </a>
      </div>
    </div>
  );
}

export default ErrorBoundaryFallback;
