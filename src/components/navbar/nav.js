import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { useApolloClient } from 'react-apollo-hooks';
import { logout, login, isAuthenticated } from '../../utils/auth/auth';
import { useStyles } from './styles';
import { landing, account_settings } from '../../constants/route';

import { query } from '../query';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  margin: 10px;
`;
const StyledDiv = styled.div``;

export default function ButtonAppBar() {
  const classes = useStyles();

  const client = useApolloClient();
  const data = client.readQuery({ query });
  const { user } = data;
  return (
    <StyledDiv className={classes.root}>
      <AppBar position="static" className={classes.test}>
        <Toolbar>
          <StyledLink to={landing}>
            <Typography variant="h6">Home</Typography>
          </StyledLink>
          <StyledLink to={account_settings}>
            <Typography variant="h6">Settings</Typography>
          </StyledLink>
          <div className={classes.title} />
          <Typography variant="h6" className={classes.user}>
            {user.name}
          </Typography>
          {isAuthenticated() ? (
            <Button
              href="#logout"
              onClick={e => {
                logout();
                e.preventDefault();
              }}
              color="inherit"
              style={{ textDecoration: 'underline' }}
            >
              <Typography variant="body1" component="p">
                Logout
              </Typography>
            </Button>
          ) : (
            <Button
              href="#login"
              onClick={e => {
                login();
                e.preventDefault();
              }}
              color="inherit"
              style={{ textDecoration: 'underline' }}
            >
              <Typography variant="body1" component="p">
                login
              </Typography>
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </StyledDiv>
  );
}
