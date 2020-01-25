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
      id
      name
      email
      notification
      movies {
        id
        title
        img
        tmdb_id
        genres
        release_date
        createdAt
        vote_average
        overview
        downloaded
      }
    }
  }
`;

export const query = gql`
  query User {
    user {
      role
      subscription
      id
      name
      email
      notification
      token
      movies {
        id
        title
        img
        tmdb_id
        genres
        release_date
        createdAt
        vote_average
        overview
        downloaded
      }
    }
  }
`;
