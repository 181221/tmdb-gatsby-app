/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
// eslint-disable-next-line import/no-unresolved
// eslint-disable-next-line import/extensions
import { query } from '../components/gql';
import { authLink } from './helper';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
});

const cache = new InMemoryCache({
  dataIdFromObject: object => {
    switch (object.__typename) {
      case 'Movie':
        return object.id; // use the `key` field as the identifier
      case 'User':
        return object.email; // append `bar` to the `blah` field as the identifier
      default:
        return object.key; // fall back to default handling
    }
  },
});
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});

export const addUserToCache = user => {
  user.__typename = 'User';
  user.movies.forEach(movie => {
    movie.__typename = 'Movie';
  });
  client.writeQuery({
    query,
    data: {
      user,
    },
  });

  return false;
};
