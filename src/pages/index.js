import React, { useEffect, useState } from 'react';
import { isAuthenticated, login, getProfile } from '../utils/auth';
import Home from './home';
import ButtonAppBar from '../components/navbar/nav';
import { handleRequest } from '../utils/handleRequest';
import { prisma_endpoint } from '../constants/route';

export default () => {
  if (!isAuthenticated()) {
    login();
    return <p>Redirecting to login...</p>;
  }
  const [userData, setUserData] = useState('');

  const user = getProfile();
  useEffect(() => {
    handleRequest(user, prisma_endpoint, setUserData);
  }, [user]);

  return (
    <>
      <ButtonAppBar user={user} admin={userData.user} />
      <Home />
    </>
  );
};
