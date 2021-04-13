import { useEffect, useMemo } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import {
  usersFetchList,
  useUsers,
} from '@/hooks/useUsers';
import Action from '@/components/ui/Action';
import btn from '@/styles/button.scss';
import s from './styles.scss';

CreateStepUsers.propTypes = {
  className: propTypes.string,
  userId: propTypes.string,
  onUserIdChange: propTypes.func,
};

CreateStepUsers.defaultProps = {
  className: '',
  userId: '',
  onUserIdChange: null,
};

/**
 * @param {Object} props
 * @param {string} props.className
 * @param {string} props.userId
 * @param {function(string): void} props.onUserIdChange
 * */
function CreateStepUsers(props) {
  const {
    className,
    userId,
    onUserIdChange,
  } = props;
  const { items } = useUsers();

  /** @type {Array<{
   * key: string
   * selected: boolean
   * label: string
   * onSelect: Function
  }>} */
  const users = useMemo(() => {
    return items
      .map((item) => ({
        key: item.id,
        selected: item.id === userId,
        label: item.name,
        onSelect: onUserIdChange.bind(null, item.id),
      }));
  }, [
    userId,
    onUserIdChange,
    items,
  ]);

  useEffect(() => {
    usersFetchList()
      .then()
      .catch();
  }, []);

  return (
    <div className={cn(s.step, className)}>
      <ul className={s.list}>
        {users.map((item) => (
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
                <span className={cn(btn.label, s.itemLabel)}>
                  {item.label}
                </span>
              </span>
            </Action>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreateStepUsers;
