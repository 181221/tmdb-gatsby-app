import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';

import { GET_SIMILAR_MOVIES } from '../../../graphql/gql';

import ScrollBar from './scroll/scrollBar';

const useStyles = makeStyles({
  root: { padding: '24px 10% 0 10%' },
});

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
const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
const SkeletonMargin = styled(Skeleton)`
  margin: 12px 12px;
`;
export const ScrollBarLoader = () => {
  return (
    <SkeletonContainer>
      <SkeletonMargin variant="rect" width="200px" height="280px" />
      <SkeletonMargin variant="rect" width="200px" height="280px" />
      <SkeletonMargin variant="rect" width="200px" height="280px" />
      <SkeletonMargin variant="rect" width="200px" height="280px" />
      <SkeletonMargin variant="rect" width="200px" height="280px" />
    </SkeletonContainer>
  );
};

export const SimilarFetch = ({ id }) => {
  const classes = useStyles();
  const { data, loading, error } = useQuery(GET_SIMILAR_MOVIES, {
    variables: { tmdbId: id },
  });
  return (
    <>
      <Container>
        <Typography variant="h4" component="h4" className={classes.root}>
          Similar movies
        </Typography>
        <MovieContainer>
          {loading || error ? <ScrollBarLoader /> : <ScrollBar movies={data.similarMovies} />}
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
