/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Location } from '@reach/router';
import Layout from './src/components/layout';
import SessionCheck from './src/utils/auth/sessionCheck';
import './src/styles/global.css';

export const wrapRootElement = ({ element }) => {
  return (
    <Location>
      {({ location }) => (
        <SessionCheck location={location}>
          <Layout>{element}</Layout>
        </SessionCheck>
      )}
    </Location>
  );
};
