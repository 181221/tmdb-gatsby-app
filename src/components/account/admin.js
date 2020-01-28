/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useReducer, useEffect } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useApolloClient } from 'react-apollo-hooks';
import { query } from '../gql';
import { prisma_endpoint } from '../../constants/route';
import { reducer } from './reducer';
import { getOptions } from './helper';
import FlashMessage from '../flash';
import FormDialog from './forms/formDialog';
import RadarrDialog from './forms/radarr/radarr';

const Container = styled.div`
  margin: 0 10%;
  margin-top: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;
const Input = styled.input`
  font-size: 24px;
  padding: 10px;
  border-radius: 3px;
  margin: 10px;
  width: 70%;
  border: '1px solid #ccc';
`;

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = ({ target }) => {
    setValue(target.value);
  };

  return {
    value,
    onChange: handleChange,
  };
};

const useDialog = init => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(init);

  const onClick = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  return {
    open,
    onClick,
    onClose,
    title,
    setTitle,
  };
};

const SettingsAdmin = () => {
  const client = useApolloClient();
  const data = client.readQuery({ query });
  const { user } = data;
  const radarrUrl = useFormInput('');
  const pushover = useFormInput('');
  const name = useFormInput(user.name);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(undefined);
  const [success, setSuccess] = useState(undefined);
  const [error, setError] = useState(false);
  const [state, dispatch] = useReducer(reducer, '');
  const { isValid, radarrUrlFeilmelding, pushoverFeilmelding, nameFeilmelding } = state;
  const radarrDialog = useDialog('Radarr');
  const handleChange = e => {
    setChecked(e.target.checked);
  };

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
  }, [isValid]);

  return (
    <>
      <Container>
        <FormDialog dialog={radarrDialog}>
          <RadarrDialog dialog={radarrDialog} />
        </FormDialog>
        {error && <FlashMessage error={error} />}
        {success && <FlashMessage success={success} message="update complete" />}
        <Typography variant="h4" component="h4">
          Account page
        </Typography>
        <Form onSubmit={handleSubmit}>
          <label htmlFor="radarrUrl">
            <Typography
              variant="body1"
              component="p"
              style={{ fontWeight: 'bold', marginLeft: '10px' }}
            >
              RadarrUrl
            </Typography>
            <Input
              id="radarrUrl"
              name="radarrUrl"
              placeholder="http://localhost:7878/api"
              type="text"
              {...radarrUrl}
            />
            {radarrUrlFeilmelding && (
              <Typography
                variant="body1"
                component="p"
                style={{ color: 'red', marginLeft: '10px' }}
              >
                {radarrUrlFeilmelding}
              </Typography>
            )}
          </label>
          <label htmlFor="pushOver">
            <Typography
              variant="body1"
              component="p"
              style={{ fontWeight: 'bold', marginLeft: '10px' }}
            >
              Pushover
            </Typography>
            <Input
              id="pushover"
              name="pushover"
              placeholder="https://api.pushover.net/1/messages.json"
              type="text"
              {...pushover}
            />
            {pushoverFeilmelding && (
              <Typography
                variant="body1"
                component="p"
                style={{ color: 'red', marginLeft: '10px' }}
              >
                {pushoverFeilmelding}
              </Typography>
            )}
          </label>
          <label htmlFor="name">
            <Typography
              variant="body1"
              component="p"
              style={{ fontWeight: 'bold', marginLeft: '10px' }}
            >
              Nickname
            </Typography>
            <Input id="name" name="name" placeholder="Morpheus" type="text" {...name} />
            {nameFeilmelding && (
              <Typography
                variant="body1"
                component="p"
                style={{ color: 'red', marginLeft: '10px' }}
              >
                {nameFeilmelding}
              </Typography>
            )}
          </label>
          <FormControlLabel
            style={{ marginLeft: '10px' }}
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
          <Input type="submit" value="Submit" name="submit" />
        </Form>
      </Container>
    </>
  );
};
export default SettingsAdmin;