import { useCallback } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { useT9ns } from '@/hooks/useI18n';
import { useExpendituresAdd }
  from '@/components/expenditures/hooks/add';
import Submit from '@/components/ui/Submit';
import FieldLabel from '@/components/ui/fields/Label';
import FieldText from '@/components/ui/fields/Text';
import FieldCheckbox from '@/components/ui/fields/Checkbox';
import input from '@/styles/input.scss';
import s from './styles.scss';

ExpendituresFormAdd.propTypes = {
  className: propTypes.string,
  initialAmount: propTypes.number,
  initialEssential: propTypes.bool,
  onAdd: propTypes.func,
};

ExpendituresFormAdd.defaultProps = {
  className: '',
  initialAmount: 0,
  initialEssential: false,
  onAdd: null,
};

/**
 * @param {Object} props
 * @param {string} props.className
 * @param {number} props.initialAmount
 * @param {boolean} props.initialEssential
 * @param {Function} props.onAdd
 * */
function ExpendituresFormAdd(props) {
  const {
    className,
    initialAmount,
    initialEssential,
    onAdd,
  } = props;
  const {
    messages,
    fields,
    onSubmit,
  } = useExpendituresAdd({
    initialAmount,
    initialEssential,
    onAdd,
  });
  const {
    amountLabel,
    amountPlaceholder,
    essentialLabel,
    submitLabel,
  } = useT9ns({
    amountLabel: 'forms.amount.label',
    amountPlaceholder: 'forms.amount.placeholder',
    essentialLabel: 'forms.essential.label',
    submitLabel: 'forms.actions.ok',
  });

  /** @type {function(string): void} */
  const handleAmountChange = useCallback((nextAmount) => {
    fields.amount.onChange(parseInt(nextAmount, 10) || 0);
  }, [
    fields.amount,
  ]);

  return (
    <form
      className={cn(s.form, className)}
      onSubmit={onSubmit}
    >
      <FieldLabel
        className={s.fieldWrp}
        failed={fields.amount.failed}
        messages={messages.amount}
        validations={fields.amount.validations}
        label={amountLabel}
      >
        <FieldText
          className={cn(input.default, s.field)}
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          placeholder={amountPlaceholder}
          failed={fields.amount.failed}
          value={fields.amount.value.toString()}
          onChange={handleAmountChange}
        />
      </FieldLabel>
      <FieldLabel
        className={s.fieldWrp}
      >
        <FieldCheckbox
          className={s.checkbox}
          label={essentialLabel}
          value={fields.essential.value}
          onChange={fields.essential.onChange}
        />
      </FieldLabel>
      <div className={s.submitWrp}>
        <Submit
          className={s.submit}
          label={submitLabel}
        />
      </div>
    </form>
  );
}

export default ExpendituresFormAdd;
