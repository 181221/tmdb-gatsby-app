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
