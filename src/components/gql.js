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
        tmdbId
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
      adult
      backdrop_path
      genre_ids
      id
      original_language
      poster_path
      title
      vote_average
      overview
      vote_count
      popularity
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

export const CREATE_MOVIE = gql`
  mutation createMovie(
    $title: String!
    $img: String
    $tmdbId: Int
    $genres: [Int]
    $vote_average: Float
    $release_date: String
    $overview: String
  ) {
    createMovie(
      title: $title
      img: $img
      tmdbId: $tmdbId
      overview: $overview
      genres: $genres
      release_date: $release_date
      vote_average: $vote_average
    ) {
      title
      img
      tmdbId
      genres
      release_date
      vote_average
      overview
    }
  }
`;
