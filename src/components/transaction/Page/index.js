import queries from 'query-string';
import { useMemo, useEffect } from 'react';
import propTypes from 'prop-types';
import { idGet } from '@/libs/id';
import { dateGetNow } from '@/libs/date';
import { connectUseHook } from '@/libs/connect';
import { useSession } from '@/hooks/useSession';
import { useProfile } from '@/hooks/useProfile';
import { transactionsFetchList, useTransactions }
  from '@/hooks/useTransactions';
import TransactionOverlay from '@/components/transaction/Overlay';

/** @param {{
 *    location: {
 *      search: string
 *    }
 *    match: {
 *      params: {
 *        type: TransactionType
 *        id: string
 *      }
 *    }
 * }} props */
function useHook(props) {
  const { location: { search }, match: { params } } = props;
  const {
    type: transactionType,
    id: transactionId,
  } = params;
  const { query } = queries.parseUrl(search);
  const { date = dateGetNow().startOf('month').toISODate() } = query;
  const mode = ['income', 'expense'].includes(params.type)
    ? 'create'
    : 'update';
  const isCreate = mode === 'create';
  const { authed } = useSession();
  const { data: { id: profileId } } = useProfile();
  const {
    initial: transactionsInitial,
    ready: transactionsReady,
    items: transactionsItems,
  } = useTransactions();

  const ready = useMemo(() => {
    if (isCreate) {
      return true;
    }
    return transactionsReady;
  }, [
    isCreate,
    transactionsReady,
  ]);
  const transactionItem = useMemo(() => {
    return transactionsItems.find((transaction) => transaction.id === transactionId);
  }, [
    transactionId,
    transactionsItems,
  ]);
  const type = useMemo(() => {
    if (isCreate) {
      return transactionType;
    }
    if (transactionItem) {
      return transactionItem.type;
    }
    return '';
  }, [
    isCreate,
    transactionType,
    transactionItem,
  ]);
  const id = useMemo(() => {
    if (isCreate) {
      return idGet();
    }
    return transactionId;
  }, [
    isCreate,
    transactionId,
  ]);
  const initialData = useMemo(() => {
    if (isCreate || !transactionItem) {
      return {
        sum: 0.00,
        categoryId: '',
        comment: '',
        expenditures: [],
        date,
        userId: profileId,
      };
    }
    return {
      sum: transactionItem.sum,
      categoryId: transactionItem.categoryId,
      comment: transactionItem.comment,
      expenditures: transactionItem.expenditures,
      date: transactionItem.date,
      userId: transactionItem.userId,
    };
  }, [
    date,
    isCreate,
    profileId,
    transactionItem,
  ]);

  useEffect(() => {
    if (authed && transactionsInitial) {
      transactionsFetchList()
        .then()
        .catch();
    }
  }, [
    authed,
    transactionsInitial,
  ]);

  return {
    ready,
    mode,
    type,
    id,
    initialData,
  };
}

TransactionPage.propTypes = {
  match: propTypes.object,
  ready: propTypes.bool,
  mode: propTypes.string,
  type: propTypes.string,
  id: propTypes.string,
  initialData: propTypes.object,
};

TransactionPage.defaultProps = {
  match: {},
  ready: false,
  mode: '',
  type: '',
  id: '',
  initialData: {
    sum: 0.00,
    categoryId: '',
    comment: '',
    expenditures: [],
    date: '',
    userId: '',
  },
};

/**
 * @param {Object} props
 * @param {boolean} props.ready
 * @param {'create'|'update'} props.mode
 * @param {TransactionType} props.type
 * @param {string} props.id
 * @param {Object} props.initialData
 * @param {number} props.initialData.sum
 * @param {string} props.initialData.categoryId
 * @param {string} props.initialData.comment
 * @param {Array<ExpenditureItem>} props.initialData.expenditures
 * @param {string} props.initialData.date
 * @param {string} props.initialData.userId
 * */
function TransactionPage(props) {
  const {
    ready,
    mode,
    type,
    id,
    initialData,
  } = props;

  return (
    <TransactionOverlay
      ready={ready}
      mode={mode}
      type={type}
      id={id}
      initialSum={initialData.sum}
      initialCategoryId={initialData.categoryId}
      initialComment={initialData.comment}
      initialExpenditures={initialData.expenditures}
      initialDate={initialData.date}
      initialUserId={initialData.userId}
    />
  );
}

export default connectUseHook(useHook)(TransactionPage);
