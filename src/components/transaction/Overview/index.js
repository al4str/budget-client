import { useMemo } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { sumFormat } from '@/libs/sum';
import { dateGetObjFromISO } from '@/libs/date';
import { useI18nTranslations } from '@/hooks/useI18n';
import { useCategories } from '@/hooks/useCategories';
import { useCommodities } from '@/hooks/useCommodities';
import { useUsers } from '@/hooks/useUsers';
import s from './styles.scss';

TransactionOverview.propTypes = {
  className: propTypes.string,
  type: propTypes.string,
  sum: propTypes.number,
  categoryId: propTypes.string,
  comment: propTypes.string,
  expenditures: propTypes.array,
  date: propTypes.string,
  userId: propTypes.string,
};

TransactionOverview.defaultProps = {
  className: '',
  type: '',
  sum: 0.00,
  categoryId: '',
  comment: '',
  expenditures: [],
  date: '',
  userId: '',
};

/**
 * @param {Object} props
 * @param {string} props.className
 * @param {TransactionType} props.type
 * @param {number} props.sum
 * @param {string} props.categoryId
 * @param {string} props.comment
 * @param {Array<ExpenditureItem>} props.expenditures
 * @param {string} props.date
 * @param {string} props.userId
 * */
function TransactionOverview(props) {
  const {
    className,
    type,
    sum,
    categoryId,
    comment,
    expenditures,
    date,
    userId,
  } = props;
  const isExpense = type === 'expense';
  const {
    stepTitleSum,
    stepTitleCategory,
    stepTitleCommodities,
    stepTitleDate,
    stepTitleUser,
    essentialYes,
    essentialNo,
  } = useI18nTranslations({
    stepTitleSum: 'transaction.titles.sum',
    stepTitleCategory: 'transaction.titles.category',
    stepTitleCommodities: 'transaction.titles.commodities',
    stepTitleDate: 'transaction.titles.date',
    stepTitleUser: 'transaction.titles.user',
    essentialYes: 'expenditures.essential.yes',
    essentialNo: 'expenditures.essential.no',
  });
  const { items: categoriesItems } = useCategories();
  const { items: commoditiesItems } = useCommodities();
  const { items: usersItems } = useUsers();

  /** @type {string} */
  const sumHuman = useMemo(() => {
    return isExpense
      ? sumFormat(-1 * sum, { style: 'currency' })
      : sumFormat(sum, { style: 'currency' });
  }, [
    isExpense,
    sum,
  ]);
  /** @type {string} */
  const categoryTitle = useMemo(() => {
    const { title } = categoriesItems.find((category) => category.id === categoryId)
      || { title: '' };

    return title;
  }, [
    categoryId,
    categoriesItems,
  ]);
  /** @type {string} */
  const expendituresJoined = useMemo(() => {
    return expenditures
      .map((expenditure) => {
        const { title } = commoditiesItems.find((commodity) => commodity.id === expenditure.commodityId)
        || { title: '' };

        return {
          title,
          amount: expenditure.amount,
          essential: expenditure.essential,
        };
      })
      .filter((expenditure) => !!expenditure.title)
      .map((expenditure) => {
        return `${expenditure.title} x${expenditure.amount} ${expenditure.essential ? essentialYes : essentialNo}`;
      })
      .join(', ');
  }, [
    expenditures,
    commoditiesItems,
    essentialYes,
    essentialNo,
  ]);
  /** @type {string} */
  const commoditiesHuman = useMemo(() => {
    if (isExpense) {
      return [comment, expendituresJoined]
        .filter((item) => item.trim().length > 0)
        .join(', ');
    }
    return comment;
  }, [
    isExpense,
    comment,
    expendituresJoined,
  ]);
  /** @type {string} */
  const dateHuman = useMemo(() => {
    return dateGetObjFromISO(date).toFormat('dd.MM.yyyy');
  }, [
    date,
  ]);
  /** @type {string} */
  const userName = useMemo(() => {
    const { name } = usersItems.find((user) => user.id === userId)
    || { name: '' };

    return name;
  }, [
    userId,
    usersItems,
  ]);
  /** @type {Array<{
   * key: string
   * label: string
   * value: string
  }>} */
  const values = useMemo(() => {
    return [
      {
        key: 'sum',
        label: stepTitleSum,
        value: sumHuman,
      },
      {
        key: 'categoryId',
        label: stepTitleCategory,
        value: categoryTitle,
      },
      {
        key: 'commodities',
        label: stepTitleCommodities,
        value: commoditiesHuman,
      },
      {
        key: 'date',
        label: stepTitleDate,
        value: dateHuman,
      },
      {
        key: 'userId',
        label: stepTitleUser,
        value: userName,
      },
    ].filter((item) => item.value.trim().length > 0);
  }, [
    sumHuman,
    categoryTitle,
    commoditiesHuman,
    dateHuman,
    userName,
    stepTitleSum,
    stepTitleCategory,
    stepTitleCommodities,
    stepTitleDate,
    stepTitleUser,
  ]);

  return (
    <div className={cn(s.overview, className)}>
      <ul className={s.list}>
        {values.map((item) => (
          <li
            className={s.item}
            key={item.key}
          >
            <div className={s.itemWrp}>
              <span className={s.itemLabel}>
                {item.label}
              </span>
              <span className={s.itemValue}>
                {item.value}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransactionOverview;
