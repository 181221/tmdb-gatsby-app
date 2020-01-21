import gql from 'graphql-tag';
import * as React from 'react';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactComponents from '@apollo/react-components';
import * as ApolloReactHoc from '@apollo/react-hoc';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type AuthPayload = {
   __typename?: 'AuthPayload',
  token?: Maybe<Scalars['String']>,
  user?: Maybe<User>,
};

export type Movie = {
   __typename?: 'Movie',
  id: Scalars['ID'],
  title: Scalars['String'],
  requestedBy: User,
  requestedById?: Maybe<Scalars['String']>,
  img?: Maybe<Scalars['String']>,
  tmdb_id?: Maybe<Scalars['String']>,
  genres?: Maybe<Array<Maybe<Scalars['String']>>>,
  release_date?: Maybe<Scalars['String']>,
  createdAt: Scalars['String'],
  vote_average?: Maybe<Scalars['String']>,
  overview?: Maybe<Scalars['String']>,
  downloaded?: Maybe<Scalars['Boolean']>,
};

export enum MovieOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC'
}

export type Mutation = {
   __typename?: 'Mutation',
  createToken?: Maybe<AuthPayload>,
  getToken?: Maybe<AuthPayload>,
  createMovie?: Maybe<Movie>,
  updateMovie?: Maybe<Movie>,
  deleteMovie?: Maybe<Movie>,
};


export type MutationCreateTokenArgs = {
  email: Scalars['String']
};


export type MutationGetTokenArgs = {
  email: Scalars['String']
};


export type MutationCreateMovieArgs = {
  title: Scalars['String'],
  img?: Maybe<Scalars['String']>,
  tmdb_id: Scalars['String'],
  genres?: Maybe<Array<Maybe<Scalars['String']>>>,
  vote_average?: Maybe<Scalars['String']>,
  release_date?: Maybe<Scalars['String']>,
  overview?: Maybe<Scalars['String']>
};


export type MutationUpdateMovieArgs = {
  tmdb_id: Scalars['String'],
  downloaded?: Maybe<Scalars['Boolean']>
};


export type MutationDeleteMovieArgs = {
  id: Scalars['ID']
};

export type Query = {
   __typename?: 'Query',
  users?: Maybe<Array<Maybe<User>>>,
  user?: Maybe<User>,
  movies?: Maybe<Array<Movie>>,
  movie?: Maybe<Movie>,
};


export type QueryUserArgs = {
  email: Scalars['String']
};


export type QueryMoviesArgs = {
  orderBy?: Maybe<MovieOrderByInput>,
  first?: Maybe<Scalars['Int']>
};


export type QueryMovieArgs = {
  id?: Maybe<Scalars['ID']>
};

export enum Role {
  Admin = 'ADMIN',
  Customer = 'CUSTOMER'
}

export type Subscription = {
   __typename?: 'Subscription',
  newMovie?: Maybe<Movie>,
};

export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  email: Scalars['String'],
  movies: Array<Movie>,
  notification?: Maybe<Scalars['Boolean']>,
  role?: Maybe<Role>,
};

export type MovieListQueryVariables = {};


export type MovieListQuery = (
  { __typename?: 'Query' }
  & { movies: Maybe<Array<(
    { __typename?: 'Movie' }
    & Pick<Movie, 'title'>
    & { requestedBy: (
      { __typename?: 'User' }
      & Pick<User, 'name'>
    ) }
  )>> }
);


export const MovieListDocument = gql`
    query movieList {
  movies(orderBy: createdAt_DESC, first: 10) {
    title
    requestedBy {
      name
    }
  }
}
    `;
export type MovieListComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<MovieListQuery, MovieListQueryVariables>, 'query'>;

    export const MovieListComponent = (props: MovieListComponentProps) => (
      <ApolloReactComponents.Query<MovieListQuery, MovieListQueryVariables> query={MovieListDocument} {...props} />
    );
    
export type MovieListProps<TChildProps = {}> = ApolloReactHoc.DataProps<MovieListQuery, MovieListQueryVariables> & TChildProps;
export function withMovieList<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  MovieListQuery,
  MovieListQueryVariables,
  MovieListProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, MovieListQuery, MovieListQueryVariables, MovieListProps<TChildProps>>(MovieListDocument, {
      alias: 'movieList',
      ...operationOptions
    });
};

/**
 * __useMovieListQuery__
 *
 * To run a query within a React component, call `useMovieListQuery` and pass it any options that fit your needs.
 * When your component renders, `useMovieListQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMovieListQuery({
 *   variables: {
 *   },
 * });
 */
export function useMovieListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MovieListQuery, MovieListQueryVariables>) {
        return ApolloReactHooks.useQuery<MovieListQuery, MovieListQueryVariables>(MovieListDocument, baseOptions);
      }
export function useMovieListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MovieListQuery, MovieListQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<MovieListQuery, MovieListQueryVariables>(MovieListDocument, baseOptions);
        }
export type MovieListQueryHookResult = ReturnType<typeof useMovieListQuery>;
export type MovieListLazyQueryHookResult = ReturnType<typeof useMovieListLazyQuery>;
export type MovieListQueryResult = ApolloReactCommon.QueryResult<MovieListQuery, MovieListQueryVariables>;