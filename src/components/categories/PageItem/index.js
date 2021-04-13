import { useState, useCallback, useEffect } from 'react';
import { ROUTES } from '@/helpers/routes';
import { useTitle } from '@/hooks/useTitle';
import { useT9n } from '@/hooks/useI18n';
import {
  categoriesFetchItem,
  categoriesUpdateItem,
  categoriesRemoveItem,
  useCategories,
} from '@/hooks/useCategories';
import Anchor from '@/components/ui/Anchor';
import Action from '@/components/ui/Action';
import FieldText from '@/components/ui/fields/Text';
import FieldSelect from '@/components/ui/fields/Select';

// eslint-disable-next-line react/prop-types
function CategoriesPageItem({ match: { params: { id } } }) {
  const pageTitle = useT9n('titles.category');
  const { items } = useCategories();
  const category = items.find((item) => item.id === id);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('expense');

  useTitle({ title: pageTitle });

  const handleUpdate = useCallback(async () => {
    if (!id || !title || !type) {
      return;
    }
    const payload = {
      title,
      type,
    };
    setError('');
    const response = await categoriesUpdateItem({
      id,
      payload,
    });
    if (!response.body.ok) {
      setError(response.body.reason);
    }
  }, [
    id,
    title,
    type,
  ]);
  const handleRemove = useCallback(async () => {
    if (category.id) {
      await categoriesRemoveItem({ id: category.id });
    }
  }, [
    category,
  ]);

  useEffect(() => {
    if (id) {
      categoriesFetchItem({ id }).then().catch();
    }
  }, [
    id,
  ]);
  useEffect(() => {
    if (category) {
      setTitle(category.title);
      setType(category.type);
    }
  }, [
    category,
  ]);

  return (
    <div>
      <p>
        <Anchor
          type="link"
          to={ROUTES.categories}
        >
          Back to the list
        </Anchor>
      </p>
      <pre>{JSON.stringify(category, null, 2)}</pre>
      <div>
        <div>
          <FieldText
            placeholder="title"
            value={title}
            onChange={setTitle}
          />
        </div>
        <div>
          <FieldSelect
            placeholder="type"
            values={[
              {
                key: 'income',
                label: 'Income',
                value: 'income',
              },
              {
                key: 'expense',
                label: 'expense',
                value: 'expense',
              },
            ]}
            value={type}
            onChange={setType}
          />
        </div>
        <Action
          onClick={handleUpdate}
        >
          Update
        </Action>
      </div>
      <p>
        {error}
      </p>
      <div>
        <Action
          onClick={handleRemove}
        >
          Remove
        </Action>
      </div>
    </div>
  );
}

export default CategoriesPageItem;
