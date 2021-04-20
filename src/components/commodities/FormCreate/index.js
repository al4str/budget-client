import propTypes from 'prop-types';
import cn from 'classnames';
import { useI18nTranslations } from '@/hooks/useI18n';
import { useCommoditiesCreate } from '@/components/commodities/FormCreate/useForm';
import SubmitSticky from '@/components/ui/SubmitSticky';
import FieldLabel from '@/components/ui/fields/Label';
import FieldText from '@/components/ui/fields/Text';
import FieldSelect from '@/components/ui/fields/Select';
import input from '@/styles/input.scss';
import s from './styles.scss';

CommoditiesFormCreate.propTypes = {
  className: propTypes.string,
  categoryId: propTypes.string,
  onCreate: propTypes.func,
};

CommoditiesFormCreate.defaultProps = {
  className: '',
  categoryId: '',
  onCreate: null,
};

function CommoditiesFormCreate(props) {
  const {
    className,
    categoryId,
    onCreate,
  } = props;
  const {
    idLabel,
    idPlaceholder,
    idDesc,
    titleLabel,
    titlePlaceholder,
    categoryLabel,
    categoryPlaceholder,
    createLabel,
  } = useI18nTranslations({
    idLabel: 'forms.id.label',
    idPlaceholder: 'forms.id.placeholder',
    idDesc: 'forms.id.desc',
    titleLabel: 'forms.name.label',
    titlePlaceholder: 'forms.name.placeholder',
    categoryLabel: 'forms.category.label',
    categoryPlaceholder: 'forms.category.placeholder',
    createLabel: 'forms.actions.create',
  });
  const {
    pending,
    changed,
    disabled,
    reason,
    categories,
    messages,
    fields,
    onSubmit,
  } = useCommoditiesCreate({
    initialCategoryId: categoryId,
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
        failed={fields.categoryId.failed}
        messages={messages.categoryId}
        validations={fields.categoryId.validations}
        label={categoryLabel}
      >
        <FieldSelect
          className={s.select}
          failed={fields.categoryId.failed}
          disabled={pending}
          placeholder={categoryPlaceholder}
          values={categories}
          value={fields.categoryId.value}
          onChange={fields.categoryId.onChange}
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

export default CommoditiesFormCreate;
