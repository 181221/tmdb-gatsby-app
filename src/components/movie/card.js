import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import { makeStyles } from '@material-ui/core/styles';
import { account_movie } from '../../constants/route';

export const gen = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

const useStyles = makeStyles({
  root: { maxHeight: '50px', overflow: 'hidden' },
  genres: {
    maxHeight: '24px',
    overflow: 'hidden',
  },
});

export const MovieBlock = styled.div`
  width: 350px;
  position: relative;
`;
const MoviePoster = styled.div`
  min-height: 300px;
  align-items: center;
  margin: 0 20px;
  justify-content: center;
`;
const Image = styled(Img)`
  box-shadow: rgba(0, 0, 0, 0.4) 0px 12px 40px -5px;
  box-sizing: border-box;
  border-radius: 10px;
`;
const Div = styled.div`
  max-height: 75px;
  min-height: 75px;
  margin-bottom: 48px;
`;
const Card = ({
  img,
  title,
  genres,
  id,
  vote_average,
  overview,
  release_date,
  posterUrl,
  similar,
}) => {
  const classes = useStyles();

  return (
    <>
      <MovieBlock>
        <MoviePoster>
          <Link
            to={`${account_movie}/${id}`}
            state={{
              img,
              title,
              genres,
              id,
              vote_average,
              overview,
              release_date,
              posterUrl,
              similar,
            }}
          >
            <Image fixed={img} />
          </Link>
          <Div>
            <Typography
              style={{ maxHeight: '48px' }}
              variant="h4"
              component="h4"
              align="center"
              className={classes.root}
            >
              {title}
            </Typography>
            <div style={{ minHeight: '24px', maxHeight: '24px' }}>
              <Typography variant="body1" component="p" align="center" className={classes.genres}>
                {genres.map((el, index) =>
                  genres.length - 1 === index ? `${gen[el]}` : `${gen[el]}, `,
                )}
              </Typography>
            </div>
          </Div>
        </MoviePoster>
      </MovieBlock>
    </>
  );
};

export default Card;
