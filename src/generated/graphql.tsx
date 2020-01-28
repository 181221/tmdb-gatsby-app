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
  updateUser?: Maybe<User>,
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


export type MutationUpdateUserArgs = {
  email: Scalars['String'],
  subscription?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>,
  notification?: Maybe<Scalars['Boolean']>,
  role?: Maybe<Role>
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
  subscription?: Maybe<Scalars['String']>,
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

export type UserQueryVariables = {
  email: Scalars['String']
};


export type UserQuery = (
  { __typename?: 'Query' }
  & { user: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'role' | 'subscription' | 'id' | 'name' | 'email' | 'notification'>
    & { movies: Array<(
      { __typename?: 'Movie' }
      & Pick<Movie, 'id' | 'title' | 'img' | 'tmdb_id' | 'genres' | 'release_date' | 'createdAt' | 'vote_average' | 'overview' | 'downloaded'>
    )> }
  )> }
);

export type UpdateUserMutationVariables = {
  email: Scalars['String'],
  notification?: Maybe<Scalars['Boolean']>,
  subscription?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>
};


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'role' | 'subscription' | 'id' | 'name' | 'email' | 'notification'>
  )> }
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
export const UserDocument = gql`
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
export type UserComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<UserQuery, UserQueryVariables>, 'query'> & ({ variables: UserQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const UserComponent = (props: UserComponentProps) => (
      <ApolloReactComponents.Query<UserQuery, UserQueryVariables> query={UserDocument} {...props} />
    );
    
export type UserProps<TChildProps = {}> = ApolloReactHoc.DataProps<UserQuery, UserQueryVariables> & TChildProps;
export function withUser<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  UserQuery,
  UserQueryVariables,
  UserProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, UserQuery, UserQueryVariables, UserProps<TChildProps>>(UserDocument, {
      alias: 'user',
      ...operationOptions
    });
};

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserQuery, UserQueryVariables>) {
        return ApolloReactHooks.useQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
      }
export function useUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = ApolloReactCommon.QueryResult<UserQuery, UserQueryVariables>;
export const UpdateUserDocument = gql`
    mutation updateUser($email: String!, $notification: Boolean, $subscription: String, $name: String) {
  updateUser(email: $email, notification: $notification, subscription: $subscription, name: $name) {
    role
    subscription
    id
    name
    email
    notification
  }
}
    `;
export type UpdateUserMutationFn = ApolloReactCommon.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;
export type UpdateUserComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<UpdateUserMutation, UpdateUserMutationVariables>, 'mutation'>;

    export const UpdateUserComponent = (props: UpdateUserComponentProps) => (
      <ApolloReactComponents.Mutation<UpdateUserMutation, UpdateUserMutationVariables> mutation={UpdateUserDocument} {...props} />
    );
    
export type UpdateUserProps<TChildProps = {}> = ApolloReactHoc.MutateProps<UpdateUserMutation, UpdateUserMutationVariables> & TChildProps;
export function withUpdateUser<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  UpdateUserProps<TChildProps>>) {
    return ApolloReactHoc.withMutation<TProps, UpdateUserMutation, UpdateUserMutationVariables, UpdateUserProps<TChildProps>>(UpdateUserDocument, {
      alias: 'updateUser',
      ...operationOptions
    });
};

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *      notification: // value for 'notification'
 *      subscription: // value for 'subscription'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, baseOptions);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = ApolloReactCommon.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;