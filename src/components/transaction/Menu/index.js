import queries from 'query-string';
import propTypes from 'prop-types';
import cn from 'classnames';
import { ROUTES } from '@/helpers/routes';
import IconAdd from '@/components/icons/IconAdd';
import IconSubtract from '@/components/icons/IconSubtract';
import Anchor from '@/components/ui/Anchor';
import btn from '@/styles/button.scss';
import s from './styles.scss';

TransactionMenu.propTypes = {
  className: propTypes.string,
  date: propTypes.string,
};

TransactionMenu.defaultProps = {
  className: '',
  date: '',
};

/**
 * @param {Object} props
 * @param {string} props.className
 * @param {string} props.date
 * */
function TransactionMenu(props) {
  const {
    className,
    date,
  } = props;
  const dateQuery = queries.stringify({ date });
  const toIncome = `${ROUTES.transactionsCreateIncome}?${dateQuery}`;
  const toExpense = `${ROUTES.transactionsCreateExpense}?${dateQuery}`;

  return (
    <nav className={cn(s.menu, className)}>
      <ul className={s.list}>
        <li className={s.item}>
          <Anchor
            className={cn(s.link, s.income)}
            type="link"
            to={toIncome}
          >
            <span className={btn.wrp}>
              <IconAdd className={cn(btn.icon, s.icon)} />
            </span>
          </Anchor>
        </li>
        <li className={s.item}>
          <Anchor
            className={cn(s.link, s.expense)}
            type="link"
            to={toExpense}
          >
            <span className={btn.wrp}>
              <IconSubtract className={cn(btn.icon, s.icon)} />
            </span>
          </Anchor>
        </li>
      </ul>
    </nav>
  );
}

export default TransactionMenu;
