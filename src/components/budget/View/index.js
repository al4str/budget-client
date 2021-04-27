import { useState, useMemo, useCallback, useEffect } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { connectUseHook } from '@/libs/connect';
import { sumFormat } from '@/libs/sum';
import { useMounted } from '@/hooks/useMounted';
import { useI18nTranslations } from '@/hooks/useI18n';
import { useCategories } from '@/hooks/useCategories';
import {
  budgetSetItemValue,
  budgetSetIncome,
  budgetSaveFixedData,
  useBudget,
} from '@/hooks/useBudget';
import FieldLabel from '@/components/ui/fields/Label';
import FieldNumber from '@/components/ui/fields/Number';
import SubmitSticky from '@/components/ui/SubmitSticky';
import Table from '@/components/ui/Table';
import s from './styles.scss';

function useHook() {
  const { items: categories } = useCategories();
  const { ready, income, average, fixed } = useBudget();

  /** @type {Array<BudgetViewItem>} */
  const values = useMemo(() => {
    return categories
      .filter((category) => category.type === 'expense')
      .map((category) => ({
        key: category.id,
        label: category.title,
        average: average.get(category.id) || 0,
        fixed: fixed.get(category.id) || 0,
        categoryId: category.id,
      }));
  }, [
    categories,
    average,
    fixed,
  ]);
  /** @type {number} */
  const sumAverage = useMemo(() => {
    return Array
      .from(average.values())
      .reduce((sum, value) => sum + value, 0);
  }, [
    average,
  ]);
  /** @type {number} */
  const sumFixed = useMemo(() => {
    return Array
      .from(fixed.values())
      .reduce((sum, value) => sum + value, 0);
  }, [
    fixed,
  ]);

  useEffect(() => {
    if (ready && income === 0) {
      budgetSetIncome(sumFixed || sumAverage);
    }
  }, [
    ready,
    sumFixed,
    sumAverage,
    income,
  ]);

  return {
    income,
    values,
    sumAverage,
    sumFixed,
  };
}

/**
 * @typedef {Object} BudgetViewItem
 * @property {string} key
 * @property {string} label
 * @property {number} average
 * @property {number} fixed
 * @property {string} categoryId
 * */

BudgetView.propTypes = {
  income: propTypes.number,
  values: propTypes.array,
  sumAverage: propTypes.number,
  sumFixed: propTypes.number,
  className: propTypes.string,
};

BudgetView.defaultProps = {
  income: 0.00,
  values: [],
  sumAverage: 0.00,
  sumFixed: 0.00,
  className: '',
};

/**
 * @param {Object} props
 * @param {number} props.income
 * @param {Array<BudgetViewItem>} props.values
 * @param {number} props.sumAverage
 * @param {number} props.sumFixed
 * @param {string} props.className
 * */
function BudgetView(props) {
  const {
    income,
    values,
    sumAverage,
    sumFixed,
    className,
  } = props;
  const mountedRef = useMounted();
  const {
    title,
    incomeLabel,
    expensesLabel,
    averageLabel,
    fixedLabel,
    sumLabel,
    saveLabel,
  } = useI18nTranslations({
    title: 'titles.budget',
    incomeLabel: 'month.total.income',
    expensesLabel: 'month.total.expenses',
    averageLabel: 'budget.average',
    fixedLabel: 'budget.fixed',
    sumLabel: 'budget.sum',
    saveLabel: 'forms.actions.save',
  });
  const [pending, setPending] = useState(false);
  const [reason, setReason] = useState('');
  const balance = income - sumFixed;

  /** @type {Array<TableColumn>} */
  const columns = useMemo(() => {
    return [
      {
        name: 'label',
        label: expensesLabel,
        cellClassName: s.cell,
        /** @param {BudgetViewItem} row */
        onRender(row) {
          if (row.key === 'result') {
            return sumLabel;
          }
          return row.label;
        },
      },
      {
        name: 'average',
        label: averageLabel,
        cellClassName: cn(s.cell, s.cellRight),
        /** @param {BudgetViewItem} row */
        onRender(row) {
          return sumFormat(row.average, { sign: 'never' });
        },
      },
      {
        name: 'fixed',
        label: fixedLabel,
        cellClassName: cn(s.cell, s.cellRight),
        /** @param {BudgetViewItem} row */
        onRender(row) {
          if (row.key === 'result') {
            return (
              <span className={cn(
                row.fixed < 0 && s.red,
                row.fixed > 0 && s.green,
              )}>
                {sumFormat(row.fixed)}
              </span>
            );
          }
          return (
            <FieldNumber
              className={s.field}
              placeholder="0,00"
              inputMode="decimal"
              min={0}
              max={999999999.99}
              step={100}
              value={row.fixed}
              onChange={(value) => {
                budgetSetItemValue(row.categoryId, value);
              }}
            />
          );
        },
      },
    ];
  }, [
    expensesLabel,
    averageLabel,
    sumLabel,
    fixedLabel,
  ]);
  /** @type {Array<TableRow>} */
  const rows = useMemo(() => {
    return values.concat([{
      key: 'result',
      label: '',
      average: sumAverage,
      fixed: balance,
      categoryId: '',
    }]);
  }, [
    values,
    sumAverage,
    balance,
  ]);

  const handleSave = useCallback(async () => {
    setPending(true);
    setReason('');
    const response = await budgetSaveFixedData();
    const { status, body } = response;
    if (status === 'success' && mountedRef.current) {
      if (!body.ok) {
        setReason(body.reason);
      }
      setPending(false);
    }
  }, [
    mountedRef,
  ]);

  return (
    <div className={cn(s.content, className)}>
      <h1 className={s.title}>
        {title}
      </h1>
      <FieldLabel
        className={s.fieldWrp}
        label={incomeLabel}
      >
        <FieldNumber
          placeholder="0,00"
          inputMode="decimal"
          min={0}
          max={999999999.99}
          step={1000}
          maxLength={14}
          value={income}
          onChange={budgetSetIncome}
        />
      </FieldLabel>
      <Table
        className={s.table}
        columns={columns}
        rows={rows}
      />
      {reason.length > 0
      && <p className={s.reason}>
        {reason}
      </p>}
      <SubmitSticky
        className={s.submit}
        pending={pending}
        shown={true}
        disabled={balance < 0}
        type="button"
        label={saveLabel}
        onClick={handleSave}
      />
    </div>
  );
}

export default connectUseHook(useHook)(BudgetView);
