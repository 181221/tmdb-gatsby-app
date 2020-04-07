import auth0 from 'auth0-js';
import { navigate } from 'gatsby';
import { handleRequest } from '../handleRequest';
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

const setUserData = data => {
  user.token = data.token;
  user = { ...user, ...data.user };
};

export const isAuthenticated = () => {
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

const setSession = (cb = () => {}) => async (err, authResult) => {
  if (err) {
    navigate('/');
    cb();
    return;
  }

  if (authResult && authResult.accessToken && authResult.idToken) {
    const expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    tokens.accessToken = authResult.accessToken;
    tokens.idToken = authResult.idToken;
    tokens.expiresAt = expiresAt;
    user = authResult.idTokenPayload;
    handleRequest(user, prisma_endpoint, setUserData).then(json => {
      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('token', user.token);
      user.error = json.isError;
      localStorage.setItem('user', user);
      cb(user);
    });
  }
};

export const handleAuthentication = () => {
  if (!isBrowser) {
    return;
  }

  auth.parseHash(setSession());
};

export const getProfile = () => user;

export const silentAuth = callback => {
  if (!isAuthenticated()) return callback();
  auth.checkSession({}, setSession(callback));
};

export const logout = () => {
  localStorage.setItem('isLoggedIn', false);

  auth.logout({
    returnTo: process.env.AUTH0_CALLBACK,
  });
};
