import propTypes from 'prop-types';
import cn from 'classnames';
import { useI18nTranslations } from '@/hooks/useI18n';
import { useExpendituresAdd }
  from '@/components/expenditures/FormAdd/useForm';
import SubmitSticky from '@/components/ui/SubmitSticky';
import FieldLabel from '@/components/ui/fields/Label';
import FieldNumber from '@/components/ui/fields/Number';
import FieldCheckbox from '@/components/ui/fields/Checkbox';
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
    amountLabel,
    amountPlaceholder,
    essentialLabel,
    submitLabel,
  } = useI18nTranslations({
    amountLabel: 'forms.amount.label',
    amountPlaceholder: 'forms.amount.placeholder',
    essentialLabel: 'forms.essential.label',
    submitLabel: 'forms.actions.ok',
  });
  const {
    disabled,
    messages,
    fields,
    onSubmit,
  } = useExpendituresAdd({
    initialAmount,
    initialEssential,
    onAdd,
  });

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
        <FieldNumber
          className={s.field}
          inputMode="numeric"
          min={0}
          max={999}
          step={1}
          placeholder={amountPlaceholder}
          failed={fields.amount.failed}
          value={fields.amount.value}
          onChange={fields.amount.onChange}
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
      <SubmitSticky
        className={s.submit}
        shown={true}
        disabled={disabled}
        label={submitLabel}
      />
    </form>
  );
}

export default ExpendituresFormAdd;
