import { useMemo } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { connectUseHook } from '@/libs/connect';
import {
  notificationsRemove,
  useNotifications,
} from '@/hooks/useNotifications';
import NotificationsItem from '@/components/notifications/Item';
import s from './styles.scss';

function useHook() {
  const { list } = useNotifications();

  /** @type {Array<NotificationsContainerItem>} */
  const items = useMemo(() => {
    return list.map((item, index) => ({
      ...item,
      countDown: index === 0,
      onRemove: notificationsRemove.bind(null, item.id),
    }));
  }, [
    list,
  ]);

  return {
    items,
  };
}

/**
 * @typedef {NotificationItem & {
 *   countDown: boolean
 *   onRemove: function(string): void
 * }} NotificationsContainerItem
 * */

NotificationsContainer.propTypes = {
  className: propTypes.string,
  items: propTypes.array,
};

NotificationsContainer.defaultProps = {
  className: '',
  items: [],
};

/**
 * @param {Object} props
 * @param {String} props.className
 * @param {Array<NotificationsContainerItem>} props.items
 * */
function NotificationsContainer(props) {
  const {
    className,
    items,
  } = props;
  const hidden = items.length === 0;

  return (
    <div className={cn(s.container, hidden && s.hidden, className)}>
      <ul className={s.list}>
        {items.map((item) => (
          <li
            className={s.item}
            key={item.id}
          >
            <NotificationsItem
              countDown={item.countDown}
              withClose={item.withClose}
              autoClose={item.autoClose}
              type={item.type}
              title={item.title}
              text={item.text}
              renderContent={item.renderContent}
              onRemove={item.onRemove}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default connectUseHook(useHook)(NotificationsContainer);
