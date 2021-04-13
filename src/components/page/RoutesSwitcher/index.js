import { memo } from 'react';
import propTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { isEqual } from '@/libs/isEqual';
import RouteReady from '@/components/page/RouteReady';
import PageLayout from '@/components/page/Layout';
import PageNotFound from '@/components/page/NotFound';
import ErrorBoundary from '@/components/page/ErrorBoundary';

RoutesSwitcher.propTypes = {
  pages: propTypes.array,
};

RoutesSwitcher.defaultProps = {
  pages: [],
};

/**
 * @param {Object} props
 * @param {Array<RoutePage>} props.pages
 * */
function RoutesSwitcher(props) {
  const { pages } = props;

  return (
    <ErrorBoundary>
      <PageLayout>
        <Switch>
          {pages.map((page) => (
            <Route
              key={page.url}
              exact={true}
              path={page.url}
            >
              {(routeProps) => {
                return (
                  <RouteReady>
                    <page.Component {...routeProps} />
                  </RouteReady>
                );
              }}
            </Route>
          ))}
          <Route component={PageNotFound} />
        </Switch>
      </PageLayout>
    </ErrorBoundary>
  );
}

export default memo(RoutesSwitcher, isEqual);
