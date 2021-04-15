import { useRef, useState, useCallback, useEffect } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { connectUseHook } from '@/libs/connect';
import { sessionAuth, useSession } from '@/hooks/useSession';
import { profileGet, useProfile } from '@/hooks/useProfile';
import AuthUser from '@/components/auth/User';
import AuthNumpad from '@/components/auth/Numpad';
import s from './styles.scss';

function useHook() {
  const { authed } = useSession();
  const { initial, data: profile } = useProfile();
  const [userId, onIdChange] = useState(profile.id);
  const [userPIN, setUserPIN] = useState('');
  const [failure, setFailure] = useState('');

  /** @type {function(string): void} */
  const onPINChange = useCallback(async (nextPIN) => {
    setUserPIN(nextPIN);
    setFailure('');
    if (userId && nextPIN.length === 4) {
      const response = await sessionAuth({
        userId,
        userPIN: nextPIN,
      });
      if (!response.body.ok) {
        setFailure(response.body.reason);
        setTimeout(() => {
          setUserPIN('');
          setFailure('');
        }, 600);
      }
      else {
        setUserPIN('');
        setFailure('');
      }
    }
  }, [
    userId,
  ]);

  useEffect(() => {
    if (authed && initial && userId) {
      profileGet({ userId })
        .then()
        .catch();
    }
  }, [
    authed,
    initial,
    userId,
  ]);

  return {
    authed,
    profile,
    failure,
    userId,
    userPIN,
    onIdChange,
    onPINChange,
  };
}

AuthView.propTypes = {
  authed: propTypes.bool,
  profile: propTypes.object,
  failure: propTypes.string,
  userId: propTypes.string,
  userPIN: propTypes.string,
  onIdChange: propTypes.func,
  onPINChange: propTypes.func,
  className: propTypes.string,
};

AuthView.defaultProps = {
  authed: false,
  profile: {},
  failure: '',
  userId: '',
  userPIN: '',
  onIdChange: null,
  onPINChange: null,
  className: '',
};

/**
 * @param {Object} props
 * @param {UsersItem} props.profile
 * */
function AuthView(props) {
  const {
    authed,
    profile,
    failure,
    userId,
    userPIN,
    onIdChange,
    onPINChange,
    className,
  } = props;
  /** @type {React.RefObject<HTMLFormElement>} */
  const formRef = useRef(null);

  /** @type {function(Event): void} */
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
  }, []);

  if (authed) {
    return null;
  }
  return (
    <div className={cn(s.view, className)}>
      <form
        className={s.form}
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <AuthUser
          className={s.user}
          profile={profile}
          userId={userId}
          onIdChange={onIdChange}
        />
        <AuthNumpad
          className={s.numpad}
          failure={failure}
          userPIN={userPIN}
          onPINChange={onPINChange}
        />
      </form>
    </div>
  );
}

export default connectUseHook(useHook)(AuthView);
