import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { MovieContainer, ImageSection, InformationSection } from './movie-styles';

const MovieSkeleton = () => {
  return (
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
  );
};
export default MovieSkeleton;
