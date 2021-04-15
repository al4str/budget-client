import propTypes from 'prop-types';
import cn from 'classnames';
import { useI18nTranslations } from '@/hooks/useI18n';
import ProfileLanguages from '@/components/profile/Languages';
import ProfileForm from '@/components/profile/Form';
import s from './styles.scss';

ProfileView.propTypes = {
  className: propTypes.string,
  userId: propTypes.string,
  pending: propTypes.bool,
  ready: propTypes.bool,
  data: propTypes.object,
};

ProfileView.defaultProps = {
  className: '',
  userId: '',
  pending: true,
  ready: false,
  data: {},
};

/**
 * @param {Object} props
 * @param {string} props.className
 * @param {UsersItem} props.data
 * */
function ProfileView(props) {
  const {
    className,
    data,
  } = props;
  const { title } = useI18nTranslations({
    title: 'titles.profile',
  });

  return (
    <div className={cn(s.content, className)}>
      <h1 className={s.title}>
        {title}
      </h1>
      <ProfileLanguages className={s.lang} />
      <ProfileForm
        className={s.form}
        profile={data}
      />
    </div>
  );
}

export default ProfileView;
