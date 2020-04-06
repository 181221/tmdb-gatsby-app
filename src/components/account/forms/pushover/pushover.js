/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useReducer, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';
import { useQuery } from '@apollo/react-hooks';
import { GET_CONFIG } from '../../../gql';
import { getOptions } from './helper';
import { getUserFromCache } from '../../../../apollo';

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
      return { ...state, url: el.value, urlFeilmelding: ' ', urlIsValid: true };
    }
    case 'api': {
      if (!el.value) {
        return { ...state, apiFeilmelding: 'api cannot be empty', apiIsValid: false };
      }
      return {
        ...state,
        apiFeilmelding: ' ',
        api: el.value,
        apiIsValid: true,
      };
    }
    case 'key': {
      if (!el.value) {
        return { ...state, keyFeilmelding: 'key cannot be empty', keyIsValid: false };
      }
      return { ...state, keyFeilmelding: ' ', key: el.value, keyIsValid: true };
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
      return { ...state, isValid };
    }
    case 'submit': {
      const isValid = state.urlIsValid && state.apiIsValid && state.apiIsValid;
      if (isValid) {
        console.log('shit is valid', state);
        return { ...state, isValid: true };
      }
      return { ...state, isValid };
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
const initState = {
  urlFeilmelding: ' ',
  keyFeilmelding: ' ',
  apiFeilmelding: ' ',
};
export default function PushoverDialog({ dialog, flash }) {
  const { onClose, title } = dialog;
  const [state, dispatch] = useReducer(reducer, initState);
  const [error, setError] = useState(undefined);
  const [success, setSuccess] = useState(undefined);
  const [test, setTest] = useState(false);
  const [connection, setConnection] = useState(undefined);
  const { urlFeilmelding, apiFeilmelding, keyFeilmelding } = state;
  const user = getUserFromCache();

  const api = useForminput('');
  const userKey = useForminput('');
  const pushoverEndpoint = useForminput('https://api.pushover.net/1/messages.json');

  const { data } = useQuery(GET_CONFIG);

  useEffect(() => {
    if (data && data.configuration) {
      api.setValue(data.configuration.pushoverApiKey);
      userKey.setValue(data.configuration.pushoverUserKey);
      pushoverEndpoint.setValue(data.configuration.pushoverEndpoint);
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
      <form onSubmit={handleSubmit}>
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enable your pushover to get notified when users request movies
          </DialogContentText>
          <DialogContentText>For changes to take effect, restart the app.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            error={urlFeilmelding && urlFeilmelding.length > 1}
            id="pushoverUrl"
            name="url"
            label="Pushover Url"
            type="pushoverUrl"
            helperText={urlFeilmelding}
            fullWidth
            value={pushoverEndpoint.value}
            onChange={pushoverEndpoint.onChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="pushoverAPI"
            error={apiFeilmelding && apiFeilmelding.length > 1}
            name="api"
            label="Pushover Api key"
            helperText={apiFeilmelding}
            type="pushoverAPI"
            fullWidth
            value={api.value}
            onChange={api.onChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="pushoverUserKey"
            error={keyFeilmelding && keyFeilmelding.length > 1}
            name="key"
            label="Pushover user key"
            helperText={keyFeilmelding}
            type="pushoverUserKey"
            fullWidth
            value={userKey.value}
            onChange={userKey.onChange}
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
