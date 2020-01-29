import React, { useReducer, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';
import { useApolloClient } from 'react-apollo-hooks';
import { query } from '../../../gql';
import { reducer } from './reducer';
import { getOptions } from './helper';
import { prisma_endpoint } from '../../../../constants/route';

export default function RadarrDialog({ dialog }) {
  const { onClose, title } = dialog;
  const [state, dispatch] = useReducer(reducer, '');
  const [test, setTest] = useState(false);
  const [connection, setConnection] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(undefined);
  const [success, setSuccess] = useState(undefined);
  const client = useApolloClient();
  const data = client.readQuery({ query });
  const { user } = data;

  const { urlFeilmelding, apiFeilmelding, folderFeilmelding } = state;
  const handleSubmit = e => {
    e.preventDefault();
    const elements = Array.from(e.target.elements);
    elements.forEach(el => {
      dispatch({
        type: el.name,
        el,
      });
    });
    if (test) {
      const payload = {
        url: state.url,
        key: state.api,
      };
      dispatch({
        type: 'test',
        el: payload,
      });
    }
  };
  useEffect(() => {
    if (test && state.uri) {
      fetch(state.uri.href, { method: 'HEAD' })
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            setConnection(true);
            setError(false);
            setTimeout(() => {
              setConnection(false);
            }, 5000);
          } else {
            setConnection(false);
          }
        })
        .catch(err => {
          console.log('error', err.toString());
          setError('Failed to connect to service');
        });
    }
    if (!test && state.isValid) {
      console.log('time to submit');
      const options = getOptions(user, state);
      console.log('got someoptions', options);
      fetch(prisma_endpoint, options)
        .then(res => res.json())
        .then(json => {
          setLoading(false);
          console.log('json', json);
          if (json.errors && json.errors.length > 0) {
            setError('An error has occoured');
            setTimeout(() => {
              setError(false);
            }, 5000);
          } else {
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
            }, 5000);
          }
        });
      return () => {
        setTest(false);
      };
    }
  }, [state]);
  const handleConnection = () => {
    setTest(true);
  };
  return (
    <>
      {success && <Alert severity="success">Configurations successfully saved</Alert>}
      {connection && <Alert severity="success">The connection was successfully established</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Enable your radarr endpoint for requesting movies
            <DialogContentText>For changes to take effect, restart the app.</DialogContentText>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            error={urlFeilmelding && urlFeilmelding.length > 0}
            id="radarrUrl"
            name="url"
            label="Radarr Url"
            type="radarrUrl"
            helperText={urlFeilmelding}
            fullWidth
            value={process.env.RADARR_API_ENDPOINT}
          />
          <TextField
            autoFocus
            margin="dense"
            id="radarrAPI"
            error={apiFeilmelding && apiFeilmelding.length > 0}
            name="api"
            label="Radarr Api key"
            helperText={apiFeilmelding}
            type="radarrAPI"
            fullWidth
            value={process.env.RADARR_API_KEY}
          />
          <TextField
            autoFocus
            margin="dense"
            id="radarrFolder"
            error={folderFeilmelding && folderFeilmelding.length > 0}
            helperText={folderFeilmelding}
            name="folder"
            label="Radarr root folder"
            type="radarrFolder"
            fullWidth
            value={process.env.RADARR_ROOT_FOLDER_PATH}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConnection} type="submit" color="primary">
            Test
          </Button>
          <Button type="submit" name="submit" color="primary">
            Submit
          </Button>
        </DialogActions>
      </form>
    </>
  );
}
