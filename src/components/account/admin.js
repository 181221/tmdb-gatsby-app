/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useReducer, useEffect } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { prisma_endpoint } from '../../constants/route';
import { reducer } from './reducer';
import { apolloFetch } from '../../utils/handleRequest';
import { updateUserQuery } from '../gql';
import { getOptions } from './helper';

const Container = styled.div`
  width: 50%;
  margin: auto;
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
  width: 100%;
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

const handleRequest = async options => {
  const res = await fetch(prisma_endpoint, options);
  const json = await res.json();
  console.log('json', json);
};

const SettingsAdmin = ({ user }) => {
  const radarrUrl = useFormInput('');
  const pushOver = useFormInput('');
  const nickname = useFormInput('');
  const [checked, setChecked] = useState(false);

  const [state, dispatch] = useReducer(reducer, '');
  const { isValid, radarrUrlFeilmelding, pushOverFeilmelding, nicknameFeilmelding } = state;

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
    console.log('getting ops');
    const options = getOptions(user, state);
    console.log('options ops', options);
    fetch(prisma_endpoint, options)
      .then(res => res.json())
      .then(json => console.log('json', json));
    console.log(options);
    //handleRequest(options);
  };
  useEffect(() => {
    console.log('useEffect', isValid);
    if (isValid) {
      console.log('form is valid');
      // submit form;
    }
  }, [isValid]);

  return (
    <Container>
      {typeof isValid !== 'undefined' && !isValid && (
        <div style={{ color: 'red' }}>form is not valid</div>
      )}
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
            placeholder="Your radarr endpoint: http://localhost:7878/api"
            type="text"
            {...radarrUrl}
          />
          {radarrUrlFeilmelding && (
            <Typography variant="body1" component="p" style={{ color: 'red', marginLeft: '10px' }}>
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
            pushOver
          </Typography>
          <Input
            id="pushOver"
            name="pushOver"
            placeholder="Your pushover endpoint: https://api.pushover.net/1/messages.json"
            type="text"
            {...pushOver}
          />
          {pushOverFeilmelding && (
            <Typography variant="body1" component="p" style={{ color: 'red', marginLeft: '10px' }}>
              {pushOverFeilmelding}
            </Typography>
          )}
        </label>
        <label htmlFor="nickname">
          <Typography
            variant="body1"
            component="p"
            style={{ fontWeight: 'bold', marginLeft: '10px' }}
          >
            Nick
          </Typography>
          <Input id="nickname" name="nickname" placeholder="Morpheus" type="text" {...nickname} />
          {nicknameFeilmelding && (
            <Typography variant="body1" component="p" style={{ color: 'red', marginLeft: '10px' }}>
              {nicknameFeilmelding}
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
  );
};
export default SettingsAdmin;
