import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  Fragment,
} from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { sumInvalid } from '@/libs/sum';
import { ROUTES } from '@/helpers/routes';
import { historyPush } from '@/libs/navigationManager';
import { useMounted } from '@/hooks/useMounted';
import { useI18nTranslations } from '@/hooks/useI18n';
import {
  transactionsCreateItem,
  transactionsUpdateItem,
} from '@/hooks/useTransactions';
import SubmitSticky from '@/components/ui/SubmitSticky';
import Overlay from '@/components/overlays/Overlay';
import OverlayHeader from '@/components/overlays/Header';
import OverlayBody from '@/components/overlays/Body';
import TransactionStepView from '@/components/transaction/StepView';
import TransactionStepSum from '@/components/transaction/StepSum';
import TransactionStepCategory from '@/components/transaction/StepCategory';
import TransactionStepCommodities from '@/components/transaction/StepCommodities';
import TransactionStepDate from '@/components/transaction/StepDate';
import TransactionStepUsers from '@/components/transaction/StepUser';
import TransactionStepConfirm from '@/components/transaction/StepConfirm';
import s from './styles.scss';

/** @type {Record<TransactionStep>} */
const STEP = {
  VIEW: 'VIEW',
  SUM: 'SUM',
  CATEGORY: 'CATEGORY',
  COMMODITIES: 'COMMODITIES',
  DATE: 'DATE',
  USER: 'USER',
  CONFIRM: 'CONFIRM',
};

/**
 * @typedef {'VIEW'|'SUM'|'CATEGORY'|'COMMODITIES'|'DATE'
 * |'USER'|'CONFIRM'} TransactionStep
 * */

/**
 * @typedef {Array<TransactionStep>} TransactionSteps
 * */

TransactionOverlay.propTypes = {
  ready: propTypes.bool,
  mode: propTypes.string,
  type: propTypes.string,
  id: propTypes.string,
  initialSum: propTypes.number,
  initialCategoryId: propTypes.string,
  initialComment: propTypes.string,
  initialExpenditures: propTypes.array,
  initialDate: propTypes.string,
  initialUserId: propTypes.string,
};

TransactionOverlay.defaultProps = {
  ready: false,
  mode: '',
  type: '',
  id: '',
  initialSum: 0.00,
  initialCategoryId: '',
  initialComment: '',
  initialExpenditures: [],
  initialDate: '',
  initialUserId: '',
};

/**
 * @param {Object} props
 * @param {boolean} props.ready
 * @param {'create'|'update'} props.mode
 * @param {TransactionType} props.type
 * @param {string} props.id
 * @param {number} props.initialSum
 * @param {string} props.initialCategoryId
 * @param {string} props.initialComment
 * @param {Array<ExpenditureItem>} props.initialExpenditures
 * @param {string} props.initialDate
 * @param {string} props.initialUserId
 * */
function TransactionOverlay(props) {
  const {
    ready,
    mode,
    type,
    id,
    initialSum,
    initialCategoryId,
    initialComment,
    initialExpenditures,
    initialDate,
    initialUserId,
  } = props;
  const isCreate = mode === 'create';
  const isExpense = type === 'expense';
  const {
    overlayTitleIncome,
    overlayTitleExpense,
    stepTitleView,
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
    stepTitleView: 'transaction.titles.view',
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
  const [saving, setSaving] = useState(false);
  const [reason, setReason] = useState('');
  const [step, setStep] = useState(isCreate ? STEP.SUM : STEP.VIEW);
  const [sum, setSum] = useState(initialSum);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [comment, setComment] = useState(initialComment);
  const [expenditures, setExpenditures] = useState(initialExpenditures);
  const [date, setDate] = useState(initialDate);
  const [userId, setUserId] = useState(initialUserId);

  /** @type {TransactionSteps} */
  const steps = useMemo(() => {
    if (isCreate) {
      return [
        STEP.SUM,
        STEP.CATEGORY,
        STEP.COMMODITIES,
        STEP.DATE,
        STEP.USER,
        STEP.CONFIRM,
      ];
    }
    return [
      STEP.VIEW,
      STEP.SUM,
      STEP.CATEGORY,
      STEP.COMMODITIES,
      STEP.DATE,
      STEP.USER,
      STEP.CONFIRM,
    ];
  }, [
    isCreate,
  ]);
  /** @type {boolean} */
  const stepInvalid = useMemo(() => {
    switch (step) {
      case STEP.VIEW:
        return false;
      case STEP.SUM:
        return sumInvalid(sum) || sum === 0;
      case STEP.CATEGORY:
        return !categoryId;
      case STEP.COMMODITIES:
        return false;
      case STEP.DATE:
        return !date;
      case STEP.USER:
        return !userId;
      case STEP.CONFIRM:
        return (sumInvalid(sum) || sum === 0)
          || !categoryId
          || !date
          || !userId;
      default:
        return true;
    }
  }, [
    step,
    sum,
    categoryId,
    date,
    userId,
  ]);
  /** @type {string} */
  const overlayTitle = useMemo(() => {
    if (isExpense) {
      return overlayTitleExpense;
    }
    return overlayTitleIncome;
  }, [
    isExpense,
    overlayTitleIncome,
    overlayTitleExpense,
  ]);
  const stepTitle = useMemo(() => {
    switch (step) {
      case STEP.VIEW:
        return stepTitleView;
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
    stepTitleView,
    stepTitleSum,
    stepTitleCategory,
    stepTitleCommodities,
    stepTitleDate,
    stepTitleUser,
    stepTitleConfirm,
  ]);
  /** @type {Array<{ key: string, filled: boolean, current: boolean }>} */
  const stepsDots = useMemo(() => {
    const currentIndex = steps.indexOf(step);

    return steps.map((item) => ({
      key: item,
      filled: steps.indexOf(item) < currentIndex,
      current: item === step,
    }));
  }, [
    step,
    steps,
  ]);

  const handleClose = useCallback(() => {
    historyPush(ROUTES.main);
  }, []);
  const handleBack = useCallback(() => {
    const currentIndex = steps.indexOf(step);
    const nextIndex = Math.max(0, currentIndex - 1);
    const nextStep = steps[nextIndex];
    if (nextStep) {
      setStep(nextStep);
    }
  }, [
    step,
    steps,
  ]);
  const handleNext = useCallback(() => {
    const currentIndex = steps.indexOf(step);
    const nextIndex = Math.min(currentIndex + 1, steps.length - 1);
    const nextStep = steps[nextIndex];
    if (nextStep) {
      setStep(nextStep);
    }
  }, [
    step,
    steps,
  ]);
  const handleConfirm = useCallback(async () => {
    setSaving(true);
    setReason('');
    const method = isCreate
      ? transactionsCreateItem
      : transactionsUpdateItem;
    const expendituresItems = expenditures.map((item) => ({
      commodityId: item.commodityId,
      amount: item.amount,
      essential: item.essential,
    }));
    const payload = isCreate
      ? {
        payload: {
          id,
          type,
          sum,
          categoryId,
          comment,
          expenditures: expendituresItems,
          date,
          userId,
        },
      }
      : {
        id,
        payload: {
          type,
          sum,
          categoryId,
          comment,
          expenditures: expendituresItems,
          date,
          userId,
        },
      };
    const { body } = await method(payload);
    if (mountedRef.current) {
      if (!body.ok) {
        setReason(body.reason);
      }
      else {
        handleClose();
      }
      setSaving(false);
    }
  }, [
    id,
    type,
    isCreate,
    mountedRef,
    sum,
    categoryId,
    comment,
    expenditures,
    date,
    userId,
    handleClose,
  ]);

  useEffect(() => {
    if (ready) {
      setSum(initialSum);
      setCategoryId(initialCategoryId);
      setComment(initialComment);
      setExpenditures(initialExpenditures);
      setDate(initialDate);
      setUserId(initialUserId);
    }
  }, [
    ready,
    initialSum,
    initialCategoryId,
    initialComment,
    initialExpenditures,
    initialDate,
    initialUserId,
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
        {step === STEP.VIEW
        && <TransactionStepView
          className={cn(s.step, s.stepView)}
          type={type}
          id={id}
          sum={sum}
          categoryId={categoryId}
          comment={comment}
          expenditures={expenditures}
          date={date}
          userId={userId}
        />}
        {step === STEP.SUM
        && <TransactionStepSum
          className={cn(s.step, s.stepSum)}
          type={type}
          sum={sum}
          onSumChange={setSum}
        />}
        {step === STEP.CATEGORY
        && <TransactionStepCategory
          className={cn(s.step, s.stepCategory)}
          type={type}
          categoryId={categoryId}
          onCategoryIdChange={setCategoryId}
        />}
        {step === STEP.COMMODITIES
        && <TransactionStepCommodities
          className={cn(s.step, s.stepCommodities)}
          type={type}
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
          type={type}
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
          pending={saving}
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
