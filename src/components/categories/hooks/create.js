import { useState, useMemo, useCallback, useEffect } from 'react';
import { isEmpty } from '@/libs/isEmpty';
import { idInvalid } from '@/libs/id';
import { formsCreate } from '@/helpers/forms';
import { categoriesExist, categoriesInvalidType } from '@/helpers/categories';
import { useT9n } from '@/hooks/useI18n';
import { useMounted } from '@/hooks/useMounted';
import { categoriesCreateItem } from '@/hooks/useCategories';

const { set, validate, getValues, useForm } = formsCreate({
  values: {
    id: '',
    title: '',
    type: '',
  },
  schema: {
    id: {
      isEmpty,
      alreadyExist,
      idInvalid,
    },
    title: {
      isEmpty,
    },
    type: {
      invalidType: categoriesInvalidType,
    },
  },
});

/**
 * @param {Object} params
 * @param {CategoryType} [params.initialType]
 * @param {Function} params.onCreate
 * */
export function useCategoriesCreate(params) {
  const { initialType, onCreate } = params;
  const mountedRef = useMounted();
  const typeIncome = useT9n('categories.type.income');
  const typeExpense = useT9n('categories.type.expense');
  const errorsEmpty = useT9n('forms.errors.empty');
  const errorsExist = useT9n('forms.errors.exist');
  const errorsInvalidId = useT9n('forms.errors.invalid-id');
  const errorsInvalidType = useT9n('forms.errors.invalid-type');
  const [pending, setPending] = useState(false);
  const [reason, setReason] = useState('');
  const { anyPending, anyInvalid, fields } = useForm();

  const types = useMemo(() => {
    return [
      {
        key: 'income',
        label: typeIncome,
        value: 'income',
      },
      {
        key: 'expense',
        label: typeExpense,
        value: 'expense',
      },
    ];
  }, [
    typeIncome,
    typeExpense,
  ]);
  const messages = useMemo(() => {
    return {
      id: {
        idInvalid: errorsInvalidId,
        alreadyExist: errorsExist,
      },
      title: {
        isEmpty: errorsEmpty,
      },
      type: {
        invalidType: errorsInvalidType,
      },
    };
  }, [
    errorsInvalidId,
    errorsExist,
    errorsEmpty,
    errorsInvalidType,
  ]);

  const handleCreate = useCallback(async () => {
    setPending(true);
    const response = await categoriesCreateItem({
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
        type: '',
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
    if (!categoriesInvalidType(initialType)) {
      set({ type: initialType });
    }
  }, [
    initialType,
  ]);

  return {
    pending,
    reason,
    types,
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
  const response = await categoriesExist({ id: value });
  return response.body.data;
}
