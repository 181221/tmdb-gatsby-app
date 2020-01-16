import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { login, isAuthenticated } from '../../../utils/auth';
import { prisma_endpoint } from '../../../constants/route';
import { getOptions, handleSimpleRequest } from './requestHelper';
import formatDate from '../helper';

const Container = styled.div`
  margin: 2% 10%;
  display: flex;
`;

const Request = ({ prismaUser }) => {
  if (!isAuthenticated()) {
    login();
    return <p>Redirecting to login...</p>;
  }
  const [userMovieData, setUserMovieData] = useState(undefined);
  const [newlyRequested, setNewlyRequested] = useState(undefined);
  useEffect(() => {
    if (prismaUser) {
      const options = getOptions(prismaUser, 'ALL_MOVIES');
      const newlyRequestOptions = getOptions(prismaUser, 'NEWLY_REQUESTED', 10);
      handleSimpleRequest(prisma_endpoint, options, prismaUser.user).then(data => {
        setUserMovieData(data);
      });
      handleSimpleRequest(prisma_endpoint, newlyRequestOptions, prismaUser.user).then(data => {
        setNewlyRequested(data);
      });
    }
  }, [prismaUser, prismaUser.user, setUserMovieData]);

  if (prismaUser && prismaUser.user.role === 'ADMIN') {
    return (
      <Container>
        <div>
          <Typography style={{ marginBottom: '8px' }} variant="h6" component="h6" align="left">
            All requested movies
          </Typography>
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
        <div>
          <Typography style={{ marginBottom: '8px' }} variant="h6" component="h6" align="left">
            Recently requested movies
          </Typography>

          {newlyRequested &&
            newlyRequested.data.movies.map(movie => {
              return (
                <Typography variant="body1" component="p" align="left">
                  <li key={movie.tmdb_id}>
                    {movie.title} &nbsp;- &nbsp; {formatDate(movie.createdAt)}
                  </li>
                </Typography>
              );
            })}
        </div>
      </Container>
    );
  }
  return <div />;
};

export default Request;
