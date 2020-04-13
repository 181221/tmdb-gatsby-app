import auth0 from 'auth0-js';
import { navigate } from 'gatsby';
import { GET_USER_BY_EMAIL, CREATE_USER } from '../../graphql/gql';
import { handleFetch } from '../handleRequest';
import { prisma_endpoint } from '../../constants/route';

const isBrowser = typeof window !== 'undefined';

const auth = isBrowser
  ? new auth0.WebAuth({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENTID,
      redirectUri: `${process.env.AUTH0_CALLBACK}/callback`,
      responseType: 'token id_token',
      scope: 'openid profile email',
    })
  : {};

const tokens = {
  accessToken: false,
  idToken: false,
  expiresAt: false,
};

let user = {};

export const isAuthenticated = async () => {
  if (!isBrowser) {
    return;
  }
  return localStorage.getItem('isLoggedIn') === 'true';
};

export const login = () => {
  if (!isBrowser) {
    return;
  }
  auth.authorize();
};

const getLoggedIn = (cb = () => {}) => async (err, authResult) => {
  if (err) {
    navigate('/');
    cb({ error: true, err });
    return;
  }
  cb({ error: false, authResult });
};

const setSession = (cb = () => {}) => async (err, authResult) => {
  if (err) {
    navigate('/');
    cb();
    return;
  }

  if (authResult && authResult.accessToken && authResult.idToken) {
    const expiresAt = authResult.expiresIn + new Date().getTime();
    tokens.accessToken = authResult.accessToken;
    tokens.idToken = authResult.idToken;
    tokens.expiresAt = expiresAt;
    user = authResult.idTokenPayload;
    localStorage.setItem('email', user.email);
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem('token', tokens.idToken);
    const options = {
      body: {
        query: GET_USER_BY_EMAIL,
        variables: {
          email: user.email,
        },
      },
    };
    const userResponse = await handleFetch(prisma_endpoint, options).catch(async error => {
      if (error.message === 'No such user found') {
        await handleFetch(prisma_endpoint, {
          body: {
            query: CREATE_USER,
            variables: {
              email: user.email,
            },
          },
        });
        const res = await handleFetch(prisma_endpoint, options);
        return res;
      }
    });
    if (!userResponse) {
      user.error = true;
    } else {
      user = { ...user, ...userResponse.data.user };
    }

    cb(user);
  }
};

export const handleAuthentication = () => {
  if (!isBrowser) {
    return;
  }

  auth.parseHash(setSession());
};

export const getProfile = () => user;

export const isLoggedInUser = callback => {
  auth.checkSession({}, getLoggedIn(callback));
};

export const silentAuth = callback => {
  if (!isAuthenticated()) return callback();
  auth.checkSession({}, setSession(callback));
};

export const logout = () => {
  localStorage.setItem('isLoggedIn', false);
  localStorage.setItem('token', null);
  localStorage.setItem('email', null);

  auth.logout({
    returnTo: process.env.AUTH0_CALLBACK,
  });
};
