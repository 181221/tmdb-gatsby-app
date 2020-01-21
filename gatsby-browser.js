import React from 'react';
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
  console.log(user.email);
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

class SessionCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    silentAuth(this.handleCheckSession);
  }

  handleCheckSession = () => {
    this.setState({ loading: false });
    if (
      this.props.location.pathname === '/callback/' ||
      this.props.location.pathname === '/callback'
    ) {
      navigate(landing);
    }
    navigate(this.props.location.pathname);
  };

  render() {
    return this.state.loading === false && <>{this.props.children}</>;
  }
}

export const wrapRootElement = ({ element }) => {
  return (
    <Layout>
      <Location>
        {({ location }) => (
          <SessionCheck location={location}>
            <ApolloProvider client={client}>
              <ApolloHooksProvider client={client}>{element}</ApolloHooksProvider>
            </ApolloProvider>
          </SessionCheck>
        )}
      </Location>
    </Layout>
  );
};
