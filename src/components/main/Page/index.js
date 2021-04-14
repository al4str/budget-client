import { useTitle } from '@/hooks/useTitle';
import { useT9ns } from '@/hooks/useI18n';
import MainView from '@/components/main/View';

function MainPage() {
  const { pageTitle } = useT9ns({
    pageTitle: 'titles.main',
  });

  useTitle({ title: pageTitle });

  return (
    <MainView />
  );
}

export default MainPage;
