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
      hasSettings
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
export const GET_IN_RADARR_COLLECTION = gql`
  query inRadarrCollection($tmdbId: Int) {
    radarrCollection(tmdbId: $tmdbId) {
      title
      img
      tmdb_id
      release_date
      overview
      downloaded
      id
      tmdbId
      hasFile
    }
  }
`;
export const GET_SIMILAR_MOVIES = gql`
  query similar($tmdbId: Int) {
    similarMovies(tmdbId: $tmdbId) {
      id
      title
      genre_ids
      release_date
      vote_average
      overview
      downloaded
      poster_path
      backdrop_path
    }
  }
`;

export const UPDATE_USER_SUBSCRIPTION = gql`
  mutation UpdateUser($email: String!, $subscription: String!) {
    updateUser(email: $email, subscription: $subscription) {
      name
      subscription
    }
  }
`;

export const UPDATE_RADARR_CONFIG = gql`
  mutation updateConfiguration(
    $radarrApiKey: String
    $radarrEndpoint: String
    $radarrRootFolder: String
  ) {
    updateConfiguration(
      radarrApiKey: $radarrApiKey
      radarrEndpoint: $radarrEndpoint
      radarrRootFolder: $radarrRootFolder
    ) {
      user {
        name
      }
      radarrApiKey
      radarrEndpoint
      radarrRootFolder
    }
  }
`;

export const CREATE_MOVIE = gql`
  mutation createMovie(
    $title: String!
    $img: String
    $tmdb_id: Int
    $genres: [Int]
    $vote_average: Float
    $release_date: String
    $overview: String
  ) {
    createMovie(
      title: $title
      img: $img
      tmdb_id: $tmdb_id
      overview: $overview
      genres: $genres
      release_date: $release_date
      vote_average: $vote_average
    ) {
      title
      img
      tmdb_id
      genres
      release_date
      vote_average
      overview
    }
  }
`;
