import React from 'react';
import { isAuthenticated, login } from '../utils/auth';

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  if (!isAuthenticated()) {
    login();
    return null;
  }
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component location={location} {...rest} />;
};
export default PrivateRoute;
