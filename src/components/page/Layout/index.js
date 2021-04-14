import { Fragment, Suspense } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { connectUseHook } from '@/libs/connect';
import { useSession } from '@/hooks/useSession';
import { useOverlays } from '@/hooks/useOverlays';
import PageLoading from '@/components/page/Loading';
import MenuMobile from '@/components/menu/Mobile';
import OverlaysContainer from '@/components/overlays/Container';
import AuthView from '@/components/auth/View';
import s from './styles.scss';

function useHook() {
  const { initial, authed } = useSession();
  const { shown } = useOverlays();
  const overlaysShown = shown.size > 0;

  return {
    initial,
    authed,
    overlaysShown,
  };
}

PageLayout.propTypes = {
  initial: propTypes.bool,
  authed: propTypes.bool,
  overlaysShown: propTypes.bool,
  children: propTypes.node,
};

PageLayout.defaultProps = {
  initial: true,
  authed: false,
  overlaysShown: false,
  children: null,
};

function PageLayout(props) {
  const {
    initial,
    authed,
    overlaysShown,
    children,
  } = props;
  const layoutHidden = initial || !authed || overlaysShown;

  return (
    <Fragment>
      <div className={cn(s.layout, layoutHidden && s.hidden)}>
        <MenuMobile className={s.menu} />
        <main className={s.main}>
          <Suspense fallback={<PageLoading />}>
            {children}
          </Suspense>
        </main>
      </div>
      <OverlaysContainer className={cn(s.overlays, layoutHidden && s.hidden)} />
      <AuthView className={s.auth} />
    </Fragment>
  );
}

export default connectUseHook(useHook)(PageLayout);
