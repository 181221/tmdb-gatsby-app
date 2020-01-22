import React from 'react';
import { navigate } from 'gatsby';
import { isAuthenticated } from '../utils/auth';

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  if (!isAuthenticated() && location.pathname !== `/account/login`) {
    navigate('/account/login');
    return null;
  }
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component location={location} {...rest} />;
};
export default PrivateRoute;
