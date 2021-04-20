import propTypes from 'prop-types';
import cn from 'classnames';
import { isEqual } from '@/libs/isEqual';
import { useI18nTranslations } from '@/hooks/useI18n';
import FieldLabel from '@/components/ui/fields/Label';
import FieldText from '@/components/ui/fields/Text';
import FieldFile from '@/components/ui/fields/File';
import SubmitSticky from '@/components/ui/SubmitSticky';
import UsersAvatar from '@/components/users/Avatar';
import input from '@/styles/input.scss';
import { PROFILE_EMPTY_AVATAR_FILE, useProfileForm }
  from './useForm';
import s from './styles.scss';

ProfileForm.propTypes = {
  className: propTypes.string,
  profile: propTypes.object,
};

ProfileForm.defaultProps = {
  className: '',
  profile: {},
};

/**
 * @param {Object} props
 * @param {UsersItem} props.profile
 * */
function ProfileForm(props) {
  const {
    className,
    profile,
  } = props;
  const {
    nameLabel,
    avatarLabel,
    saveLabel,
  } = useI18nTranslations({
    nameLabel: 'profile.name.label',
    avatarLabel: 'profile.avatar.label',
    saveLabel: 'forms.actions.save',
  });
  const {
    pending,
    changed,
    disabled,
    fields,
    messages,
    previewURL,
    onAvatarChange,
    onSubmit,
  } = useProfileForm({
    initialName: profile.name,
  });
  const avatarFileFailed = !fields.avatarFile.pending
    && fields.avatarFile.invalid
    && !isEqual(fields.avatarFile.value, PROFILE_EMPTY_AVATAR_FILE);

  return (
    <form
      className={cn(s.form, className)}
      onSubmit={onSubmit}
    >
      <FieldLabel
        className={s.fieldWrp}
        failed={fields.name.failed}
        label={nameLabel}
        validations={fields.name.validations}
        messages={messages.name}
      >
        <FieldText
          className={cn(input.default, s.field)}
          disabled={pending}
          failed={fields.name.invalid}
          value={fields.name.value}
          onChange={fields.name.onChange}
        />
      </FieldLabel>
      <FieldLabel
        className={s.fieldWrp}
        failed={avatarFileFailed}
        label={avatarLabel}
        validations={fields.avatarFile.validations}
        messages={messages.avatarFile}
      >
        <div className={s.avatarWrp}>
          <UsersAvatar
            className={s.avatar}
            avatarURL={previewURL}
            avatarId={profile.avatarId}
            userId={profile.id}
            size="96"
          />
          <FieldFile
            className={s.upload}
            disabled={pending}
            failed={avatarFileFailed}
            value={fields.avatarFile.value}
            onChange={onAvatarChange}
          />
        </div>
      </FieldLabel>
      <SubmitSticky
        className={s.submit}
        pending={pending}
        shown={changed}
        disabled={disabled}
        label={saveLabel}
      />
    </form>
  );
}

export default ProfileForm;
