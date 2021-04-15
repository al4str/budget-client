import propTypes from 'prop-types';
import cn from 'classnames';
import { useI18nTranslations } from '@/hooks/useI18n';
import FieldText from '@/components/ui/fields/Text';
import UsersAvatar from '@/components/users/Avatar';
import s from './styles.scss';

AuthUser.propTypes = {
  className: propTypes.string,
  profile: propTypes.object,
  userId: propTypes.string,
  onIdChange: propTypes.func,
};

AuthUser.defaultProps = {
  className: '',
  profile: {},
  userId: '',
  onIdChange: null,
};

/**
 * @param {Object} props
 * @param {UsersItem} props.profile
 * */
function AuthUser(props) {
  const {
    className,
    profile: {
      id,
      name,
      avatarId,
    },
    userId,
    onIdChange,
  } = props;
  const withProfile = name.length > 0;
  const { profileIdLabel } = useI18nTranslations({
    profileIdLabel: 'profile.id.label',
  });

  return (
    <div className={cn(s.user, className)}>
      <div className={s.wrp}>
        <UsersAvatar
          className={s.avatar}
          avatarId={avatarId}
          userId={id}
          name={name}
          size="96"
        />
        {withProfile
          ? <span className={s.name}>
            {name}
          </span>
          : <FieldText
            className={s.field}
            placeholder={profileIdLabel}
            autoComplete="username"
            maxLength={20}
            autoCapitalize="off"
            value={userId}
            onChange={onIdChange}
          />}
      </div>
    </div>
  );
}

export default AuthUser;
