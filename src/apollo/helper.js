import { setContext } from 'apollo-link-context';
import { getProfile } from '../utils/auth/auth';
import { prisma_endpoint } from '../constants/route';
// method for handeling refresh token
export const authLink = setContext(async (_, { headers }) => {
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
  const response = await fetch(prisma_endpoint, options);
  const json = await response.json();
  token = json.data.getToken.token;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
