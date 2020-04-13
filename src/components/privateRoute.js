import React, { useState, useEffect } from 'react';
import { isLoggedInUser, login } from '../utils/auth/auth';
import LoadingApp from './miscellaneous/LoadingApp';

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleCheckSession = session => {
    setLoading(false);
    if (session.error) {
      setError(true);
    }
  };
  useEffect(() => {
    isLoggedInUser(handleCheckSession);
  }, []);
  if (loading) {
    return <LoadingApp />;
  }
  if (error) {
    login();
    return;
  }
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component location={location} {...rest} />;
};
export default PrivateRoute;
