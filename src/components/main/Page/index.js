import queries from 'query-string';
import propTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { dateGetNow } from '@/libs/date';
import { useTitle } from '@/hooks/useTitle';
import { useI18nTranslations } from '@/hooks/useI18n';
import MainView from '@/components/main/View';

MainPage.propTypes = {
  location: propTypes.object,
};

MainPage.defaultProps = {
  location: { search: '' },
};

/**
 * @param {Object} props
 * @param {Object} props.location
 * @param {string} props.location.search
 * */
function MainPage(props) {
  const { location: { search } } = props;
  const { query: { date } } = queries.parseUrl(search);
  const { pageTitle } = useI18nTranslations({
    pageTitle: 'titles.main',
  });

  useTitle({ title: pageTitle });

  if (!date) {
    const dateQuery = queries.stringify({
      date: dateGetNow().startOf('month').toISODate(),
    });
    const to = `/?${dateQuery}`;

    return (
      <Redirect to={to} />
    );
  }
  return (
    <MainView date={date} />
  );
}

export default MainPage;
