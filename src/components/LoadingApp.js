import React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';

const BackgroundContainer = styled.div`
  background-size: cover;
  background-position: center;
  height: 91vh;
  text-align: center;
`;
const LoadingApp = () => {
  return (
    <BackgroundContainer>
      <CircularProgress style={{ position: 'absolute', top: '50%' }} />
    </BackgroundContainer>
  );
};
export default LoadingApp;
