import { useState, useCallback, useEffect, useMemo } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { idGet } from '@/libs/id';
import { useI18nTranslations } from '@/hooks/useI18n';
import {
  commoditiesFetchList,
  useCommodities,
} from '@/hooks/useCommodities';
import IconAdd from '@/components/icons/IconAdd';
import Action from '@/components/ui/Action';
import FieldLabel from '@/components/ui/fields/Label';
import FieldArea from '@/components/ui/fields/Area';
import CommoditiesOverlayCreate
  from '@/components/commodities/OverlayCreate';
import ExpendituresOverlayAdd
  from '@/components/expenditures/OverlayAdd';
import TransactionExpenditures
  from '@/components/transaction/Expenditures';
import common from '@/styles/common.scss';
import btn from '@/styles/button.scss';
import s from './styles.scss';

TransactionStepCommodities.propTypes = {
  className: propTypes.string,
  type: propTypes.string,
  categoryId: propTypes.string,
  comment: propTypes.string,
  expenditures: propTypes.array,
  onCommentChange: propTypes.func,
  onExpendituresChange: propTypes.func,
};

TransactionStepCommodities.defaultProps = {
  className: '',
  type: '',
  categoryId: '',
  comment: '',
  expenditures: [],
  onCommentChange: null,
  onExpendituresChange: null,
};

/**
 * @param {Object} props
 * @param {string} props.className
 * @param {TransactionType} props.type
 * @param {string} props.categoryId
 * @param {string} props.comment
 * @param {Array<ExpenditureItem>} props.expenditures
 * @param {function(string): void} props.onCommentChange
 * @param {function(function(Array<ExpenditureItem>):
 *   Array<ExpenditureItem>): void} props.onExpendituresChange
 * */
function TransactionStepCommodities(props) {
  const {
    className,
    type,
    categoryId,
    comment,
    expenditures,
    onCommentChange,
    onExpendituresChange,
  } = props;
  const isExpense = type === 'expense';
  const {
    commentLabel,
    commentPlaceholder,
  } = useI18nTranslations({
    commentLabel: 'forms.comment.label',
    commentPlaceholder: 'forms.comment.placeholder',
  });
  const { ready, items } = useCommodities();
  const [commodityOpened, setCommodityOpened] = useState(false);
  const [openedExpenditure, setOpenedExpenditure] = useState(null);

  const handleCommodityOpen = useCallback(() => {
    setCommodityOpened(true);
  }, []);
  const handleCommodityClose = useCallback(() => {
    setCommodityOpened(false);
  }, []);
  /** @type {function(ExpenditureItem & { title: string }): void} */
  const handleExpenditureOpen = useCallback((expenditure) => {
    setOpenedExpenditure(expenditure);
  }, []);
  const handleExpenditureClose = useCallback(() => {
    setOpenedExpenditure(null);
  }, []);
  /** @type {function(CommodityItem): void} */
  const handleCommodityCreate = useCallback((nextCommodity) => {
    setCommodityOpened(false);
    handleExpenditureOpen({
      tempId: idGet(),
      commodityId: nextCommodity.id,
      amount: 1,
      essential: false,
      title: nextCommodity.title,
    });
  }, [
    handleExpenditureOpen,
  ]);
  /** @type {function(ExpenditureItem): void} */
  const handleExpenditureAdd = useCallback((nextExpenditure) => {
    setOpenedExpenditure(null);
    onExpendituresChange((prev) => {
      const exist = prev.findIndex((prevItem) => prevItem.tempId === nextExpenditure.tempId) !== -1;
      if (exist) {
        return prev.map((prevItem) => {
          return prevItem.tempId === nextExpenditure.tempId
            ? nextExpenditure
            : prevItem;
        });
      }
      return prev.concat([nextExpenditure]);
    });
  }, [
    onExpendituresChange,
  ]);
  /** @type {function(string): void} */
  const handleExpenditureDelete = useCallback((expenditureTempId) => {
    onExpendituresChange((prev) => {
      return prev.filter((prevItem) => prevItem.tempId !== expenditureTempId);
    });
  }, [
    onExpendituresChange,
  ]);

  /** @type {Array<string>} */
  const usedCommoditiesIds = useMemo(() => {
    return expenditures.map((expenditure) => expenditure.commodityId);
  }, [
    expenditures,
  ]);
  /** @type {Array<{
   * key: string
   * selected: boolean
   * label: string
   * onSelect: Function
  }>} */
  const commodities = useMemo(() => {
    return items
      .filter((commodity) => commodity.categoryId === categoryId)
      .map((commodity) => ({
        key: commodity.id,
        selected: usedCommoditiesIds.includes(commodity.id),
        label: commodity.title,
        onSelect: () => {
          handleExpenditureOpen({
            tempId: idGet(),
            commodityId: commodity.id,
            amount: 1,
            essential: false,
            title: commodity.title,
          });
        },
      }));
  }, [
    categoryId,
    items,
    usedCommoditiesIds,
    handleExpenditureOpen,
  ]);

  useEffect(() => {
    commoditiesFetchList()
      .then()
      .catch();
  }, []);

  return (
    <div className={cn(s.step, className)}>
      <FieldLabel
        className={s.fieldWrp}
        label={commentLabel}
      >
        <FieldArea
          className={s.area}
          autoHeight={true}
          placeholder={commentPlaceholder}
          value={comment}
          onChange={onCommentChange}
        />
      </FieldLabel>
      {isExpense
      && <ul className={s.list}>
        {commodities.map((item) => (
          <li
            className={s.item}
            key={item.key}
          >
            <Action
              className={cn(s.itemBtn, item.selected && s.itemSelected)}
              disabled={item.selected}
              onClick={item.onSelect}
            >
              <span className={cn(btn.wrp, s.itemWrp)}>
                <span className={cn(btn.label, common.multiline, s.itemLabel)}>
                  {item.label}
                </span>
              </span>
            </Action>
          </li>
        ))}
        {ready
        && <li className={s.item}>
          <Action
            className={cn(s.itemBtn, s.itemCreate)}
            onClick={handleCommodityOpen}
          >
            <span className={cn(btn.wrp, s.itemWrp)}>
              <IconAdd className={cn(btn.icon, s.itemIcon)} />
            </span>
          </Action>
        </li>}
      </ul>}
      <TransactionExpenditures
        className={s.expenditures}
        commodities={items}
        expenditures={expenditures}
        onEdit={handleExpenditureOpen}
        onDelete={handleExpenditureDelete}
      />
      <CommoditiesOverlayCreate
        opened={commodityOpened}
        onClose={handleCommodityClose}
        categoryId={categoryId}
        onCreate={handleCommodityCreate}
      />
      <ExpendituresOverlayAdd
        expenditure={openedExpenditure}
        onClose={handleExpenditureClose}
        onAdd={handleExpenditureAdd}
      />
    </div>
  );
}

export default TransactionStepCommodities;
