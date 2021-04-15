import { useMemo } from 'react';
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
 * @param {string} props.className
 * */
function MenuMobile(props) {
  const {
    profile,
    className,
  } = props;
  const items = useMemo(() => {
    return [
      {
        key: ROUTES.main,
        to: ROUTES.main,
        Icon: IconLogo,
        iconClassName: s.logo,
      },
      {
        key: ROUTES.profile,
        className: s.profile,
        to: ROUTES.profile,
        Icon: UsersAvatar,
        iconProps: {
          avatarId: profile.avatarId,
          userId: profile.id,
          name: profile.name,
          size: '28',
        },
      },
    ];
  }, [
    profile,
  ]);

  return (
    <nav className={cn(s.menu, className)}>
      <ul className={s.list}>
        {items.map((item) => (
          <li
            className={cn(s.item, item.className)}
            key={item.key}
          >
            <Anchor
              className={cn(btn.button, s.link)}
              activeClassName={s.active}
              exact={true}
              type="nav"
              to={item.to}
            >
              <span className={btn.wrp}>
                <item.Icon
                  className={cn(btn.icon, item.iconClassName)}
                  {...(item.iconProps || {})}
                />
              </span>
            </Anchor>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default connectUseHook(useHook)(MenuMobile);
