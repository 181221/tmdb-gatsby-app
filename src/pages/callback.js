import React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';

import { handleAuthentication } from '../utils/auth/auth';

const BackgroundContainer = styled.div`
  background-size: cover;
  background-position: center;
  height: 91vh;
  text-align: center;
`;

const Callback = () => {
  handleAuthentication();

  return (
    <BackgroundContainer>
      <CircularProgress style={{ position: 'absolute', top: '50%' }} />
    </BackgroundContainer>
  );
};

export default Callback;
