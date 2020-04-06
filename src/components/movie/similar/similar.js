import React, { useEffect } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';

import { GET_SIMILAR_MOVIES } from '../../gql';

import ScrollBar from './scroll/scrollBar';

const useStyles = makeStyles(theme => ({
  root: props => ({
    padding: '24px 10% 0 10%',
  }),
}));

const Container = styled.div`
  width: 80%;
  margin: auto;
  @media (max-width: 768px) {
    width: 100%;
  }
  @media (max-width: 1280px) {
    width: 100%;
  }
`;

const MovieContainer = styled.div`
  margin-bottom: 60px;
`;
export const SimilarFetch = ({ id }) => {
  const classes = useStyles();
  const { data, loading, error } = useQuery(GET_SIMILAR_MOVIES, {
    variables: { tmdbId: id },
  });
  if (loading) {
    return <></>;
  }
  if (error) {
    return <div>error</div>;
  }
  return (
    <>
      <Container>
        <Typography variant="h4" component="h4" className={classes.root}>
          Similar movies
        </Typography>
        <MovieContainer>
          <ScrollBar movies={data.similarMovies} />
        </MovieContainer>
      </Container>
    </>
  );
};
export const Similar = ({ movies }) => {
  const classes = useStyles();
  if (movies && movies.length === 0) {
    return <></>;
  }
  return (
    <>
      <Container>
        <Typography variant="h4" component="h4" className={classes.root}>
          Similar movies
        </Typography>
        <MovieContainer>
          <ScrollBar movies={movies} />
        </MovieContainer>
      </Container>
    </>
  );
};
