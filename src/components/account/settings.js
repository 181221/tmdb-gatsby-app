/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useReducer, useEffect } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { useApolloClient } from 'react-apollo-hooks';
import { query } from '../query';

const Container = styled.div`
  width: 50%;
  margin: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 50%;
`;
const Input = styled.input`
  margin: 10px;
`;
const reducer = (state, { el, type }) => {
  switch (type) {
    case 'radarrUrl': {
      if (!el.value) {
        return {
          ...state,
          radarrUrlFeilmelding: 'Not a valid url',
          radarrIsValid: false,
        };
      }
      return { ...state, radarrUrlFeilmelding: '', radarrIsValid: true };
    }
    case 'pushOver': {
      if (!el.value) {
        return {
          ...state,
          pushOverFeilmelding: 'key cannot be undefined',
          pushOverIsValid: false,
        };
      }
      return { ...state, pushOverFeilmelding: '', pushOverIsValid: true };
    }
    case 'SUBMIT': {
      // validate everything and submit the form
      if (state.pushOverIsValid && state.radarrIsValid) {
        console.log('form is valid');
        // form is valid and we can submit
        return { ...state, isValid: true };
      }
      // form is not valid
      console.log('form is not valid');
      return { ...state, isValid: false };
    }
    default: {
      return state;
    }
  }
};

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
  const feilmeldinger = {
    radarrUrl: '',
    pushOver: '',
  };
  const [{ isValid, radarrUrlFeilmelding, pushOverFeilmelding }, dispatch] = useReducer(
    reducer,
    feilmeldinger,
  );
  const handleSubmit = e => {
    e.preventDefault();
    const elements = Array.from(e.target.children);
    elements.forEach(el => {
      dispatch({
        type: el.name,
        el,
      });
    });
    dispatch({ type: 'SUBMIT' });
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
        <Input name="radarrUrl" placeholder="Your radarr endpoint..." type="text" {...radarrUrl} />
        {radarrUrlFeilmelding}
        <Input name="pushOver" placeholder="Your radarr endpoint..." type="text" {...pushOver} />
        {pushOverFeilmelding}
        <Input type="submit" value="Submit" />
      </Form>
    </Container>
  );
};
const SettingsUser = ({ user }) => {
  return <div>Settings for customer</div>;
};

const Settings = () => {
  const client = useApolloClient();
  const data = client.readQuery({ query });
  if (data) {
    if (data.user.role === 'ADMIN') {
      return <SettingsAdmin user={data.user} />;
    }
    return <SettingsUser user={data.use} />;
  }
  return <></>;
};

export default Settings;
