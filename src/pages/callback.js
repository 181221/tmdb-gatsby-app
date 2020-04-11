import React from 'react';

import { handleAuthentication } from '../utils/auth/auth';
import LoadingApp from '../components/miscellaneous/LoadingApp';

const Callback = () => {
  handleAuthentication();
  return <LoadingApp />;
};

export default Callback;
