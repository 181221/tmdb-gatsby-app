/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useApolloClient } from 'react-apollo-hooks';
import { query } from '../gql';
import SettingsAdmin from './admin';
import SettingsUser from './user';

const Settings = () => {
  const client = useApolloClient();
  const data = client.readQuery({ query });
  if (data) {
    if (data.user.role === 'ADMIN') {
      return <SettingsAdmin user={data.user} />;
    }
    return <SettingsUser user={data.use} />;
  }
  return <></>;
};

export default Settings;
