/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useReducer, useEffect } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { reducer } from './reducer';

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

const SettingsAdmin = ({ user }) => {
  const radarrUrl = useFormInput('');
  const pushOver = useFormInput('');
  const nickname = useFormInput('');

  const feilmeldinger = {
    radarrUrl: '',
    pushOver: '',
    nickname: '',
  };
  const [
    { isValid, radarrUrlFeilmelding, pushOverFeilmelding, nicknameFeilmelding },
    dispatch,
  ] = useReducer(reducer, feilmeldinger);

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
    if (isValid) {
      console.log('form is valid');
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
        <Input type="submit" value="Submit" />
      </Form>
    </Container>
  );
};
export default SettingsAdmin;
