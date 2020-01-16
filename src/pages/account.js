import React, { useState, useEffect } from 'react';
import { Router } from '@reach/router';
import { login, isAuthenticated, getProfile } from '../utils/auth';
import Home from './home';
import ButtonAppBar from '../components/navbar/nav';
import Movie from './movie';
import Layout from '../components/layout';
import Request from '../components/account/request';
import { handleRequest } from '../utils/handleRequest';
import {
  radarr_url,
  account_movie,
  landing,
  prisma_endpoint,
  account_settings,
  account_request,
} from '../constants/route';
import Settings from './settings';

const Account = () => {
  const [userData, setUserData] = useState('');
  const [collection, setCollection] = useState(undefined);
  const user = getProfile();
  useEffect(() => {
    handleRequest(user, prisma_endpoint, setUserData);
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
      <ButtonAppBar user={user} admin={userData.user} />
      <Router>
        <Home path={`${landing}`} user={user} />
        <Settings path={`${account_settings}`} user={user} />
        <Movie path={`${account_movie}/:movieId`} user={userData} collection={collection} />
        <Request path={account_request} prismaUser={userData} />
      </Router>
    </Layout>
  );
};
export default Account;
