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
import { useMutation, useQuery } from '@apollo/react-hooks';
import { UPDATE_USER } from '../../../../graphql/gql';
import { getUserFromCache, writeToCache } from '../../../../apollo';
import { isPushSupported, getSubscription, unsubscribePush, subscribePush } from './notification';

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
        notification: el.value === 'true',
        notificationIsValid: true,
      };
    }
    case 'submit': {
      const isValid = state.nameIsValid && state.notificationIsValid;
      if (isValid) {
        return { ...state, isValid: true, nameFeilmelding: '' };
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
  const [, setSuccess] = useState(undefined);
  const user = getUserFromCache();
  const [value, setValue] = useState(user.name);
  const [checked, setChecked] = useState(user.notification);
  const [click, setClick] = useState(true);
  const onCompleted = () => {
    setSuccess(true);
    onClose();
    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };
  const [UpdateUser, { error }] = useMutation(UPDATE_USER, {
    onCompleted,
    update(cache, { data }) {
      user.name = data.updateUser.name;
      user.notification = data.updateUser.notification;
      user.subscription = data.updateUser.subscription;
      writeToCache(user);
    },
  });
  const handleChange = async e => {
    setChecked(e.target.checked);
    setClick(false);
    if (isPushSupported()) {
      if (e.target.checked) {
        const sub = await getSubscription();
        if (sub) {
          return;
        }
        const stringifySub = await subscribePush();
        UpdateUser({
          variables: {
            email: user.email,
            subscription: stringifySub,
          },
        });
      } else {
        await unsubscribePush();
        UpdateUser({
          variables: {
            email: user.email,
            subscription: '',
          },
        });
      }
    }
  };

  const handleName = e => {
    console.log('asdad', !(e.target.value !== ''));
    setClick(!(e.target.value !== ''));
    setValue(e.target.value);
  };

  const { nameFeilmelding } = state;
  const handleSubmit = e => {
    e.preventDefault();
    const elements = Array.from(e.target.elements);
    elements.forEach(el => {
      dispatch({
        type: el.name,
        el,
      });
    });
  };
  useEffect(() => {
    if (state.isValid) {
      UpdateUser({
        variables: {
          email: user.email,
          notification: state.notification,
          name: state.name,
        },
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
            value={value}
            onChange={handleName}
          />
          <FormControlLabel
            style={{ marginLeft: '0', marginTop: '20px' }}
            control={
              <Checkbox
                icon={<NotificationsOffIcon />}
                checkedIcon={<NotificationsActiveIcon />}
                checked={checked}
                onChange={handleChange}
                name="checkbox"
                value={checked}
              />
            }
            label="Notifications"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" name="submit" disabled={click}>
            Submit
          </Button>
        </DialogActions>
      </form>
    </>
  );
}
