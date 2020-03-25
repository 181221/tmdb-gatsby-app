import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import ErrorIcon from '@material-ui/icons/Error';

const Container = styled.div`
  background-size: cover;
  background-position: center;
  height: 100vh;
  text-align: center;
  color: white;
  background: -webkit-gradient(linear, left top, right top, from(#2c3e50), to(#243b55));
  background: -o-linear-gradient(left, #2c3e50, #243b55);
  background: linear-gradient(to right, #2c3e50, #243b55);
`;
const Div = styled.div`
  padding-top: 48px;
`;

const Error = () => {
  return (
    <Container>
      <Div>
        <ErrorIcon style={{ fontSize: '48px' }} />
        <Typography variant="h4" component="h4" align="center">
          Oops!, something went wrong
        </Typography>
      </Div>
    </Container>
  );
};
export default Error;
