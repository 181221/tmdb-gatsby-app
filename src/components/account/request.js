import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { login, isAuthenticated } from '../../utils/auth';
import { options_getToken } from '../../utils/handleRequest';
import { prisma_endpoint } from '../../constants/route';

const Container = styled.div`
  margin: 2% 10%;
`;

const handleSimpleRequest = async (url, options, user, retry = false) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const json = await response.json();
  if (retry) {
    return json;
  }
  if (json.erros && json.errors.length > 0) {
    if (json.errors[0].message === 'jwt malformed') {
      const res = await fetch(url, options_getToken(user));
      const data = await res.json();
      const opt = options;
      opt.headers.Authorization = `Bearer ${data.data.getToken.token}`;
      return handleSimpleRequest(url, opt, user, true);
    }
    throw new Error(json.errors[0].message);
  }
  return json;
};
const Request = ({ prismaUser }) => {
  const [userMovieData, setUserMovieData] = useState(undefined);
  useEffect(() => {
    if (prismaUser) {
      const ql = `query{
          users	{
            email
            movies{
              title
              img
              tmdb_id
              genres
              vote_average
              overview
            }
          }
        }`;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${prismaUser.token}`,
        },
        body: JSON.stringify({
          query: ql,
        }),
      };
      handleSimpleRequest(prisma_endpoint, options, prismaUser.user).then(data => {
        setUserMovieData(data);
      });
    }
  }, [prismaUser, prismaUser.user, setUserMovieData]);

  if (!isAuthenticated()) {
    login();
    return <p>Redirecting to login...</p>;
  }
  if (prismaUser && prismaUser.user.role === 'ADMIN') {
    return (
      <Container>
        <Typography style={{ marginBottom: '8px' }} variant="h6" component="h6" align="left">
          All requested movies
        </Typography>
        <div>
          {userMovieData &&
            userMovieData.data.users.map(user => {
              return (
                <div key={user.email}>
                  <Typography
                    style={{ marginBottom: '8px' }}
                    variant="h6"
                    component="h6"
                    align="left"
                  >
                    {user.email}
                  </Typography>
                  {user.movies.map(el => {
                    return (
                      <Typography variant="body1" component="p" align="left">
                        <li key={el.tmdb_id}>{el.title}</li>
                      </Typography>
                    );
                  })}
                  <br />
                </div>
              );
            })}
        </div>
      </Container>
    );
  }
  return <div />;
};
export default Request;
