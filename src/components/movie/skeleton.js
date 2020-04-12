import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { MovieContainer, ImageSection, InformationSection } from './movie-styles';
import { ScrollBarLoader } from './similar/similar';

const useStyles = makeStyles({
  root: { padding: '24px 10% 0 10%' },
});

const MovieSkeleton = () => {
  const classes = useStyles();

  return (
    <>
      <MovieContainer>
        <ImageSection>
          <Skeleton variant="rect" width={300} height={450} />
        </ImageSection>
        <InformationSection>
          <Skeleton variant="text" width={400} height={100} />
          <Skeleton width={50} height={50} />
          <Skeleton width={50} height={50} />
          <Skeleton width={400} height={300} />
        </InformationSection>
      </MovieContainer>
      <Typography variant="h4" component="h4" className={classes.root}>
        Similar movies
      </Typography>
      <ScrollBarLoader />
    </>
  );
};
export default MovieSkeleton;
