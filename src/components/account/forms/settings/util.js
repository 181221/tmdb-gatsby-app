/* eslint-disable no-param-reassign */
const publicVapidKey = process.env.PUBLIC_KEY;
const url = 'http://localhost:4000';
const { createApolloFetch } = require('apollo-fetch');

const apolloFetch = createApolloFetch({
  uri: url,
});

apolloFetch.use(async ({ request, options }, next) => {
  if (!options.headers) {
    options.headers = {}; // Create the headers object if needed.
  }
  const token = localStorage.getItem('token');
  options.headers.authorization = `Bearer ${token}`;
  next();
});

export const urlBase64ToUint8Array = () => {
  const padding = '='.repeat((4 - (publicVapidKey.length % 4)) % 4);
  const base64 = (publicVapidKey + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);

  const outputArray = new Uint8Array(rawData.length);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const handleRequest = async (subscription, user) => {
  const query = `
  mutation UpdateUser ($email: String!, $subscription: String!) {
    updateUser(email: $email, subscription: $subscription) {
      name
      subscription
    }
  }
  `;
  const variables = {
    email: user.email,
    subscription,
  };
  apolloFetch({ query, variables })
    .then(res => console.log(res))
    .catch(err => console.error(err));
};
