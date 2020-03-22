/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useReducer, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useApolloClient } from 'react-apollo-hooks';
import Alert from '@material-ui/lab/Alert';
import { getOptions, getOptionsRead } from './helper';
import { query } from '../../../gql';

const reducer = (state, { el, type }) => {
  switch (type) {
    case 'url': {
      const regex = /^(http|https):\/\/[0-9a-zA-Z.-:/]*/gm;
      if (el.value.match(regex) === null) {
        return {
          ...state,
          urlFeilmelding: 'Not a valid url',
          urlIsValid: false,
        };
      }
      return { ...state, url: el.value, urlFeilmelding: '', urlIsValid: true };
    }
    case 'api': {
      if (!el.value) {
        return { ...state, apiFeilmelding: 'api cannot be empty', apiIsValid: false };
      }
      return {
        ...state,
        apiFeilmelding: '',
        api: el.value,
        apiIsValid: true,
      };
    }
    case 'key': {
      if (!el.value) {
        return { ...state, keyFeilmelding: 'key cannot be empty', keyIsValid: false };
      }
      return { ...state, keyFeilmelding: '', key: el.value, keyIsValid: true };
    }
    case 'test': {
      const isValid = state.urlIsValid && state.apiIsValid && state.apiIsValid;
      if (isValid && el) {
        let uri;
        try {
          uri = new URL(`${state.url}`);
        } catch (error) {
          return { ...state, error: true, errorMessage: error };
        }
        return { ...state, uri };
      }
      return state;
    }
    case 'submit': {
      const isValid = state.urlIsValid && state.apiIsValid && state.apiIsValid;
      if (isValid) {
        console.log('shit is valid', state);
        return { ...state, isValid: true };
      }
      return state;
    }
    default: {
      return state;
    }
  }
};
const useForminput = init => {
  const [value, setValue] = useState(init);
  const onChange = e => {
    setValue(e.target.value);
  };
  return { value, onChange, setValue };
};

export default function PushoverDialog({ dialog, flash }) {
  const { onClose, title } = dialog;
  const [state, dispatch] = useReducer(reducer, '');
  const [loading, setLoading] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [success, setSuccess] = useState(undefined);
  const [test, setTest] = useState(false);
  const [connection, setConnection] = useState(undefined);
  const { urlFeilmelding, apiFeilmelding, keyFeilmelding } = state;
  const client = useApolloClient();
  const data = client.readQuery({ query });
  const { user } = data;

  const api = useForminput('');
  const userKey = useForminput('');
  const pushoverEndpoint = useForminput('https://api.pushover.net/1/messages.json');

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
    const options = getOptionsRead(user, state);
    fetch(process.env.PRISMA_ENDPOINT, options)
      .then(res => res.json())
      .then(json => {
        const jsonData = json.data.configurationPrivate;
        if (jsonData) {
          api.setValue(jsonData.pushoverApiKey);
          userKey.setValue(jsonData.pushoverUserKey);
          if (jsonData.pushoverEndpoint) {
            pushoverEndpoint.setValue(jsonData.pushoverEndpoint);
          }
        }
      });
  }, []);
  useEffect(() => {
    console.log('statepushover', state);
    if (test && state.uri) {
      const endpoint = state.uri.href;
      const obj = {
        token: state.api,
        user: state.key,
      };
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      };
      fetch(endpoint, options).then(res => {
        if (res.status === 200) {
          setConnection(true);
          setTimeout(() => {
            setConnection(false);
          }, 5000);
        } else {
          setConnection(false);
          setError('Could not connect to pushover');
          setTimeout(() => {
            setError(false);
          }, 3000);
        }
      });
    }
    if (!test && state.isValid) {
      const options = getOptions(user, state);
      fetch(process.env.PRISMA_ENDPOINT, options)
        .then(res => {
          if (res.ok) {
            setSuccess('config added');
            setTimeout(() => {
              setSuccess(false);
            }, 4000);
            onClose();
            flash('Pushover settings saved, restart app for changes to take effect');
          }
          res.json();
        })
        .then(json => {
          console.log('json', json);
        })
        .catch(err => console.error(err));
    }
    return () => {
      setTest(false);
    };
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
            Enable your pushover to get notified when users request movies
            <DialogContentText>For changes to take effect, restart the app.</DialogContentText>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            error={urlFeilmelding && urlFeilmelding.length > 0}
            id="pushoverUrl"
            name="url"
            label="Pushover Url"
            type="pushoverUrl"
            helperText={urlFeilmelding}
            fullWidth
            {...pushoverEndpoint}
          />
          <TextField
            autoFocus
            margin="dense"
            id="pushoverAPI"
            error={apiFeilmelding && apiFeilmelding.length > 0}
            name="api"
            label="Pushover Api key"
            helperText={apiFeilmelding}
            type="pushoverAPI"
            fullWidth
            {...api}
          />
          <TextField
            autoFocus
            margin="dense"
            id="pushoverUserKey"
            error={keyFeilmelding && keyFeilmelding.length > 0}
            name="key"
            label="Pushover user key"
            helperText={keyFeilmelding}
            type="pushoverUserKey"
            fullWidth
            {...userKey}
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