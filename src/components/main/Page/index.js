import { useTitle } from '@/hooks/useTitle';
import { useT9n } from '@/hooks/useI18n';
import MainView from '@/components/main/View';

function MainPage() {
  const pageTitle = useT9n('titles.main');

  useTitle({ title: pageTitle });

  return (
    <MainView />
  );
}

export default MainPage;
