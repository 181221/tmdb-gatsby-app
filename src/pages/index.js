import React from 'react';
import { isAuthenticated, login, getProfile } from '../utils/auth';
import Home from './home';
import ButtonAppBar from '../components/navbar/nav';

export default () => {
  if (!isAuthenticated()) {
    login();
    return <p>Redirecting to login...</p>;
  }

  const user = getProfile();

  return (
    <>
      <ButtonAppBar user={user} />
      <Home />
    </>
  );
};
