import propTypes from 'prop-types';
import cn from 'classnames';
import TransactionOverview from '@/components/transaction/Overview';
import s from './styles.scss';

TransactionStepConfirm.propTypes = {
  className: propTypes.string,
  type: propTypes.string,
  sum: propTypes.number,
  categoryId: propTypes.string,
  comment: propTypes.string,
  expenditures: propTypes.array,
  date: propTypes.string,
  userId: propTypes.string,
};

TransactionStepConfirm.defaultProps = {
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
function TransactionStepConfirm(props) {
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

  return (
    <div className={cn(s.step, className)}>
      <TransactionOverview
        className={s.overview}
        type={type}
        sum={sum}
        categoryId={categoryId}
        comment={comment}
        expenditures={expenditures}
        date={date}
        userId={userId}
      />
    </div>
  );
}

export default TransactionStepConfirm;
