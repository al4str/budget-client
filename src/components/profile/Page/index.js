import propTypes from 'prop-types';
import { connectUseHook } from '@/libs/connect';
import { useI18nTranslations } from '@/hooks/useI18n';
import { useTitle } from '@/hooks/useTitle';
import { useProfile } from '@/hooks/useProfile';
import ProfileView from '@/components/profile/View';

function useHook() {
  const { pageTitle } = useI18nTranslations({
    pageTitle: 'titles.profile',
  });
  const { pending, ready, data } = useProfile();

  useTitle({ title: data.name
    ? `${pageTitle} - ${data.id}`
    : pageTitle,
  });

  return {
    pending,
    ready,
    data,
  };
}

ProfilePage.propTypes = {
  pending: propTypes.bool,
  ready: propTypes.bool,
  data: propTypes.object,
};

ProfilePage.defaultProps = {
  pending: true,
  ready: false,
  data: {},
};

function ProfilePage(props) {
  const {
    pending,
    ready,
    data,
  } = props;

  return (
    <ProfileView
      pending={pending}
      ready={ready}
      data={data}
    />
  );
}

export default connectUseHook(useHook)(ProfilePage);
