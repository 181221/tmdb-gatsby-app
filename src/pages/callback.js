import React from 'react';

import { handleAuthentication } from '../utils/auth/auth';
import LoadingApp from '../components/LoadingApp';

const Callback = () => {
  handleAuthentication();
  return <LoadingApp />;
};

export default Callback;
