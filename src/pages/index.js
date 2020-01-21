import React from 'react';
import { isAuthenticated, login, getProfile } from '../utils/auth';
import ButtonAppBar from '../components/navbar/nav';

export default () => {
  if (!isAuthenticated()) {
    login();
    return <p>Redirecting to login...</p>;
  }

  const user = getProfile();

  return (
    <>
      <h1>landing</h1>
    </>
  );
};
