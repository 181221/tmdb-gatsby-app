import React, { useState, useEffect } from 'react';
import { Location } from '@reach/router';
import { navigate } from 'gatsby';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import Layout from './src/components/layout';
import { landing } from './src/constants/route';
import { silentAuth, getProfile } from './src/utils/auth';

const authLink = setContext(async (_, { headers }) => {
  let token = localStorage.getItem('AUTH_TOKEN');
  const user = getProfile();
  const ql = `mutation {
        getToken(
          email: "${user.email}"
        ) {
          token
        }
      }`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: ql,
    }),
  };
  const response = await fetch('http://localhost:4000/', options);
  const json = await response.json();
  token = json.data.getToken.token;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
});

const cache = new InMemoryCache();
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});
const SessionCheck = ({ children, location }) => {
  const [loading, setLoading] = useState(true);
  const handleCheckSession = user => {
    setLoading(false);
    if (location.pathname === '/callback/' || location.pathname === '/callback') {
      navigate(landing);
    }
    navigate(location.pathname);
  };
  useEffect(() => {
    silentAuth(handleCheckSession);
  }, []);

  if (!loading) return <>{children}</>;
  return <></>;
};

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
