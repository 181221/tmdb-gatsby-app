import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { login, isAuthenticated } from '../../../utils/auth';
import { prisma_endpoint } from '../../../constants/route';
import { getOptions, handleSimpleRequest } from './requestHelper';
import { formatDate } from '../helper';
import SimpleTable from '../table';

const Container = styled.div`
  margin: 2% 10%;
  display: flex;
  margin-right: 10%;
  flex-direction: column;
`;
function createData(title, downloaded, createdAt, id) {
  return { title, downloaded, createdAt, id };
}

const Request = ({ user }) => {
  if (!isAuthenticated()) {
    login();
    return <p>Redirecting to login...</p>;
  }
  const [, setUserMovieData] = useState(undefined);
  const [newlyRequested, setNewlyRequested] = useState(undefined);
  const [, setRowsUser] = useState(undefined);
  useEffect(() => {
    if (user) {
      const options = getOptions(user, 'ALL_MOVIES');
      const newlyRequestOptions = getOptions(user, 'NEWLY_REQUESTED', 10);
      handleSimpleRequest(prisma_endpoint, options, user).then(data => {
        setRowsUser(
          data.data.users.map(prismaUser => {
            return prismaUser.movies.map(movie => {
              return createData(
                movie.title,
                movie.downloaded.toString(),
                formatDate(movie.createdAt),
                movie.tmdb_id,
              );
            });
          }),
        );
        setUserMovieData(data);
      });
      handleSimpleRequest(prisma_endpoint, newlyRequestOptions, user).then(data => {
        setNewlyRequested(
          data.data.movies.map(movie => {
            return createData(
              movie.title,
              movie.downloaded.toString(),
              formatDate(movie.createdAt),
              movie.tmdb_id,
            );
          }),
        );
      });
    }
  }, [user, setUserMovieData]);

  if (user && user.role === 'ADMIN') {
    return (
      <Container>
        <div>
          <Typography style={{ marginBottom: '8px' }} variant="h6" component="h6" align="left">
            All requested movies Comming
          </Typography>
        </div>
        <div>
          <Typography style={{ marginBottom: '8px' }} variant="h6" component="h6" align="left">
            Recently requested movies
          </Typography>
          <SimpleTable rows={newlyRequested} />
        </div>
      </Container>
    );
  }
  return <div />;
};

export default Request;
