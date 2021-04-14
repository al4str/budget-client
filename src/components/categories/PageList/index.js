import { useEffect } from 'react';
import { ROUTES } from '@/helpers/routes';
import { useTitle } from '@/hooks/useTitle';
import { useT9ns } from '@/hooks/useI18n';
import { categoriesFetchList, useCategories } from '@/hooks/useCategories';
import Anchor from '@/components/ui/Anchor';

function CategoriesPageList() {
  const { pageTitle } = useT9ns({
    pageTitle: 'titles.categories',
  });
  const { initial, items } = useCategories();

  useTitle({ title: pageTitle });

  useEffect(() => {
    if (initial) {
      categoriesFetchList().then().catch();
    }
  }, [
    initial,
  ]);

  return (
    <div>
      <p>
        <Anchor
          type="link"
          to={ROUTES.categoriesCreate}
        >
          + Create new
        </Anchor>
      </p>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <Anchor
              type="link"
              to={ROUTES.categoriesItem.replace(':id', item.id)}
            >
              {item.id} - {item.title} - {item.type}
            </Anchor>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default CategoriesPageList;
