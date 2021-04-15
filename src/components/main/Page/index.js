import { useTitle } from '@/hooks/useTitle';
import { useI18nTranslations } from '@/hooks/useI18n';
import MainView from '@/components/main/View';

function MainPage() {
  const { pageTitle } = useI18nTranslations({
    pageTitle: 'titles.main',
  });

  useTitle({ title: pageTitle });

  return (
    <MainView />
  );
}

export default MainPage;
