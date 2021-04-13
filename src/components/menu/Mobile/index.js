import propTypes from 'prop-types';
import cn from 'classnames';
import { connectUseHook } from '@/libs/connect';
import { ROUTES } from '@/helpers/routes';
import { useProfile } from '@/hooks/useProfile';
import IconLogo from '@/components/icons/IconLogo';
import Anchor from '@/components/ui/Anchor';
import UsersAvatar from '@/components/users/Avatar';
import btn from '@/styles/button.scss';
import s from './styles.scss';

function useHook() {
  const { data: profile } = useProfile();

  return {
    profile,
  };
}

MenuMobile.propTypes = {
  profile: propTypes.object,
  className: propTypes.string,
};

MenuMobile.defaultProps = {
  profile: {},
  className: '',
};

/**
 * @param {Object} props
 * @param {UsersItem} props.profile
 * */
function MenuMobile(props) {
  const {
    profile,
    className,
  } = props;

  return (
    <nav className={cn(s.menu, className)}>
      <ul className={s.list}>
        <li className={s.item}>
          <Anchor
            className={cn(btn.button, s.link)}
            activeClassName={s.active}
            exact={true}
            type="nav"
            to={ROUTES.main}
          >
            <span className={btn.wrp}>
              <IconLogo className={cn(btn.icon, s.logo)} />
            </span>
          </Anchor>
        </li>
        <li className={cn(s.item, s.profile)}>
          <Anchor
            className={cn(btn.button, s.link)}
            activeClassName={s.active}
            exact={true}
            type="nav"
            to={ROUTES.profile}
          >
            <span className={cn(btn.wrp, s.linkWrp)}>
              <UsersAvatar
                className={s.avatar}
                avatarId={profile.avatarId}
                userId={profile.id}
                name={profile.name}
                size="24"
              />
              <span className={cn(btn.label, s.linkLabel)}>
                {profile.name}
              </span>
            </span>
          </Anchor>
        </li>
      </ul>
    </nav>
  );
}

export default connectUseHook(useHook)(MenuMobile);
