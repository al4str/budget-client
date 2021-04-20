import { useMemo, useCallback, useEffect } from 'react';
import { sumInvalid } from '@/libs/sum';
import { formsCreate } from '@/helpers/forms';
import { useI18nTranslations } from '@/hooks/useI18n';

const { set, validate, getValues, useForm } = formsCreate({
  values: {
    amount: 0,
    essential: false,
  },
  schema: {
    amount: {
      sumInvalid,
    },
    essential: {},
  },
});

/**
 * @param {Object} params
 * @param {number} params.initialAmount
 * @param {boolean} params.initialEssential
 * @param {Function} params.onAdd
 * */
export function useExpendituresAdd(params) {
  const {
    initialAmount,
    initialEssential,
    onAdd,
  } = params;
  const { errorsInvalidSum } = useI18nTranslations({
    errorsInvalidSum: 'forms.errors.invalid-sum',
  });
  const { anyPending, anyInvalid, anyChanged, fields } = useForm();
  const changed = anyChanged;
  const disabled = anyPending || anyInvalid;

  const messages = useMemo(() => {
    return {
      id: {
        sumInvalid: errorsInvalidSum,
      },
      title: {},
    };
  }, [
    errorsInvalidSum,
  ]);

  const handleAdd = useCallback(() => {
    if (typeof onAdd === 'function') {
      onAdd(getValues());
    }
    set({
      amount: 0,
      essential: false,
    });
  }, [
    onAdd,
  ]);
  /** @type {function(Event): void} */
  const handleValidate = useCallback((e) => {
    e.preventDefault();
    validate();
  }, []);
  /** @type {function(Event): void} */
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    handleAdd();
  }, [
    handleAdd,
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
    if (!sumInvalid(initialAmount)) {
      set({ amount: initialAmount });
    }
  }, [
    initialAmount,
  ]);
  useEffect(() => {
    if (typeof initialEssential !== 'undefined') {
      set({ essential: initialEssential });
    }
  }, [
    initialEssential,
  ]);

  return {
    changed,
    disabled,
    messages,
    fields,
    onSubmit,
  };
}
