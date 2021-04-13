import { Redirect } from 'react-router-dom';
import { ROUTES } from '@/helpers/routes';

function PageForbidden() {
  return (
    <Redirect to={ROUTES.entrance} />
  );
}

export default PageForbidden;
