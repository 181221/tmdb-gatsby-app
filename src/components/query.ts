import gql from 'graphql-tag';

export const QUERY_LAUNCH_LIST = gql`
  query movieList {
    movies(orderBy: createdAt_DESC, first: 10) {
      title
      requestedBy {
        name
      }
    }
  }
`;

export const QUERY_USER = gql`
  query User($email: String!) {
    user(email: $email) {
      role
      subscription
    }
  }
`;
