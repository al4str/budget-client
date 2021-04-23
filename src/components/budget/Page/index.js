import { useEffect } from 'react';
import { connectUseHook } from '@/libs/connect';
import { useI18nTranslations } from '@/hooks/useI18n';
import { useTitle } from '@/hooks/useTitle';
import { useSession } from '@/hooks/useSession';
import { budgetFetchAll } from '@/hooks/useBudget';
import BudgetView from '@/components/budget/View';

function useHook() {
  const { authed } = useSession();
  const { pageTitle } = useI18nTranslations({
    pageTitle: 'titles.budget',
  });

  useTitle({ title: pageTitle });

  useEffect(() => {
    if (authed) {
      budgetFetchAll()
        .then()
        .catch();
    }
  }, [
    authed,
  ]);

  return {};
}

function BudgetPage() {
  return (
    <BudgetView />
  );
}

export default connectUseHook(useHook)(BudgetPage);
