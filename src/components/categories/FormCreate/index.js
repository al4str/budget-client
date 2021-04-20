import propTypes from 'prop-types';
import cn from 'classnames';
import { useI18nTranslations } from '@/hooks/useI18n';
import SubmitSticky from '@/components/ui/SubmitSticky';
import FieldLabel from '@/components/ui/fields/Label';
import FieldText from '@/components/ui/fields/Text';
import FieldSelect from '@/components/ui/fields/Select';
import input from '@/styles/input.scss';
import { useCategoriesCreate } from './useForm';
import s from './styles.scss';

CategoriesFormCreate.propTypes = {
  className: propTypes.string,
  type: propTypes.string,
  onCreate: propTypes.func,
};

CategoriesFormCreate.defaultProps = {
  className: '',
  type: '',
  onCreate: null,
};

function CategoriesFormCreate(props) {
  const {
    className,
    type,
    onCreate,
  } = props;
  const {
    idLabel,
    idPlaceholder,
    idDesc,
    titleLabel,
    titlePlaceholder,
    typeLabel,
    typePlaceholder,
    createLabel,
  } = useI18nTranslations({
    idLabel: 'forms.id.label',
    idPlaceholder: 'forms.id.placeholder',
    idDesc: 'forms.id.desc',
    titleLabel: 'forms.name.label',
    titlePlaceholder: 'forms.name.placeholder',
    typeLabel: 'forms.type.label',
    typePlaceholder: 'forms.type.placeholder',
    createLabel: 'forms.actions.create',
  });
  const {
    pending,
    changed,
    disabled,
    reason,
    messages,
    types,
    fields,
    onSubmit,
  } = useCategoriesCreate({
    initialType: type,
    onCreate,
  });

  return (
    <form
      className={cn(s.form, className)}
      onSubmit={onSubmit}
    >
      <FieldLabel
        className={s.fieldWrp}
        failed={fields.id.failed}
        messages={messages.id}
        validations={fields.id.validations}
        label={idLabel}
        description={idDesc}
      >
        <FieldText
          className={cn(input.default, s.field)}
          placeholder={idPlaceholder}
          failed={fields.id.failed}
          disabled={pending}
          value={fields.id.value}
          onChange={fields.id.onChange}
        />
      </FieldLabel>
      <FieldLabel
        className={s.fieldWrp}
        failed={fields.title.failed}
        messages={messages.title}
        validations={fields.title.validations}
        label={titleLabel}
      >
        <FieldText
          className={cn(input.default, s.field)}
          placeholder={titlePlaceholder}
          failed={fields.title.failed}
          disabled={pending}
          value={fields.title.value}
          onChange={fields.title.onChange}
        />
      </FieldLabel>
      <FieldLabel
        className={s.fieldWrp}
        failed={fields.type.failed}
        messages={messages.type}
        validations={fields.type.validations}
        label={typeLabel}
      >
        <FieldSelect
          className={s.select}
          failed={fields.type.failed}
          disabled={pending}
          placeholder={typePlaceholder}
          values={types}
          value={fields.type.value}
          onChange={fields.type.onChange}
        />
      </FieldLabel>
      {reason
      && <p className={s.reason}>
        {reason}
      </p>}
      <SubmitSticky
        className={s.submit}
        pending={pending}
        shown={changed}
        disabled={disabled}
        label={createLabel}
      />
    </form>
  );
}

export default CategoriesFormCreate;
