import React from 'react';
import { Link } from 'gatsby';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { isAuthenticated, login, getProfile } from '../utils/auth';
import Layout from '../components/layout';
import { landing } from '../constants/route';
import ButtonAppBar from '../components/navbar/nav';

const StyledLink = styled(Link)`
  color: white;
  margin: 10px;
  text-align: center;
`;
export default () => {
  if (!isAuthenticated()) {
    login();
    return <p>Redirecting to login...</p>;
  }
  const user = getProfile();

  return (
    <Layout>
      <ButtonAppBar user={user} />

      <Typography variant="h4" component="h4" align="center">
        Landing page
      </Typography>
      <StyledLink to={landing}>
        <Typography variant="h6">Discover movies</Typography>
      </StyledLink>
    </Layout>
  );
};
