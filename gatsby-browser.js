/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Location } from '@reach/router';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import Layout from './src/components/layout';
import { client } from './src/apollo/index';
import SessionCheck from './src/utils/auth/sessionCheck';

export const wrapRootElement = ({ element }) => {
  return (
    <Location>
      {({ location }) => (
        <SessionCheck location={location}>
          <ApolloProvider client={client}>
            <ApolloHooksProvider client={client}>
              <Layout>{element}</Layout>
            </ApolloHooksProvider>
          </ApolloProvider>
        </SessionCheck>
      )}
    </Location>
  );
};
