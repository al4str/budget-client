import { useCallback } from 'react';
import propTypes from 'prop-types';
import { I18N_TAGS } from '@/helpers/i18n';
import { i18nFetch, useI18n, useT9ns } from '@/hooks/useI18n';
import FieldLabel from '@/components/ui/fields/Label';
import FieldSelect from '@/components/ui/fields/Select';

ProfileLanguages.propTypes = {
  className: propTypes.string,
};

ProfileLanguages.defaultProps = {
  className: '',
};

/**
 * @param {Object} props
 * @param {string} props.className
 * */
function ProfileLanguages(props) {
  const { className } = props;
  const { label } = useT9ns({
    label: 'profile.language.label',
  });
  const { pending, tag } = useI18n();

  /** @type {function(I18nLangTag): void} */
  const handleChange = useCallback(async (nextTag) => {
    await i18nFetch(nextTag);
  }, []);

  return (
    <FieldLabel
      className={className}
      label={label}
    >
      <FieldSelect
        disabled={pending}
        values={I18N_TAGS}
        value={tag}
        onChange={handleChange}
      />
    </FieldLabel>
  );
}

export default ProfileLanguages;
