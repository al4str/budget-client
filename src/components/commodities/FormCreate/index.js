import propTypes from 'prop-types';
import cn from 'classnames';
import { useT9n } from '@/hooks/useI18n';
import { useCommoditiesCreate } from '@/components/commodities/hooks/create';
import Submit from '@/components/ui/Submit';
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
    pending,
    reason,
    categories,
    messages,
    fields,
    onSubmit,
  } = useCommoditiesCreate({
    initialCategoryId: categoryId,
    onCreate,
  });
  const idLabel = useT9n('forms.id.label');
  const idPlaceholder = useT9n('forms.id.placeholder');
  const idDesc = useT9n('forms.id.desc');
  const titleLabel = useT9n('forms.name.label');
  const titlePlaceholder = useT9n('forms.name.placeholder');
  const categoryLabel = useT9n('forms.category.label');
  const categoryPlaceholder = useT9n('forms.category.placeholder');
  const createLabel = useT9n('forms.actions.create');

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
      <div className={s.submitWrp}>
        <Submit
          className={s.submit}
          pending={pending}
          label={createLabel}
        />
      </div>
      {reason
      && <p className={s.reason}>
        {reason}
      </p>}
    </form>
  );
}

export default CommoditiesFormCreate;
