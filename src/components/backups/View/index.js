import { useState, useCallback } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { backupsObtainLatest } from '@/helpers/backups';
import { useMounted } from '@/hooks/useMounted';
import { useI18nTranslations } from '@/hooks/useI18n';
import Submit from '@/components/ui/Submit';
import s from './styles.scss';

BackupsView.propTypes = {
  className: propTypes.string,
};

BackupsView.defaultProps = {
  className: '',
};

/**
 * @param {Object} props
 * @param {string} props.className
 * */
function BackupsView(props) {
  const { className } = props;
  const mountedRef = useMounted();
  const {
    title,
    label,
  } = useI18nTranslations({
    title: 'titles.backups',
    label: 'forms.actions.create',
  });
  const [pending, setPending] = useState(false);
  const [reason, setReason] = useState('');

  const handleCreate = useCallback(async () => {
    setPending(true);
    setReason('');
    const response = await backupsObtainLatest();
    const { status, body } = response;
    if (status === 'success' && mountedRef.current) {
      if (!body.ok) {
        setReason(body.reason);
      }
      else {
        const data = body.data;
        const blob = new window.Blob([data], {
          type: 'application/json',
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = window.document.createElement('a');
        anchor.setAttribute('href', url);
        anchor.setAttribute('download', 'backup-latest.json');
        anchor.hidden = true;
        window.document.body.appendChild(anchor);
        anchor.click();
        window.document.body.removeChild(anchor);
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
      }
      setPending(false);
    }
  }, [
    mountedRef,
  ]);

  return (
    <div className={cn(s.content, className)}>
      <h1 className={s.title}>
        {title}
      </h1>
      <div className={s.actions}>
        <Submit
          className={s.action}
          pending={pending}
          type="button"
          label={label}
          onClick={handleCreate}
        />
      </div>
      {reason.length > 0
      && <p className={s.reason}>
        {reason}
      </p>}
    </div>
  );
}

export default BackupsView;
