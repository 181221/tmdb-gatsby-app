import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles({
  root: { marginBottom: '24px' },
});

export const FlashContainer = styled.div`
  margin: 0 10%;
  @media (max-width: 768px) {
    width: 80%;
  }
`;
const sucessMessage = 'This movie was successfully requested!';
const FlashMessage = ({
  error,
  success,
  hasFile,
  downloaded,
  inRadarrCollection,
  message = sucessMessage,
  movieStatus,
}) => {
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();
  return (
    <>
      {error && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error.message ? error.message : 'There was an error'}
        </Alert>
      )}
      {success && (
        <Alert severity="success" className={classes.root}>
          <AlertTitle>Success</AlertTitle>
          {message}
        </Alert>
      )}
      {hasFile && (
        <Alert severity="info" className={classes.root}>
          <AlertTitle>File on server</AlertTitle>
          This movie is already on server
        </Alert>
      )}
      {!hasFile && downloaded && (
        <Alert severity="info" className={classes.root}>
          <AlertTitle>Movie is downloaded</AlertTitle>
          This movie is already on server
        </Alert>
      )}

      {!hasFile && inRadarrCollection && (
        <Collapse in={open} className={classes.root}>
          <Alert
            severity="info"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <InfoBox movieStatus={movieStatus} />
          </Alert>
        </Collapse>
      )}
    </>
  );
};

const InfoBox = ({ movieStatus }) => {
  if (movieStatus) {
    return (
      <>
        <AlertTitle>Movie is beeing downloaded</AlertTitle>
        Time left {movieStatus.timeleft}
      </>
    );
  }
  return (
    <>
      <AlertTitle>Movie is requested</AlertTitle>
      This movie is awaiting confirmation from an admin
    </>
  );
};

export default FlashMessage;
