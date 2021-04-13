import { useState, useCallback, useEffect } from 'react';
import { ROUTES } from '@/helpers/routes';
import { useTitle } from '@/hooks/useTitle';
import { useT9n } from '@/hooks/useI18n';
import { categoriesExist } from '@/helpers/categories';
import { categoriesCreateItem } from '@/hooks/useCategories';
import Anchor from '@/components/ui/Anchor';
import Action from '@/components/ui/Action';
import FieldText from '@/components/ui/fields/Text';
import FieldSelect from '@/components/ui/fields/Select';

function CategoriesPageCreate() {
  const pageTitle = useT9n('titles.category-create');
  const [category, setCategory] = useState(null);
  const [exist, setExist] = useState(false);
  const [error, setError] = useState('');
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('expense');

  useTitle({ title: pageTitle });

  const handleDoesExist = useCallback(async (nextId) => {
    if (!nextId) {
      return;
    }
    const response = await categoriesExist({ id: nextId });
    setExist(response.body.data);
  }, []);
  const handleCreate = useCallback(async () => {
    if (!id || !title || !type) {
      return;
    }
    const payload = {
      id,
      title,
      type,
    };
    const response = await categoriesCreateItem({ payload });
    if (!response.body.ok) {
      setError(response.body.reason);
    }
    else {
      setCategory(response.body.data);
    }
  }, [
    id,
    title,
    type,
  ]);

  useEffect(() => {
    handleDoesExist(id).then().catch();
  }, [
    id,
    handleDoesExist,
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
      <div>
        <div>
          <FieldText
            placeholder="id"
            value={id}
            onChange={setId}
          />
          <p>{exist ? 'ALREADY EXIST' : ''}</p>
        </div>
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
          onClick={handleCreate}
        >
          Create
        </Action>
      </div>
      <p>
        {error}
      </p>
      <pre>{JSON.stringify(category, null, 2)}</pre>
    </div>
  );
}

export default CategoriesPageCreate;
