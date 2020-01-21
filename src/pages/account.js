import React from 'react';
import { Router } from '@reach/router';
import { login, isAuthenticated } from '../utils/auth';
import Discover from '../components/movie/discover';
import Movie from '../components/movie/movie';
import PrivateRoute from '../components/privateRoute';
import { account_movie, landing } from '../constants/route';

const Account = () => {
  if (!isAuthenticated()) {
    login();
    return <p>Redirecting to login...</p>;
  }
  return (
    <>
      <Router>
        <PrivateRoute path={`${landing}`} component={Discover} />
        <PrivateRoute path={`${account_movie}/:movieId`} component={Movie} />
      </Router>
    </>
  );
};
export default Account;
