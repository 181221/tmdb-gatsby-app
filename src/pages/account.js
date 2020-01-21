import React, { useState, useEffect } from 'react';
import { Router } from '@reach/router';
import { login, isAuthenticated, getProfile } from '../utils/auth';
import Discover from '../components/movie/discover';
import Movie from '../components/movie/movie';
import PrivateRoute from '../components/privateRoute';
import {
  radarr_url,
  account_movie,
  landing,
  account_request,
  account_admin_request,
} from '../constants/route';

const Account = () => {
  const [collection, setCollection] = useState(undefined);
  const user = getProfile();
  useEffect(() => {
    const url_collection = `${radarr_url}/movie?apikey=${process.env.RADARR_API_KEY}`;
    fetch(url_collection)
      .then(res => res.json())
      .then(json => {
        setCollection(json);
      })
      .catch(err => console.error(err));
  }, [user]);
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
