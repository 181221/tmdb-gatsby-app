import { setContext } from 'apollo-link-context';
import { useApolloClient } from 'react-apollo-hooks';
import { query } from '../components/gql';
// method for handeling refresh token
export const authLink = setContext(async (_, { headers }) => {
  const client = useApolloClient();
  const data = client.readQuery({ query });
  const { user } = data;
  return {
    headers: {
      ...headers,
      authorization: user.tokn,
    },
  };
});
