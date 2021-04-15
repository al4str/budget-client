import { useI18nTranslations } from '@/hooks/useI18n';
import { useTitle } from '@/hooks/useTitle';
import BackupsView from '@/components/backups/View';

function BackupsPage() {
  const { pageTitle } = useI18nTranslations({
    pageTitle: 'titles.backups',
  });

  useTitle({ title: pageTitle });

  return (
    <BackupsView />
  );
}

export default BackupsPage;
