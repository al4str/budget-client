import { useState, useMemo, useCallback, Fragment } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { idGet } from '@/libs/id';
import { dateGetNow } from '@/libs/date';
import { sumInvalid } from '@/libs/sum';
import { ROUTES } from '@/helpers/routes';
import { historyPush } from '@/libs/navigationManager';
import { useMounted } from '@/hooks/useMounted';
import { useI18nTranslations } from '@/hooks/useI18n';
import { useProfile } from '@/hooks/useProfile';
import { expendituresCreateItem } from '@/hooks/useExpenditures';
import { transactionsCreateItem } from '@/hooks/useTransactions';
import SubmitSticky from '@/components/ui/SubmitSticky';
import Overlay from '@/components/overlays/Overlay';
import OverlayHeader from '@/components/overlays/Header';
import OverlayBody from '@/components/overlays/Body';
import TransactionStepSum from '@/components/transaction/StepSum';
import TransactionStepCategory from '@/components/transaction/StepCategory';
import TransactionStepCommodities from '@/components/transaction/StepCommodities';
import TransactionStepDate from '@/components/transaction/StepDate';
import TransactionStepUsers from '@/components/transaction/StepUser';
import TransactionStepConfirm from '@/components/transaction/StepConfirm';
import s from './styles.scss';

/** @type {Record<TransactionStep>} */
const STEP = {
  SUM: 'SUM',
  CATEGORY: 'CATEGORY',
  COMMODITIES: 'COMMODITIES',
  DATE: 'DATE',
  USER: 'USER',
  CONFIRM: 'CONFIRM',
};

/**
 * @typedef {'SUM'|'CATEGORY'|'COMMODITIES'|'DATE'
 * |'USER'|'CONFIRM'} TransactionStep
 * */

/** @type {TransactionSteps} */
const STEPS = [
  STEP.SUM,
  STEP.CATEGORY,
  STEP.COMMODITIES,
  STEP.DATE,
  STEP.USER,
  STEP.CONFIRM,
];

/**
 * @typedef {Array<TransactionStep>} TransactionSteps
 * */

TransactionOverlay.propTypes = {
  type: propTypes.oneOf([
    'income',
    'expense',
  ]),
};

TransactionOverlay.defaultProps = {
  type: 'expense',
};

/**
 * @param {Object} props
 * @param {TransactionType} props.type
 * */
function TransactionOverlay(props) {
  const { type } = props;
  const {
    overlayTitleIncome,
    overlayTitleExpense,
    stepTitleSum,
    stepTitleCategory,
    stepTitleCommodities,
    stepTitleDate,
    stepTitleUser,
    stepTitleConfirm,
    actionNext,
    actionConfirm,
  } = useI18nTranslations({
    overlayTitleIncome: 'titles.transaction-income',
    overlayTitleExpense: 'titles.transaction-expense',
    stepTitleSum: 'transaction.titles.sum',
    stepTitleCategory: 'transaction.titles.category',
    stepTitleCommodities: 'transaction.titles.commodities',
    stepTitleDate: 'transaction.titles.date',
    stepTitleUser: 'transaction.titles.user',
    stepTitleConfirm: 'transaction.titles.confirm',
    actionNext: 'forms.actions.next',
    actionConfirm: 'forms.actions.confirm',
  });
  const mountedRef = useMounted();
  const { data: { id: profileId } } = useProfile();
  const [pending, setPending] = useState(false);
  const [reason, setReason] = useState('');
  const [step, setStep] = useState(STEP.SUM);
  const [sum, setSum] = useState(0.00);
  const [categoryId, setCategoryId] = useState('');
  const [comment, setComment] = useState('');
  const [expenditures, setExpenditures] = useState([]);
  const [date, setDate] = useState(dateGetNow().toISODate());
  const [userId, setUserId] = useState(profileId);

  /** @type {boolean} */
  const stepInvalid = useMemo(() => {
    switch (step) {
      case STEP.SUM:
        return sumInvalid(sum) || sum === 0;
      case STEP.CATEGORY:
        return !categoryId;
      case STEP.COMMODITIES:
        return !comment && !expenditures.length;
      case STEP.DATE:
        return !date;
      case STEP.USER:
        return !userId;
      case STEP.CONFIRM:
        return (sumInvalid(sum) || sum === 0)
          || !categoryId
          || (!comment && !expenditures.length)
          || !date
          || !userId;
      default:
        return true;
    }
  }, [
    step,
    sum,
    categoryId,
    expenditures,
    comment,
    date,
    userId,
  ]);
  const overlayTitle = useMemo(() => {
    if (type === 'income') {
      return overlayTitleIncome;
    }
    return overlayTitleExpense;
  }, [
    type,
    overlayTitleIncome,
    overlayTitleExpense,
  ]);
  const stepTitle = useMemo(() => {
    switch (step) {
      case STEP.SUM:
        return stepTitleSum;
      case STEP.CATEGORY:
        return stepTitleCategory;
      case STEP.COMMODITIES:
        return stepTitleCommodities;
      case STEP.DATE:
        return stepTitleDate;
      case STEP.USER:
        return stepTitleUser;
      case STEP.CONFIRM:
        return stepTitleConfirm;
      default:
        return '';
    }
  }, [
    step,
    stepTitleSum,
    stepTitleCategory,
    stepTitleCommodities,
    stepTitleDate,
    stepTitleUser,
    stepTitleConfirm,
  ]);
  /** @type {Array<{ key: string, filled: boolean, current: boolean }>} */
  const stepsDots = useMemo(() => {
    const currentIndex = STEPS.indexOf(step);

    return STEPS.map((item) => ({
      key: item,
      filled: STEPS.indexOf(item) < currentIndex,
      current: item === step,
    }));
  }, [
    step,
  ]);

  const handleClose = useCallback(() => {
    historyPush(ROUTES.main);
  }, []);
  const handleBack = useCallback(() => {
    const currentIndex = STEPS.indexOf(step);
    const nextIndex = Math.max(0, currentIndex - 1);
    const nextStep = STEPS[nextIndex];
    if (nextStep) {
      setStep(nextStep);
    }
  }, [
    step,
  ]);
  const handleNext = useCallback(() => {
    const currentIndex = STEPS.indexOf(step);
    const nextIndex = Math.min(currentIndex + 1, STEPS.length - 1);
    const nextStep = STEPS[nextIndex];
    if (nextStep) {
      setStep(nextStep);
    }
  }, [
    step,
  ]);
  const handleConfirm = useCallback(async () => {
    setPending(true);
    setReason('');
    const { body } = await transactionsCreateItem({
      payload: {
        id: idGet(),
        sum,
        categoryId,
        comment,
        date,
        userId,
      },
    });
    if (body.ok) {
      const createdId = body.data.id;
      await Promise.all(expenditures.map((expenditure) => {
        return expendituresCreateItem({
          payload: {
            id: expenditure.id,
            expenseId: createdId,
            commodityId: expenditure.commodityId,
            amount: expenditure.amount,
            essential: expenditure.essential,
          },
        });
      }));
    }
    if (mountedRef.current) {
      if (!body.ok) {
        setReason(body.reason);
      }
      else {
        handleClose();
      }
      setPending(false);
    }
  }, [
    mountedRef,
    sum,
    categoryId,
    comment,
    expenditures,
    date,
    userId,
    handleClose,
  ]);

  return (
    <Overlay opened={true}>
      <OverlayHeader
        title={overlayTitle}
        onBack={step === STEP.SUM
          ? null
          : handleBack}
        onClose={handleClose}
      />
      <OverlayBody className={s.body}>
        <ul className={s.stepsDots}>
          {stepsDots.map((dot, index) => (
            <Fragment key={dot.key}>
              {index > 0
              && <li className={s.stepsLine} />}
              <li className={s.stepsDot}>
                <span className={cn(
                  s.dot,
                  dot.filled && s.dotFilled,
                  dot.current && s.dotCurrent,
                )} />
              </li>
            </Fragment>
          ))}
        </ul>
        <p className={s.title}>
          {stepTitle}
        </p>
        {step === STEP.SUM
        && <TransactionStepSum
          className={cn(s.step, s.stepSum)}
          categoryType={type}
          sum={sum}
          onSumChange={setSum}
        />}
        {step === STEP.CATEGORY
        && <TransactionStepCategory
          className={cn(s.step, s.stepCategory)}
          categoryType={type}
          categoryId={categoryId}
          onCategoryIdChange={setCategoryId}
        />}
        {step === STEP.COMMODITIES
        && <TransactionStepCommodities
          className={cn(s.step, s.stepCommodities)}
          categoryId={categoryId}
          comment={comment}
          expenditures={expenditures}
          onCommentChange={setComment}
          onExpendituresChange={setExpenditures}
        />}
        {step === STEP.DATE
        && <TransactionStepDate
          className={cn(s.step, s.stepDate)}
          date={date}
          onDateChange={setDate}
        />}
        {step === STEP.USER
        && <TransactionStepUsers
          className={cn(s.step, s.stepUsers)}
          userId={userId}
          onUserIdChange={setUserId}
        />}
        {step === STEP.CONFIRM
        && <TransactionStepConfirm
          className={cn(s.step, s.stepConfirm)}
          categoryType={type}
          sum={sum}
          categoryId={categoryId}
          comment={comment}
          expenditures={expenditures}
          date={date}
          userId={userId}
        />}
        {reason.length > 0
        && <p className={s.reason}>
          {reason}
        </p>}
        <SubmitSticky
          className={s.submit}
          pending={pending}
          shown={!stepInvalid}
          disabled={stepInvalid}
          type="button"
          label={step === STEP.CONFIRM
            ? actionConfirm
            : actionNext}
          onClick={step === STEP.CONFIRM
            ? handleConfirm
            : handleNext}
        />
      </OverlayBody>
    </Overlay>
  );
}

export default TransactionOverlay;
