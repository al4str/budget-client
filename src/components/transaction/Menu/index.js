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
};

TransactionMenu.defaultProps = {
  className: '',
};

function TransactionMenu(props) {
  const { className } = props;

  return (
    <nav className={cn(s.menu, className)}>
      <ul className={s.list}>
        <li className={s.item}>
          <Anchor
            className={cn(s.link, s.income)}
            type="link"
            to={ROUTES.transactionsCreateIncome}
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
            to={ROUTES.transactionsCreateExpense}
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
