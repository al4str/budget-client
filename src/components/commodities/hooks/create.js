import { useState, useMemo, useCallback, useEffect } from 'react';
import { isEmpty } from '@/libs/isEmpty';
import { idInvalid } from '@/libs/id';
import { formsCreate } from '@/helpers/forms';
import { categoriesExist } from '@/helpers/categories';
import { commoditiesExist } from '@/helpers/commodities';
import { useT9n } from '@/hooks/useI18n';
import { useMounted } from '@/hooks/useMounted';
import {
  categoriesFetchList,
  useCategories,
} from '@/hooks/useCategories';
import {
  commoditiesCreateItem,
} from '@/hooks/useCommodities';

const { set, validate, getValues, useForm } = formsCreate({
  values: {
    id: '',
    title: '',
    categoryId: '',
  },
  schema: {
    id: {
      idInvalid,
      alreadyExist,
    },
    title: {
      isEmpty,
    },
    categoryId: {
      doesNotExist,
    },
  },
});

/**
 * @param {Object} params
 * @param {CategoryType} [params.initialCategoryId]
 * @param {Function} params.onCreate
 * */
export function useCommoditiesCreate(params) {
  const {
    initialCategoryId,
    onCreate,
  } = params;
  const mountedRef = useMounted();
  const { items } = useCategories();
  const errorsInvalidId = useT9n('forms.errors.invalid-machine-name');
  const errorsAlreadyExist = useT9n('forms.errors.already-exist');
  const errorsEmpty = useT9n('forms.errors.empty');
  const errorsDoesNotExist = useT9n('forms.errors.does-not-exist');
  const [pending, setPending] = useState(false);
  const [reason, setReason] = useState('');
  const { anyPending, anyInvalid, fields } = useForm();

  const categories = useMemo(() => {
    return items.map((item) => ({
      key: item.id,
      label: item.title,
      value: item.id,
    }));
  }, [
    items,
  ]);
  const messages = useMemo(() => {
    return {
      id: {
        idInvalid: errorsInvalidId,
        alreadyExist: errorsAlreadyExist,
      },
      title: {
        isEmpty: errorsEmpty,
      },
      categoryId: {
        doesNotExist: errorsDoesNotExist,
      },
    };
  }, [
    errorsInvalidId,
    errorsAlreadyExist,
    errorsEmpty,
    errorsDoesNotExist,
  ]);

  const handleCreate = useCallback(async () => {
    setPending(true);
    const response = await commoditiesCreateItem({
      payload: getValues(),
    });
    if (mountedRef.current) {
      if (!response.body.ok) {
        setReason(response.body.reason);
      }
      setPending(false);
    }
    if (response.body.ok && typeof onCreate === 'function') {
      onCreate(response.body.data);
      set({
        id: '',
        title: '',
      });
    }
  }, [
    onCreate,
    mountedRef,
  ]);
  /** @type {function(Event): void} */
  const handleValidate = useCallback((e) => {
    e.preventDefault();
    validate();
  }, []);
  /** @type {function(Event): void} */
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    handleCreate().then().catch();
  }, [
    handleCreate,
  ]);

  const onSubmit = useMemo(() => {
    if (anyPending || anyInvalid) {
      return handleValidate;
    }
    return handleSubmit;
  }, [
    anyPending,
    anyInvalid,
    handleValidate,
    handleSubmit,
  ]);

  useEffect(() => {
    if (initialCategoryId) {
      categoriesExist({ id: initialCategoryId })
        .then((response) => {
          if (response.body.data) {
            set({ categoryId: initialCategoryId });
          }
        })
        .catch();
    }
  }, [
    initialCategoryId,
  ]);
  useEffect(() => {
    categoriesFetchList()
      .then()
      .catch();
  }, []);

  return {
    pending,
    reason,
    categories,
    messages,
    fields,
    onSubmit,
  };
}

/**
 * @param {string} value
 * @return {Promise<boolean>}
 * */
async function alreadyExist(value) {
  if (!value) {
    return false;
  }
  const response = await commoditiesExist({ id: value });
  return response.body.data;
}

/**
 * @param {string} value
 * @return {Promise<boolean>}
 * */
async function doesNotExist(value) {
  if (!value) {
    return false;
  }
  const response = await categoriesExist({ id: value });
  return !response.body.data;
}
