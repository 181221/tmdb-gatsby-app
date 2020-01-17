import React, { useState, useEffect } from 'react';
import { Router } from '@reach/router';
import { login, isAuthenticated, getProfile } from '../utils/auth';
import Home from './home';
import ButtonAppBar from '../components/navbar/nav';
import Movie from './movie';
import Layout from '../components/layout';
import Request from '../components/account/admin/request';
import MyRequestedMovies from '../components/account/user/myRequestedMovies';
import {
  radarr_url,
  account_movie,
  landing,
  account_settings,
  account_request,
  account_admin_request,
} from '../constants/route';
import Settings from './settings';

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
    <Layout>
      <ButtonAppBar user={user} />
      <Router>
        <Home path={`${landing}`} user={user} />
        <Settings path={`${account_settings}`} user={user} />
        <Movie path={`${account_movie}/:movieId`} user={user} collection={collection} />
        <Request path={account_admin_request} user={user} />
        <MyRequestedMovies path={account_request} user={user} />
      </Router>
    </Layout>
  );
};
export default Account;
