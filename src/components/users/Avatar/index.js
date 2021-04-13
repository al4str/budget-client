import propTypes from 'prop-types';
import cn from 'classnames';
import { usersGetAvatarURL } from '@/helpers/users';
import IconPerson from '@/components/icons/IconPerson';
import Image from '@/components/ui/Image';
import s from './styles.scss';

UsersAvatar.propTypes = {
  className: propTypes.string,
  avatarURL: propTypes.string,
  avatarId: propTypes.string,
  userId: propTypes.string,
  name: propTypes.string,
  size: propTypes.oneOf([
    '',
    '16',
    '24',
    '48',
    '96',
  ]),
};

UsersAvatar.defaultProps = {
  className: '',
  avatarURL: '',
  avatarId: '',
  userId: '',
  name: '',
  size: '24',
};

/**
 * @param {Object} props
 * @param {string} props.className
 * @param {string} props.avatarURL
 * @param {string} props.avatarId
 * @param {string} props.userId
 * @param {string} props.name
 * @param {string|'24'|'48'|'96'} props.size
 * */
function UsersAvatar(props) {
  const {
    className,
    avatarURL,
    avatarId,
    userId,
    name,
    size,
  } = props;
  const url = avatarURL || usersGetAvatarURL(userId, avatarId);

  return (
    <div
      className={cn(s.avatar, className)}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <div className={s.wrp}>
        {url
          ? <Image
            className={s.image}
            src={url}
            alt={name}
          />
          : <IconPerson className={s.icon} />}
      </div>
    </div>
  );
}

export default UsersAvatar;
