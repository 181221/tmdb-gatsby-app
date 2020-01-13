import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import ScrollBar from '../scroll/scrollBar';

const Container = styled.div`
  width: 80%;
  margin: auto;
`;

const MovieContainer = styled.div`
  margin-bottom: 60px;
`;
const Similar = ({ movies }) => {
  if (movies && movies.length === 0) {
    return <></>;
  }
  return (
    <>
      <Container>
        <Typography variant="h4" component="h4">
          Similar movies
        </Typography>
        <MovieContainer>
          <ScrollBar movies={movies} />
        </MovieContainer>
      </Container>
    </>
  );
};
export default Similar;
