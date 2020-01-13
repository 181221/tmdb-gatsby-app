import React from 'react';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    color: ${props => (props.theme === 'purple' ? 'purple' : 'white')};
    margin: 0;
    background: linear-gradient(to right,#2C3E50, #243B55);
    

  }
`;
export default ({ children }) => (
  <>
    <GlobalStyle theme="white" />
    {children}
  </>
);
