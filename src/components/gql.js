import gql from 'graphql-tag';

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
