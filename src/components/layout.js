import React from 'react';
import { createGlobalStyle } from 'styled-components';
import ButtonAppBar from './navbar/nav';

const GlobalStyle = createGlobalStyle`
  body {
    color: ${props => (props.theme === 'purple' ? 'purple' : 'white')};
    margin: 0;
    background: -webkit-gradient(linear, left top, right top, from(#2c3e50), to(#243b55)); 
    background: -o-linear-gradient(left, #2c3e50, #243b55);  
    background: linear-gradient(to right, #2c3e50, #243b55);
  }
`;
export default ({ children }) => {
  return (
    <>
      <GlobalStyle theme="white" />
      <ButtonAppBar />
      {children}
    </>
  );
};
