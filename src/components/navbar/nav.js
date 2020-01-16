import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { logout } from '../../utils/auth';
import { useStyles } from './styles';
import { landing, account_request } from '../../constants/route';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  margin: 10px;
`;
const StyledDiv = styled.div``;

export default function ButtonAppBar({ user, admin }) {
  const classes = useStyles();
  console.log('admin');
  return (
    <StyledDiv className={classes.root}>
      <AppBar position="static" className={classes.test}>
        <Toolbar>
          <StyledLink to={landing}>
            <Typography variant="h6">Home</Typography>
          </StyledLink>
          {admin.role === 'ADMIN' && (
            <StyledLink to={account_request}>
              <Typography variant="h6">Requested</Typography>
            </StyledLink>
          )}
          <div className={classes.title} />
          <Typography variant="h6" className={classes.user}>
            {user.nickname}
          </Typography>
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
        </Toolbar>
      </AppBar>
    </StyledDiv>
  );
}
