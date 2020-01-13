import React, { useState } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Link } from 'gatsby';
import Skeleton from '@material-ui/lab/Skeleton';
import { img_tmdb, account_movie } from '../constants/route';

const Container = styled.div`
  width: 80%;
  margin: auto;
`;

const ImageFetch = styled.img`
  box-shadow: rgba(0, 0, 0, 0.4) 0px 12px 40px -5px;
  box-sizing: border-box;
  border-radius: 10px;
  width: 200px;
  height: 280px;
  margin: 12px 12px;
  display: ${props => props.loading && 'none'};
`;
const SkeletonImg = styled(Skeleton)`
  margin: 12px 12px;
  display: ${props => !props.loading && 'none'};
`;
const MovieContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
const ImageLoader = ({ src }) => {
  const [loading, setLoading] = useState(true);
  const onLoad = () => {
    setLoading(false);
  };
  return (
    <>
      <ImageFetch src={src} onLoad={onLoad} loading={loading} />
      <SkeletonImg variant="rect" width={210} height={280} loading={loading} />
    </>
  );
};
const Similar = ({ movies }) => {
  if (movies.length === 0) {
    return <></>;
  }
  return (
    <>
      <Container>
        <Typography variant="h4" component="h4">
          Similar movies
        </Typography>
        <MovieContainer>
          {movies &&
            movies.map(el => {
              return (
                <Link
                  key={el.id}
                  to={`${account_movie}/${el.id}`}
                  state={{
                    id: '',
                    fetchAll: true,
                  }}
                >
                  <ImageLoader src={img_tmdb + el.poster_path} />
                </Link>
              );
            })}
        </MovieContainer>
      </Container>
    </>
  );
};
export default Similar;
