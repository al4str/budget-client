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
import { incomeCreateItem } from '@/hooks/useIncome';
import { expensesCreateItem } from '@/hooks/useExpenses';
import SubmitSticky from '@/components/ui/SubmitSticky';
import Overlay from '@/components/overlays/Overlay';
import OverlayHeader from '@/components/overlays/Header';
import OverlayBody from '@/components/overlays/Body';
import CreateStepSum from '@/components/create/StepSum';
import CreateStepCategory from '@/components/create/StepCategory';
import CreateStepCommodities from '@/components/create/StepCommodities';
import CreateStepDate from '@/components/create/StepDate';
import CreateStepUsers from '@/components/create/StepUser';
import CreateStepConfirm from '@/components/create/StepConfirm';
import s from './styles.scss';

/** @type {Record<CreateStep>} */
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
 * |'USER'|'CONFIRM'} CreateStep
 * */

/** @type {CreateSteps} */
const STEPS = [
  STEP.SUM,
  STEP.CATEGORY,
  STEP.COMMODITIES,
  STEP.DATE,
  STEP.USER,
  STEP.CONFIRM,
];

/**
 * @typedef {Array<CreateStep>} CreateSteps
 * */

CreateOverlay.propTypes = {
  type: propTypes.oneOf([
    'income',
    'expense',
  ]),
};

CreateOverlay.defaultProps = {
  type: 'expense',
};

/**
 * @param {Object} props
 * @param {CategoryType} props.type
 * */
function CreateOverlay(props) {
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
    overlayTitleIncome: 'titles.create-income',
    overlayTitleExpense: 'titles.create-expense',
    stepTitleSum: 'create.titles.sum',
    stepTitleCategory: 'create.titles.category',
    stepTitleCommodities: 'create.titles.commodities',
    stepTitleDate: 'create.titles.date',
    stepTitleUser: 'create.titles.user',
    stepTitleConfirm: 'create.titles.confirm',
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
    const create = type === 'income'
      ? incomeCreateItem
      : expensesCreateItem;
    const { body } = await create({
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
    type,
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
        && <CreateStepSum
          className={cn(s.step, s.stepSum)}
          categoryType={type}
          sum={sum}
          onSumChange={setSum}
        />}
        {step === STEP.CATEGORY
        && <CreateStepCategory
          className={cn(s.step, s.stepCategory)}
          categoryType={type}
          categoryId={categoryId}
          onCategoryIdChange={setCategoryId}
        />}
        {step === STEP.COMMODITIES
        && <CreateStepCommodities
          className={cn(s.step, s.stepCommodities)}
          categoryId={categoryId}
          comment={comment}
          expenditures={expenditures}
          onCommentChange={setComment}
          onExpendituresChange={setExpenditures}
        />}
        {step === STEP.DATE
        && <CreateStepDate
          className={cn(s.step, s.stepDate)}
          date={date}
          onDateChange={setDate}
        />}
        {step === STEP.USER
        && <CreateStepUsers
          className={cn(s.step, s.stepUsers)}
          userId={userId}
          onUserIdChange={setUserId}
        />}
        {step === STEP.CONFIRM
        && <CreateStepConfirm
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

export default CreateOverlay;
