import React, { useReducer, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';
import { useQuery } from '@apollo/react-hooks';
import { GET_CONFIG } from '../../../gql';
import { getUserFromCache } from '../../../../apollo';
import { reducer } from './reducer';
import { getOptions } from './helper';
import { prisma_endpoint } from '../../../../constants/route';

const useForminput = init => {
  const [value, setValue] = useState(init);
  const onChange = e => {
    setValue(e.target.value);
  };
  return { value, onChange, setValue };
};
const initState = {
  urlFeilmelding: ' ',
  apiFeilmelding: ' ',
  folderFeilmelding: ' ',
};

export default function RadarrDialog({ dialog, flash }) {
  const { onClose, title } = dialog;
  const [state, dispatch] = useReducer(reducer, initState);
  const [test, setTest] = useState(false);
  const [connection, setConnection] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(undefined);
  const [success, setSuccess] = useState(undefined);
  const user = getUserFromCache();
  const radarrUrl = useForminput('');
  const radarrApi = useForminput('');
  const radarrFolder = useForminput('');
  const { data } = useQuery(GET_CONFIG);
  const { urlFeilmelding, apiFeilmelding, folderFeilmelding } = state;
  useEffect(() => {
    if (data && data.configuration) {
      radarrUrl.setValue(data.configuration.radarrEndpoint);
      radarrApi.setValue(data.configuration.radarrApiKey);
      radarrFolder.setValue(data.configuration.radarrRootFolder);
    }
  }, [data]);
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
      setTest(false);
      fetch(state.uri.href, { method: 'HEAD' })
        .then(res => {
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
      const options = getOptions(user, state);
      fetch(prisma_endpoint, options)
        .then(res => res.json())
        .then(json => {
          setLoading(false);
          if (json.errors && json.errors.length > 0) {
            setError('An error has occoured');
            setTimeout(() => {
              setError(false);
            }, 5000);
          } else {
            setSuccess(true);
            onClose();
            flash('Radarr settings saved');
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
          <DialogContentText>Enable your radarr endpoint for requesting movies </DialogContentText>
          <DialogContentText>For changes to take effect, restart the app.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            error={urlFeilmelding && urlFeilmelding.length > 1}
            id="radarrUrl"
            name="url"
            label="Radarr Url"
            type="radarrUrl"
            helperText={urlFeilmelding}
            fullWidth
            value={radarrUrl.value}
            onChange={radarrUrl.onChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="radarrAPI"
            error={apiFeilmelding && apiFeilmelding.length > 1}
            name="api"
            label="Radarr Api key"
            helperText={apiFeilmelding}
            type="radarrAPI"
            fullWidth
            value={radarrApi.value}
            onChange={radarrApi.onChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="radarrFolder"
            error={folderFeilmelding && folderFeilmelding.length > 1}
            helperText={folderFeilmelding}
            name="folder"
            label="Radarr root folder"
            type="radarrFolder"
            fullWidth
            value={radarrFolder.value}
            onChange={radarrFolder.onChange}
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
