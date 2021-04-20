import { useState, useCallback } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { historyGoBack } from '@/libs/navigationManager';
import { useMounted } from '@/hooks/useMounted';
import { useI18nTranslations } from '@/hooks/useI18n';
import { expendituresRemoveItem } from '@/hooks/useExpenditures';
import { transactionsRemoveItem } from '@/hooks/useTransactions';
import Submit from '@/components/ui/Submit';
import TransactionOverview from '@/components/transaction/Overview';
import s from './styles.scss';

TransactionStepView.propTypes = {
  className: propTypes.string,
  type: propTypes.string,
  id: propTypes.string,
  sum: propTypes.number,
  categoryId: propTypes.string,
  comment: propTypes.string,
  expenditures: propTypes.array,
  date: propTypes.string,
  userId: propTypes.string,
};

TransactionStepView.defaultProps = {
  className: '',
  type: '',
  id: '',
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
 * @param {string} props.id
 * @param {number} props.sum
 * @param {string} props.categoryId
 * @param {string} props.comment
 * @param {Array<ExpenditureItem>} props.expenditures
 * @param {string} props.date
 * @param {string} props.userId
 * */
function TransactionStepView(props) {
  const {
    className,
    type,
    id,
    sum,
    categoryId,
    comment,
    expenditures,
    date,
    userId,
  } = props;
  const mountedRef = useMounted();
  const {
    removeLabel,
  } = useI18nTranslations({
    removeLabel: 'forms.actions.remove',
  });
  const [removing, setRemoving] = useState(false);
  const [reason, setReason] = useState('');

  const handleRemove = useCallback(async () => {
    setRemoving(true);
    setReason('');
    const transactionResponse = await transactionsRemoveItem({
      id,
    });
    if (mountedRef.current) {
      if (transactionResponse.status === 'error' || !transactionResponse.body.ok) {
        setReason(transactionResponse.body.reason);
      }
      else {
        await Promise.all(expenditures.map((expenditure) => {
          return expendituresRemoveItem({
            id: expenditure.id,
          });
        }));
      }
      setRemoving(false);
      historyGoBack();
    }
  }, [
    id,
    expenditures,
    mountedRef,
  ]);

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
      {reason.length > 0
      && <p className={s.reason}>
        {reason}
      </p>}
      <div className={s.actions}>
        <Submit
          className={s.removeBtn}
          pending={removing}
          type="button"
          label={removeLabel}
          onClick={handleRemove}
        />
      </div>
    </div>
  );
}

export default TransactionStepView;
