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
      hasSettings
      movies {
        id
        title
        img
        tmdbId
        genres
        year
        voteCount
        voteAverage
        overview
        downloaded
        hasFile
      }
    }
  }
`;
export const GET_USER_BY_EMAIL = `
  query getUser($email: String!) {
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
        tmdbId
        genres
        year
        voteCount
        voteAverage
        overview
        downloaded
        hasFile
      }
    }
  }
`;
export const GET_IN_RADARR_COLLECTION = gql`
  query inRadarrCollection($tmdbId: Int) {
    radarrCollection(tmdbId: $tmdbId) {
      isRequested
      hasFile
      downloaded
      status
      timeleft
      title
    }
  }
`;
export const GET_SIMILAR_MOVIES = gql`
  query similar($tmdbId: Int) {
    similarMovies(tmdbId: $tmdbId) {
      title
      img
      tmdbId
      genres
      year
      voteCount
      voteAverage
      overview
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $email: String!
    $subscription: String
    $name: String
    $notification: Boolean
  ) {
    updateUser(
      email: $email
      subscription: $subscription
      name: $name
      notification: $notification
    ) {
      name
      subscription
      notification
    }
  }
`;

export const UPDATE_CONFIG = gql`
  mutation updateConfiguration(
    $radarrApiKey: String
    $radarrEndpoint: String
    $radarrRootFolder: String
    $pushoverEndpoint: String
    $pushoverApiKey: String
    $pushoverUserKey: String
  ) {
    updateConfiguration(
      radarrApiKey: $radarrApiKey
      radarrEndpoint: $radarrEndpoint
      radarrRootFolder: $radarrRootFolder
      pushoverEndpoint: $pushoverEndpoint
      pushoverApiKey: $pushoverApiKey
      pushoverUserKey: $pushoverUserKey
    ) {
      radarrApiKey
      radarrEndpoint
      radarrRootFolder
      pushoverEndpoint
      pushoverApiKey
      pushoverUserKey
    }
  }
`;

export const GET_CONFIG = gql`
  query configuration {
    configuration {
      radarrApiKey
      radarrEndpoint
      radarrRootFolder
      pushoverEndpoint
      pushoverApiKey
      pushoverUserKey
    }
  }
`;
export const GET_TMDB_MOVIE = gql`
  query getTmdbMovie($tmdbId: Int!) {
    tmdbMovie(tmdbId: $tmdbId) {
      title
      genres
      img
      tmdbId
      year
      voteCount
      voteAverage
      overview
    }
  }
`;

export const CREATE_MOVIE = gql`
  mutation createMovie(
    $title: String!
    $img: String
    $tmdbId: Int
    $genres: [String]
    $voteAverage: Float
    $year: Int
    $overview: String
    $voteCount: Int
  ) {
    createMovie(
      title: $title
      img: $img
      tmdbId: $tmdbId
      genres: $genres
      voteAverage: $voteAverage
      year: $year
      overview: $overview
      voteCount: $voteCount
    ) {
      id
      title
      img
      tmdbId
      genres
      year
      voteCount
      voteAverage
      overview
      downloaded
      hasFile
    }
  }
`;
