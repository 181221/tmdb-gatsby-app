import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import ScrollBar from './scroll/scrollBar';

const useStyles = makeStyles(theme => ({
  root: props => ({
    backgroundColor: props.backgroundColor,
    color: theme.color,
    [theme.breakpoints.down('md')]: {
      padding: '24px 10% 0 10%',
    },
  }),
}));

const Container = styled.div`
  width: 80%;
  margin: auto;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MovieContainer = styled.div`
  margin-bottom: 60px;
`;
const Similar = ({ movies }) => {
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
export default Similar;
