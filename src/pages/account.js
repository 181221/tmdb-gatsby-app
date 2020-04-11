import React from 'react';
import { Router } from '@reach/router';
import { login, isAuthenticated } from '../utils/auth/auth';
import Discover from '../components/movie/discover';
import Movie from '../components/movie/movie';
import PrivateRoute from '../components/privateRoute';
import { account_movie, landing, account_settings } from '../constants/route';
import Settings from '../components/account/settings';
import LoadingApp from '../components/miscellaneous/LoadingApp';

const Account = () => {
  if (!isAuthenticated()) {
    login();
    return <LoadingApp />;
  }
  return (
    <>
      <Router>
        <PrivateRoute path={`${landing}`} component={Discover} />
        <PrivateRoute path={`${account_settings}`} component={Settings} />
        <PrivateRoute path={`${account_movie}/:movieId`} component={Movie} />
      </Router>
    </>
  );
};
export default Account;
