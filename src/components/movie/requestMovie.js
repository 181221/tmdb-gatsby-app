import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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
const Test = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress color="secondary" />
      <Typography variant="body1" component="p" style={{ margin: 'auto', marginLeft: '10px' }}>
        Getting information
      </Typography>
    </div>
  );
};
const RequestMovie = ({ handleMovieRequest, click }) => {
  const classes = useStyles();
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
