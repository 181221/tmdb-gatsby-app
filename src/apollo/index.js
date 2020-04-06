/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { query } from '../components/gql';

const httpLink = createHttpLink({
  uri: process.env.PRISMA_ENDPOINT,
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

let User;
let client;
const authLink = setContext(async (_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: User.token,
    },
  };
});

export const createApolloClient = user => {
  User = user;
  client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
  });
  return client;
};

export const addUserToCache = user => {
  user.__typename = 'User';
  if (user.movies) {
    user.movies.forEach(movie => {
      movie.__typename = 'Movie';
    });
  }

  client.writeQuery({
    query,
    data: {
      user,
    },
  });

  return false;
};
export const writeToCache = data => {
  client.writeQuery({
    query,
    data: {
      data,
    },
  });
};
export const getUserFromCache = () => {
  const data = client.readQuery({ query });
  const { user } = data;
  return user;
};
