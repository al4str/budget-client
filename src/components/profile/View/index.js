import propTypes from 'prop-types';
import cn from 'classnames';
import { connectUseHook } from '@/libs/connect';
import { useT9n } from '@/hooks/useI18n';
import ProfileForm from '@/components/profile/Form';
import s from './styles.scss';

function useHook() {
  const title = useT9n('titles.profile');

  return {
    title,
  };
}

ProfileView.propTypes = {
  title: propTypes.string,
  className: propTypes.string,
  userId: propTypes.string,
  pending: propTypes.bool,
  ready: propTypes.bool,
  data: propTypes.object,
};

ProfileView.defaultProps = {
  title: '',
  className: '',
  userId: '',
  pending: true,
  ready: false,
  data: {},
};

/**
 * @param {Object} props
 * @param {UsersItem} props.data
 * */
function ProfileView(props) {
  const {
    title,
    className,
    data,
  } = props;

  return (
    <div className={cn(s.content, className)}>
      <h1 className={s.title}>
        {title}
      </h1>
      <ProfileForm
        className={s.form}
        profile={data}
      />
    </div>
  );
}

export default connectUseHook(useHook)(ProfileView);
