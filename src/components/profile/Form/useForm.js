import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  filesGetDataURL,
  filesGetEmpty,
  filesIsImageInvalid,
} from '@/libs/files';
import { formsCreate } from '@/helpers/forms';
import { useMounted } from '@/hooks/useMounted';
import { useI18nTranslations } from '@/hooks/useI18n';
import { profileEdit, profileUploadAvatar } from '@/hooks/useProfile';

export const EMPTY_FILE = filesGetEmpty('avatar.jpeg', 'image/jpeg');

const { set, update, getChanged, useForm } = formsCreate({
  values: {
    name: '',
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
        return !value.type.includes('image/');
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

/**
 * @param {Object} params
 * @param {string} params.initialName
 * */
export function useProfileForm(params) {
  const {
    initialName,
  } = params;
  const mountedRef = useMounted();
  const {
    errorsEmpty,
    errorsInvalidType,
    errorsInvalidSize,
    errorsInvalidDimensions,
  } = useI18nTranslations({
    errorsEmpty: 'forms.errors.empty',
    errorsInvalidType: 'forms.errors.invalid-type',
    errorsInvalidSize: 'forms.errors.invalid-size',
    errorsInvalidDimensions: 'forms.errors.invalid-dimensions',
  });
  const [pending, setPending] = useState(false);
  const [previewURL, setPreviewURL] = useState('');
  const { anyFailed, anyPending, anyChanged, fields } = useForm();

  const messages = useMemo(() => {
    return {
      name: {
        empty: errorsEmpty,
      },
      avatarFile: {
        invalidType: errorsInvalidType,
        invalidSize: errorsInvalidSize,
        invalidDimensions: errorsInvalidDimensions,
      },
    };
  }, [
    errorsEmpty,
    errorsInvalidType,
    errorsInvalidSize,
    errorsInvalidDimensions,
  ]);

  /** @type {function(File): void} */
  const handleAvatarChange = useCallback(async (file) => {
    try {
      if (!file) {
        set({ avatarFile: EMPTY_FILE });
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
  ]);

  useEffect(() => {
    if (initialName) {
      set({ name: initialName });
    }
  }, [
    initialName,
  ]);

  return {
    pending,
    changed: anyChanged,
    disabled: anyFailed || anyPending,
    fields,
    messages,
    previewURL,
    onAvatarChange: handleAvatarChange,
    onSubmit: handleSubmit,
  };
}

export const PROFILE_EMPTY_AVATAR_FILE = EMPTY_FILE;
