import React, { useReducer, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Checkbox from '@material-ui/core/Checkbox';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';

import { useApolloClient } from 'react-apollo-hooks';
import { query } from '../../../gql';
import { prisma_endpoint } from '../../../../constants/route';
import { getOptions } from '../../helper';

const reducer = (state, { el, type }) => {
  switch (type) {
    case 'name': {
      if (!el.value) {
        return { ...state, nameFeilmelding: 'name cannot be empty' };
      }
      return { ...state, nameFeilmelding: '', name: el.value, nameIsValid: true };
    }
    case 'checkbox': {
      if (!el.value) {
        return { ...state, notificationFeilmelding: 'notification must be of type boolean' };
      }
      return {
        ...state,
        notificationFeilmelding: '',
        notification: el.value,
        notificationIsValid: true,
      };
    }
    case 'submit': {
      const isValid = state.nameIsValid && state.notificationIsValid;
      console.log('shit is valid', state);
      if (isValid) {
        return { ...state, isValid: true };
      }
      return null;
    }
    default: {
      return state;
    }
  }
};

export default function SettingsDialog({ dialog }) {
  const { onClose, title } = dialog;
  const [state, dispatch] = useReducer(reducer, '');
  const [loading, setLoading] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [checked, setChecked] = useState(false);
  const [success, setSuccess] = useState(undefined);
  const client = useApolloClient();
  const data = client.readQuery({ query });
  const { user } = data;

  const handleChange = e => {
    setChecked(e.target.checked);
  };

  const { nameFeilmelding, notificationFeilmelding } = state;
  const handleSubmit = e => {
    e.preventDefault();
    const elements = Array.from(e.target.elements);
    elements.forEach(el => {
      dispatch({
        type: el.name,
        el,
      });
    });
    console.log(elements);
  };
  useEffect(() => {
    console.log('isvalido', state);
    if (state.isValid) {
      setLoading(true);
      const options = getOptions(user, state);
      fetch(prisma_endpoint, options)
        .then(res => res.json())
        .then(json => {
          setLoading(false);
          console.log('json', json);
          if (json.errors && json.errors.length > 0) {
            setError(true);
          } else {
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
            }, 5000);
          }
          data.user.name = state.name;
          client.writeQuery({
            query,
            data: {
              user: data.user,
            },
          });
        });
    }
  }, [state, state.isValid]);
  return (
    <>
      {error && <Alert severity="error">an error has occoured</Alert>}
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>Change your usersettings here</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            error={nameFeilmelding && nameFeilmelding.length > 0}
            id="nickname"
            name="name"
            label="Nickname"
            type="text"
            helperText={nameFeilmelding}
            fullWidth
          />
          <FormControlLabel
            style={{ marginLeft: '0', marginTop: '20px' }}
            control={
              <Checkbox
                icon={<NotificationsOffIcon />}
                checkedIcon={<NotificationsActiveIcon />}
                value={checked}
                onChange={handleChange}
                name="checkbox"
              />
            }
            label="Notifications"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" name="submit">
            Submit
          </Button>
        </DialogActions>
      </form>
    </>
  );
}
