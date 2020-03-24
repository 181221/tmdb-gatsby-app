import React from 'react';
import { logout, isAuthenticated } from '../utils/auth/auth';

export default () => {
  if (isAuthenticated()) {
    logout();
    return null;
  }
  return <></>;
};
