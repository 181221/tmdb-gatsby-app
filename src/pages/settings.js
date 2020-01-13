import React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { isAuthenticated, login, getProfile } from '../utils/auth';
import ButtonAppBar from '../components/navbar/nav';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

const Settings = () => {
  if (!isAuthenticated()) {
    login();
    return <p>Redirecting to login...</p>;
  }
  const classes = useStyles();

  const user = getProfile();
  return (
    <>
      <ButtonAppBar user={user} />
      <Typography variant="h4" component="h4" align="center">
        Settings
      </Typography>
      <Typography variant="h5" component="h5" align="center">
        Pushover
      </Typography>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField color="secondary" id="standard-multiline-flexible" label="Api key" />
      </form>
    </>
  );
};

export default Settings;
