import React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';

const BackgroundContainer = styled.div`
  background-size: cover;
  background-position: center;
  height: 100vh;
  text-align: center;
  background: -webkit-gradient(linear, left top, right top, from(#2c3e50), to(#243b55));
  background: -o-linear-gradient(left, #2c3e50, #243b55);
  background: linear-gradient(to right, #2c3e50, #243b55);
`;
const LoadingApp = () => {
  return (
    <BackgroundContainer>
      <CircularProgress style={{ position: 'absolute', top: '50%' }} />
    </BackgroundContainer>
  );
};
export default LoadingApp;
