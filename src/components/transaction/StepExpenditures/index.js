import { useMemo, useCallback } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { useI18nTranslations } from '@/hooks/useI18n';
import IconEdit from '@/components/icons/IconEdit';
import IconDelete from '@/components/icons/IconDelete';
import Action from '@/components/ui/Action';
import common from '@/styles/common.scss';
import btn from '@/styles/button.scss';
import s from './styles.scss';

TransactionExpenditures.propTypes = {
  className: propTypes.string,
  commodities: propTypes.array,
  expenditures: propTypes.array,
  onEdit: propTypes.func,
  onDelete: propTypes.func,
};

TransactionExpenditures.defaultProps = {
  className: '',
  commodities: [],
  expenditures: [],
  onEdit: null,
  onDelete: null,
};

/**
 * @param {Object} props
 * @param {string} props.className
 * @param {Array<CommodityItem>} props.commodities
 * @param {Array<ExpenditureItem>} props.expenditures
 * @param {function(ExpenditureItem
 *   & { title: string }): void} props.onEdit
 * @param {function(string): void} props.onDelete
 * */
function TransactionExpenditures(props) {
  const {
    className,
    commodities,
    expenditures,
    onEdit,
    onDelete,
  } = props;
  const {
    essentialYes,
    essentialNo,
  } = useI18nTranslations({
    essentialYes: 'expenditures.essential.yes',
    essentialNo: 'expenditures.essential.no',
  });

  /** @type {function(string): string} */
  const getCommodityTitle = useCallback((commodityId) => {
    const { title } = commodities.find((commodity) => commodity.id === commodityId)
      || { title: '' };

    return title;
  }, [
    commodities,
  ]);

  /** @type {Array<{
   * key: string
   * title: string
   * amount: number
   * essential: boolean
   * onEdit: Function
   * onDelete: Function
  }>} */
  const items = useMemo(() => {
    return expenditures.map((expenditure) => {
      const title = getCommodityTitle(expenditure.commodityId);

      return {
        key: expenditure.id,
        title,
        amount: expenditure.amount,
        essential: expenditure.essential,
        onEdit: onEdit.bind(null, {
          ...expenditure,
          title,
        }),
        onDelete: onDelete.bind(null, expenditure.id),
      };
    });
  }, [
    expenditures,
    onEdit,
    onDelete,
    getCommodityTitle,
  ]);

  return (
    <div className={cn(s.expenditures, className)}>
      <ul className={s.list}>
        {items.map((item) => (
          <li
            className={s.item}
            key={item.key}
          >
            <span className={cn(s.title, common.multiline)}>
              {item.title}
            </span>
            <span className={s.amount}>
              x{item.amount}
            </span>
            <span className={s.essential}>
              {item.essential ? essentialYes : essentialNo}
            </span>
            <Action
              className={cn(s.action, s.edit)}
              onClick={item.onEdit}
            >
              <span className={btn.wrp}>
                <IconEdit className={btn.icon} />
              </span>
            </Action>
            <Action
              className={cn(s.action, s.delete)}
              onClick={item.onDelete}
            >
              <span className={btn.wrp}>
                <IconDelete className={btn.icon} />
              </span>
            </Action>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransactionExpenditures;
