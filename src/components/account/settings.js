/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import SettingsAdmin from './admin';
import SettingsUser from './user';
import { getUserFromCache } from '../../apollo';

const Settings = () => {
  const user = getUserFromCache();
  if (user) {
    if (user.role === 'ADMIN') {
      return <SettingsAdmin user={user} />;
    }
    return <SettingsUser user={user} />;
  }
  return <></>;
};

export default Settings;
