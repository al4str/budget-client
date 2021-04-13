import { useState, useMemo, useCallback } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { isEqual } from '@/libs/isEqual';
import {
  filesGetDataURL,
  filesGetEmpty,
  filesIsImageInvalid,
} from '@/libs/files';
import { useMounted } from '@/hooks/useMounted';
import { useT9n } from '@/hooks/useI18n';
import { formsCreate } from '@/helpers/forms';
import { profileEdit, profileUploadAvatar } from '@/hooks/useProfile';
import FieldLabel from '@/components/ui/fields/Label';
import FieldText from '@/components/ui/fields/Text';
import FieldFile from '@/components/ui/fields/File';
import Submit from '@/components/ui/Submit';
import UsersAvatar from '@/components/users/Avatar';
import input from '@/styles/input.scss';
import s from './styles.scss';

const EMPTY_FILE = filesGetEmpty('avatar.jpeg', 'image/jpeg');

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
  const mountedRef = useMounted();
  const idLabel = useT9n('forms.id.label');
  const nameLabel = useT9n('forms.name.label');
  const avatarLabel = useT9n('forms.avatar.label');
  const errorsEmpty = useT9n('errors.forms.empty');
  const errorsInvalidType = useT9n('errors.forms.invalid-type');
  const errorsInvalidSize = useT9n('errors.forms.invalid-size');
  const errorsInvalidDimensions = useT9n('errors.forms.invalid-dimensions');
  const saveLabel = useT9n('forms.save');
  const [pending, setPending] = useState(false);
  const { set, update, getChanged, useForm } = useMemo(() => {
    return formsCreate({
      values: {
        name: profile.name,
        avatarFile: EMPTY_FILE,
      },
      schema: {
        name: {
          /** @param {string} value */
          empty(value) {
            return value.length === 0;
          },
        },
        avatarFile: {
          /** @param {File} value */
          invalidType(value) {
            return value.type !== 'image/jpeg';
          },
          /** @param {File} value */
          invalidSize(value) {
            return !value.size || value.size > (2 ** 20) * 5;
          },
          /** @param {File} value */
          invalidDimensions(value) {
            return filesIsImageInvalid(value, (image) => {
              return image.naturalWidth < 128 || image.naturalWidth > 2000
                || image.naturalHeight < 128 || image.naturalHeight > 2000;
            });
          },
        },
      },
    });
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);
  const { anyChanged, fields } = useForm();
  const [previewURL, setPreviewURL] = useState('');

  const errorsName = useMemo(() => {
    return [
      {
        key: 'empty',
        label: errorsEmpty,
      },
    ].filter((item) => {
      return fields.name.validations[item.key];
    });
  }, [
    errorsEmpty,
    fields.name.validations,
  ]);
  const errorsAvatar = useMemo(() => {
    return [
      {
        key: 'invalidType',
        label: errorsInvalidType,
      },
      {
        key: 'invalidSize',
        label: errorsInvalidSize,
      },
      {
        key: 'invalidDimensions',
        label: errorsInvalidDimensions,
      },
    ].filter((item) => {
      return fields.avatarFile.validations[item.key];
    });
  }, [
    errorsInvalidType,
    errorsInvalidSize,
    errorsInvalidDimensions,
    fields.avatarFile.validations,
  ]);

  /** @type {function(File): void} */
  const handleAvatarChange = useCallback(async (file) => {
    try {
      if (!file) {
        update({ avatarFile: EMPTY_FILE });
        setPreviewURL('');
        return;
      }
      update({ avatarFile: file });
      const url = await filesGetDataURL(file);
      if (mountedRef.current && url) {
        setPreviewURL(url);
      }
    }
    catch (err) {
      update({ avatarFile: EMPTY_FILE });
      setPreviewURL('');
    }
  }, [
    mountedRef,
    update,
  ]);
  /** @type {function(Event): void} */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setPending(true);
    const values = getChanged();
    if (values.name) {
      await profileEdit({
        name: values.name,
      });
      set({ name: values.name });
    }
    if (values.avatarFile) {
      await profileUploadAvatar({
        file: values.avatarFile,
      });
      set({ avatarFile: EMPTY_FILE });
    }
    if (mountedRef.current) {
      setPending(false);
    }
  }, [
    mountedRef,
    set,
    getChanged,
  ]);

  return (
    <form
      className={cn(s.form, className)}
      onSubmit={handleSubmit}
    >
      <FieldLabel
        className={s.fieldWrp}
        label={idLabel}
      >
        <FieldText
          className={cn(input.default, s.field)}
          readOnly={true}
          value={profile.id}
        />
      </FieldLabel>
      <FieldLabel
        className={s.fieldWrp}
        failed={fields.name.failed}
        label={nameLabel}
        errors={errorsName}
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
        failed={fields.avatarFile.failed}
        label={avatarLabel}
        errors={errorsAvatar}
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
            failed={fields.avatarFile.invalid
              && !isEqual(fields.avatarFile.value, EMPTY_FILE)}
            value={fields.avatarFile.value}
            onChange={handleAvatarChange}
          />
        </div>
      </FieldLabel>
      <div className={s.submitWrp}>
        <Submit
          className={s.submit}
          pending={pending}
          disabled={!anyChanged}
          type="submit"
          label={saveLabel}
        />
      </div>
    </form>
  );
}

export default ProfileForm;
