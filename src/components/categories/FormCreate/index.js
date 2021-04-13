import propTypes from 'prop-types';
import cn from 'classnames';
import { useT9n } from '@/hooks/useI18n';
import { useCategoriesCreate } from '@/components/categories/hooks/create';
import Submit from '@/components/ui/Submit';
import FieldLabel from '@/components/ui/fields/Label';
import FieldText from '@/components/ui/fields/Text';
import FieldSelect from '@/components/ui/fields/Select';
import input from '@/styles/input.scss';
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
    pending,
    reason,
    messages,
    types,
    fields,
    onSubmit,
  } = useCategoriesCreate({
    initialType: type,
    onCreate,
  });
  const idLabel = useT9n('forms.id.label');
  const idPlaceholder = useT9n('forms.id.placeholder');
  const idDesc = useT9n('forms.id.desc');
  const titleLabel = useT9n('forms.name.label');
  const titlePlaceholder = useT9n('forms.name.placeholder');
  const typeLabel = useT9n('forms.type.label');
  const typePlaceholder = useT9n('forms.type.placeholder');
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

export default CategoriesFormCreate;
