import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation } from '@apollo/react-hooks';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { CREATE_MOVIE, GET_IN_RADARR_COLLECTION } from '../../graphql/gql';

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #e4637f 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    boxShadow: '0 0px 1px 1px rgba(255, 105, 135, .3)',
  },
  white: {
    color: 'white',
  },
  disabled: {
    '&$disabled': {
      cursor: 'not-allowed',
      pointerEvents: 'all',
    },
    goBack: {
      paddingTop: '10px',
    },
  },
});
const RequestMovie = ({ setCreated, movie, click, setClick }) => {
  const classes = useStyles();
  const onCompleted = () => {
    setCreated(true);
    setClick(true);
  };

  const [createMovie, { error, loading, data: movieData }] = useMutation(CREATE_MOVIE, {
    onCompleted,
    update(cache, { data }) {
      console.log('datacache', data);
      /*
      const movieInCollection = cache.readQuery({
        query: GET_IN_RADARR_COLLECTION,
        variables: { tmdbId: movie.tmdbId },
      });
      movieInCollection.radarrCollection.isRequested = true;
      cache.writeQuery({
        query: GET_IN_RADARR_COLLECTION,
        data: { ...movieInCollection },
      });
      */
    },
  });

  const handleMovieRequest = () => {
    console.log('movieData', movieData);
    const { title, img, tmdbId, overview, year, genres, voteAverage, voteCount } = movie;
    createMovie({
      variables: {
        title,
        img: img.src ? img.src : img,
        tmdbId,
        genres,
        voteAverage,
        year,
        overview,
        voteCount,
      },
    });
  };

  return (
    <>
      <div className={`${click && classes.disabled}`}>
        <Button
          onClick={handleMovieRequest}
          disabled={typeof click === 'undefined' ? true : click}
          className={`${classes.root} ${click && classes.disabled}`}
          style={{ minWidth: '70%' }}
        >
          <Typography className={`${!click && classes.white}`} variant="body1" component="p">
            Request Movie
          </Typography>
        </Button>
      </div>
    </>
  );
};
export default RequestMovie;
