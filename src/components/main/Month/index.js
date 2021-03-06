import { useMemo, useCallback, useEffect } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { dateGetObjFromISO } from '@/libs/date';
import { sumFormat } from '@/libs/sum';
import { connectUseHook } from '@/libs/connect';
import { ROUTES } from '@/helpers/routes';
import { usersGetEmptyItem } from '@/helpers/users';
import { categoriesGetEmpty } from '@/helpers/categories';
import { commoditiesGetEmpty } from '@/helpers/commodities';
import { useI18nTranslations } from '@/hooks/useI18n';
import { useSession } from '@/hooks/useSession';
import { useUsers } from '@/hooks/useUsers';
import { useCategories } from '@/hooks/useCategories';
import { useCommodities } from '@/hooks/useCommodities';
import { transactionsFetchList, useTransactions }
  from '@/hooks/useTransactions';
import { useBudget } from '@/hooks/useBudget';
import Table from '@/components/ui/Table';
import Anchor from '@/components/ui/Anchor';
import UsersAvatar from '@/components/users/Avatar';
import links from '@/styles/links.scss';
import s from './styles.scss';

/** @param {{ date: string }} props */
function useHook(props) {
  const { date } = props;
  const {
    incomeLabel,
    expensesLabel,
    restLabel,
    unknownLabel,
    essentialYes,
    essentialNo,
  } = useI18nTranslations({
    incomeLabel: 'month.total.income',
    expensesLabel: 'month.total.expenses',
    restLabel: 'month.total.rest',
    unknownLabel: 'expenditures.unknown',
    essentialYes: 'expenditures.essential.yes',
    essentialNo: 'expenditures.essential.no',
  });
  const { authed } = useSession();
  const { items: usersItems } = useUsers();
  const { items: categoriesItems } = useCategories();
  const { items: commoditiesItems } = useCommodities();
  const { items: transactionsItems } = useTransactions();
  const { fixed: budgetMap } = useBudget();

  /** @type {function(string): UsersItem} */
  const getUserItem = useCallback((userId) => {
    return usersItems.find((user) => user.id === userId)
      || usersGetEmptyItem();
  }, [
    usersItems,
  ]);
  /** @type {function(string): CategoryItem} */
  const getCategoryItem = useCallback((categoryId) => {
    return categoriesItems.find((category) => category.id === categoryId)
      || categoriesGetEmpty();
  }, [
    categoriesItems,
  ]);
  /** @type {function(string): CommodityItem} */
  const getCommodityItem = useCallback((commodityId) => {
    return commoditiesItems.find((commodity) => commodity.id === commodityId)
      || commoditiesGetEmpty();
  }, [
    commoditiesItems,
  ]);

  const currentDateObj = useMemo(() => {
    return dateGetObjFromISO(date);
  }, [
    date,
  ]);
  const currentMonth = useMemo(() => {
    return currentDateObj.toFormat('LLL yyyy');
  }, [
    currentDateObj,
  ]);
  /** @type {Array<TransactionItem>} */
  const monthTransactionItems = useMemo(() => {
    return transactionsItems.filter((item) => {
      return dateGetObjFromISO(item.date)
        .hasSame(currentDateObj, 'month');
    });
  }, [
    transactionsItems,
    currentDateObj,
  ]);
  /** @type {Array<TransactionItem>} */
  const monthIncomeItems = useMemo(() => {
    return monthTransactionItems.filter((item) => {
      const category = getCategoryItem(item.categoryId);

      return category.id && category.type === 'income';
    });
  }, [
    getCategoryItem,
    monthTransactionItems,
  ]);
  /** @type {Array<TransactionItem>} */
  const monthExpenseItems = useMemo(() => {
    return monthTransactionItems.filter((item) => {
      const category = getCategoryItem(item.categoryId);

      return category.id && category.type === 'expense';
    });
  }, [
    getCategoryItem,
    monthTransactionItems,
  ]);
  /** @type {Array<MonthTotalItem>} */
  const totalData = useMemo(() => {
    const income = monthIncomeItems.reduce((result, item) => {
      return result + item.sum;
    }, 0);
    const expenses = monthExpenseItems.reduce((result, item) => {
      return result + item.sum;
    }, 0);
    const rest = income - expenses;

    return [
      {
        type: 'income',
        label: incomeLabel,
        value: income,
      },
      {
        type: 'expenses',
        label: expensesLabel,
        value: -1 * expenses,
      },
      {
        type: 'rest',
        label: restLabel,
        value: rest,
      },
    ];
  }, [
    monthIncomeItems,
    monthExpenseItems,
    incomeLabel,
    expensesLabel,
    restLabel,
  ]);
  /** @type {{
   *   income: Array<MonthByCategoryItem>
   *   expense: Array<MonthByCategoryItem>
  }} */
  const byCategoryData = useMemo(() => {
    /** @type {Map<string, number>} */
    const byCategoryMap = new Map();
    monthTransactionItems.forEach((item) => {
      const prevSum = byCategoryMap.has(item.categoryId)
        ? byCategoryMap.get(item.categoryId)
        : 0;
      const nextSum = prevSum + item.sum;
      byCategoryMap.set(item.categoryId, nextSum);
    });
    /** @type {{
     *   income: Array<MonthByCategoryItem>
     *   expense: Array<MonthByCategoryItem>
    }} */
    const byType = {
      income: [],
      expense: [],
    };

    return categoriesItems.reduce((by, category) => {
      const sum = byCategoryMap.get(category.id) || 0;
      const limit = budgetMap.get(category.id) || 0;
      const percentage = limit > 0
        ? (sum * 100) / limit
        : 0;
      by[category.type].push({
        id: category.id,
        title: category.title,
        sum: category.type === 'income'
          ? sum
          : -1 * sum,
        limit,
        percentage,
      });

      return by;
    }, byType);
  }, [
    categoriesItems,
    budgetMap,
    monthTransactionItems,
  ]);
  const incomeByCategoryData = byCategoryData.income;
  const expensesByCategoryData = byCategoryData.expense;
  /** @type {Array<MonthTransactionsByCategoryItem>} */
  const transactionsData = useMemo(() => {
    /** @type {Map<string, Array<MonthExpenditureItem>>} */
    const byCategoryMap = new Map();
    monthTransactionItems.forEach((item) => {
      const prevItems = byCategoryMap.has(item.categoryId)
        ? byCategoryMap.get(item.categoryId)
        : [];
      const expenditures = item.expenditures.map((expenditure) => {
        const commodity = getCommodityItem(expenditure.commodityId);
        const title = commodity.title;
        const amount = `x${expenditure.amount}`;
        const essential = expenditure.essential
          ? essentialYes
          : essentialNo;

        return `${title} ${amount} ${essential}`;
      });
      const label = [item.comment, ...expenditures]
        .filter((labelItem) => labelItem.trim().length > 0)
        .join(', ');
      const user = getUserItem(item.userId);
      const nextItems = prevItems.concat([{
        id: item.id,
        label: label.trim().length > 0
          ? label
          : unknownLabel,
        sum: item.sum,
        date: item.date,
        userId: user.id,
        userAvatarId: user.avatarId,
      }]);
      byCategoryMap.set(item.categoryId, nextItems);
    });

    return categoriesItems.map((category) => {
      const items = byCategoryMap.get(category.id) || [];

      return {
        id: category.id,
        title: category.title,
        items: category.type === 'income'
          ? items
          : items.map((item) => {
            return {
              ...item,
              sum: -1 * item.sum,
            };
          }),
      };
    });
  }, [
    unknownLabel,
    essentialYes,
    essentialNo,
    categoriesItems,
    getUserItem,
    getCommodityItem,
    monthTransactionItems,
  ]);

  useEffect(() => {
    if (authed && date) {
      transactionsFetchList({ inDateRange: [date, date] })
        .then()
        .catch();
    }
  }, [
    date,
    authed,
  ]);

  return {
    currentMonth,
    totalData,
    incomeByCategoryData,
    expensesByCategoryData,
    transactionsData,
  };
}

MainMonth.propTypes = {
  currentMonth: propTypes.string,
  totalData: propTypes.array,
  incomeByCategoryData: propTypes.array,
  expensesByCategoryData: propTypes.array,
  transactionsData: propTypes.array,
  className: propTypes.string,
  date: propTypes.string,
};

MainMonth.defaultProps = {
  currentMonth: '',
  totalData: [],
  incomeByCategoryData: [],
  expensesByCategoryData: [],
  transactionsData: [],
  className: '',
  date: '',
};

/**
 * @typedef {Object} MonthTotalItem
 * @property {'income'|'expenses'|'rest'} type
 * @property {string} label
 * @property {number} value
 * */

/**
 * @typedef {Object} MonthByCategoryItem
 * @property {string} id
 * @property {string} title
 * @property {number} sum
 * @property {number} limit
 * @property {number} percentage
 * */

/**
 * @typedef {Object} MonthTransactionsByCategoryItem
 * @property {string} id
 * @property {string} title
 * @property {Array<MonthExpenditureItem>} items
 * */

/**
 * @typedef {Object} MonthExpenditureItem
 * @property {string} id
 * @property {string} label
 * @property {number} sum
 * @property {string} date
 * @property {string} userId
 * @property {string} userAvatarId
 * */

/**
 * @param {Object} props
 * @param {string} props.currentMonth
 * @param {Array<MonthTotalItem>} props.totalData
 * @param {Array<MonthByCategoryItem>} props.incomeByCategoryData
 * @param {Array<MonthByCategoryItem>} props.expensesByCategoryData
 * @param {Array<MonthTransactionsByCategoryItem>} props.transactionsData
 * @param {string} props.className
 * @param {string} props.date
 * */
function MainMonth(props) {
  const {
    totalData,
    incomeByCategoryData,
    expensesByCategoryData,
    transactionsData,
    className,
  } = props;
  const {
    totalsCaption,
    incomeCaption,
    expensesCaption,
    dateWhen,
    usersBy,
  } = useI18nTranslations({
    totalsCaption: 'month.total.caption',
    incomeCaption: 'month.total.income',
    expensesCaption: 'month.total.expenses',
    dateWhen: 'month.date.when',
    usersBy: 'month.users.by',
  });

  /** @type {Array<TableColumn>} */
  const totalColumns = useMemo(() => {
    return [
      {
        name: 'labels',
        label: totalsCaption,
        cellClassName: s.cell,
        /** @param {MonthTotalItem} row */
        onRender(row) {
          return row.label;
        },
      },
      {
        name: 'values',
        label: '???',
        cellClassName: cn(s.cell, s.cellRight),
        /** @param {MonthTotalItem} row */
        onRender(row) {
          return (
            <div className={s.sumWrp}>
              <span className={s.sum}>
                {sumFormat(row.value)}
              </span>
            </div>
          );
        },
      },
    ];
  }, [
    totalsCaption,
  ]);
  /** @type {Array<TableRow>} */
  const totalRows = useMemo(() => {
    return totalData.map((item) => ({
      ...item,
      key: item.type,
    }));
  }, [
    totalData,
  ]);
  /** @type {Array<TableColumn>} */
  const incomeByCategoryColumns = useMemo(() => {
    return [
      {
        name: 'labels',
        label: incomeCaption,
        cellClassName: s.cell,
        /** @param {MonthByCategoryItem} row */
        onRender(row) {
          return row.title;
        },
      },
      {
        name: 'values',
        label: '???',
        cellClassName: cn(s.cell, s.cellRight),
        /** @param {MonthByCategoryItem} row */
        onRender(row) {
          return (
            <div className={s.sumWrp}>
              <span className={s.sum}>
                {sumFormat(row.sum)}
              </span>
            </div>
          );
        },
      },
    ];
  }, [
    incomeCaption,
  ]);
  /** @type {Array<TableRow>} */
  const incomeByCategoryRows = useMemo(() => {
    return incomeByCategoryData.map((item) => ({
      ...item,
      key: item.id,
    }));
  }, [
    incomeByCategoryData,
  ]);
  /** @type {Array<TableColumn>} */
  const expensesByCategoryColumns = useMemo(() => {
    return [
      {
        name: 'labels',
        label: expensesCaption,
        cellClassName: s.cell,
        /** @param {MonthByCategoryItem} row */
        onRender(row) {
          return row.title;
        },
      },
      {
        name: 'values',
        label: '???',
        cellClassName: cn(s.cell, s.cellRight),
        /** @param {MonthByCategoryItem} row */
        onRender(row) {
          const sum = sumFormat(row.sum);
          const limit = sumFormat(row.limit, {
            sign: 'never',
          });
          const percentage = sumFormat(row.percentage, {
            sign: 'never',
            fraction: 1,
          });
          const warning = row.percentage > 85;
          const exceeded = Math.abs(row.sum) > row.limit;

          return (
            <div className={s.sumWrp}>
              <span className={cn(
                s.sum,
                exceeded && s.exceeded,
                warning && s.warning,
              )}>
                {sum}
              </span>
              <div className={s.track}>
                <span
                  className={cn(
                    s.progress,
                    exceeded && s.exceeded,
                    warning && s.warning,
                  )}
                  style={{ width: `${row.percentage}%` }}
                />
              </div>
              <div className={s.budget}>
                <span className={cn(
                  s.percentage,
                  exceeded && s.exceeded,
                  warning && s.warning,
                )}>
                  {percentage}%
                </span>
                <span className={s.limit}>
                  {limit}
                </span>
              </div>
            </div>
          );
        },
      },
    ];
  }, [
    expensesCaption,
  ]);
  /** @type {Array<TableRow>} */
  const expensesByCategoryRows = useMemo(() => {
    return expensesByCategoryData.map((item) => ({
      ...item,
      key: item.id,
    }));
  }, [
    expensesByCategoryData,
  ]);
  /** @type {Array<{
   *   key: string
   *   className: string
   *   columns: Array<TableColumn>
   *   rows: Array<TableRow>
  }>} */
  const expendituresTables = useMemo(() => {
    return transactionsData.map((expenditure) => ({
      key: expenditure.id,
      className: cn(expenditure.items.length === 0 && s.tableEmpty),
      columns: [
        {
          name: 'labels',
          label: expenditure.title,
          cellClassName: s.cell,
          /** @param {MonthExpenditureItem} row */
          onRender(row) {
            const url = ROUTES.transactionsItem.replace(':id', row.id);

            return (
              <Anchor
                className={links.link}
                type="link"
                to={url}
              >
                {row.label}
              </Anchor>
            );
          },
        },
        {
          name: 'sum',
          label: '???',
          cellClassName: cn(s.cell, s.cellRight),
          /** @param {MonthExpenditureItem} row */
          onRender(row) {
            return (
              <div className={s.sumWrp}>
                <span className={s.sum}>
                  {sumFormat(row.sum)}
                </span>
              </div>
            );
          },
        },
        {
          name: 'date',
          label: dateWhen,
          cellClassName: cn(s.cell, s.cellRight),
          /** @param {MonthExpenditureItem} row */
          onRender(row) {
            return dateGetObjFromISO(row.date).toFormat('dd.LL');
          },
        },
        {
          name: 'userName',
          label: usersBy,
          cellClassName: cn(s.cell, s.cellAvatar),
          /** @param {MonthExpenditureItem} row */
          onRender(row) {
            return (
              <UsersAvatar
                userId={row.userId}
                avatarId={row.userAvatarId}
                size="16"
              />
            );
          },
        },
      ],
      rows: expenditure.items.map((item) => ({
        ...item,
        key: item.id,
      })),
    }));
  }, [
    transactionsData,
    dateWhen,
    usersBy,
  ]);

  return (
    <div className={cn(s.content, className)}>
      <Table
        className={s.table}
        columns={totalColumns}
        rows={totalRows}
      />
      <Table
        className={s.table}
        columns={incomeByCategoryColumns}
        rows={incomeByCategoryRows}
      />
      <Table
        className={s.table}
        columns={expensesByCategoryColumns}
        rows={expensesByCategoryRows}
      />
      {expendituresTables.map((table) => (
        <Table
          className={cn(s.table, table.className)}
          key={table.key}
          columns={table.columns}
          rows={table.rows}
        />
      ))}
    </div>
  );
}

export default connectUseHook(useHook)(MainMonth);
