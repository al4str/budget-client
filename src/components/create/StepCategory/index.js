import { useState, useCallback, useEffect, useMemo } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import {
  categoriesFetchList,
  useCategories,
} from '@/hooks/useCategories';
import IconAdd from '@/components/icons/IconAdd';
import Action from '@/components/ui/Action';
import CategoriesOverlayCreate
  from '@/components/categories/OverlayCreate';
import common from '@/styles/common.scss';
import btn from '@/styles/button.scss';
import s from './styles.scss';

CreateStepCategory.propTypes = {
  className: propTypes.string,
  categoryType: propTypes.oneOf([
    'income',
    'expense',
  ]),
  categoryId: propTypes.string,
  onCategoryIdChange: propTypes.func,
};

CreateStepCategory.defaultProps = {
  className: '',
  categoryType: 'expense',
  categoryId: '',
  onCategoryIdChange: null,
};

/**
 * @param {Object} props
 * @param {string} props.className
 * @param {CategoryType} props.categoryType
 * @param {string} props.categoryId
 * @param {function(string): void} props.onCategoryIdChange
 * */
function CreateStepCategory(props) {
  const {
    className,
    categoryType,
    categoryId,
    onCategoryIdChange,
  } = props;
  const { ready, items } = useCategories();
  const [opened, setOpened] = useState(false);

  /** @type {Array<{
   * key: string
   * selected: boolean
   * label: string
   * onSelect: null|Function
  }>} */
  const categories = useMemo(() => {
    return items
      .filter((item) => item.type === categoryType)
      .map((item) => ({
        key: item.id,
        selected: item.id === categoryId,
        label: item.title,
        onSelect: onCategoryIdChange.bind(null, item.id),
      }));
  }, [
    categoryType,
    categoryId,
    onCategoryIdChange,
    items,
  ]);

  const handleOpen = useCallback(() => {
    setOpened(true);
  }, []);
  const handleClose = useCallback(() => {
    setOpened(false);
  }, []);
  /** @type {function(CategoryItem): void} */
  const handleCreate = useCallback((nextItem) => {
    onCategoryIdChange(nextItem.id);
  }, [
    onCategoryIdChange,
  ]);

  useEffect(() => {
    categoriesFetchList()
      .then()
      .catch();
  }, []);

  return (
    <div className={cn(s.step, className)}>
      <ul className={s.list}>
        {categories.map((item) => (
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
            onClick={handleOpen}
          >
            <span className={cn(btn.wrp, s.itemWrp)}>
              <IconAdd className={cn(btn.icon, s.itemIcon)} />
            </span>
          </Action>
        </li>}
      </ul>
      <CategoriesOverlayCreate
        opened={opened}
        onClose={handleClose}
        onCreate={handleCreate}
      />
    </div>
  );
}

export default CreateStepCategory;
