import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import SimpleTable from '../table';
import { formatDate } from '../helper';

const Container = styled.div`
  width: 50%;
  margin: auto;
`;

function createData(title, downloaded, createdAt, id) {
  return { title, downloaded, createdAt, id };
}

const MyRequestedMovies = ({ prismaUser }) => {
  const [rows, setRows] = useState(undefined);
  console.log(prismaUser);
  useEffect(() => {
    if (prismaUser) {
      setRows(
        prismaUser.user.movies.map(movie => {
          return createData(
            movie.title,
            movie.downloaded.toString(),
            formatDate(movie.createdAt),
            movie.id,
          );
        }),
      );
    }
  }, [prismaUser]);

  return (
    <Container>
      <Typography style={{ margin: '12px' }} variant="h6" component="h6" align="left">
        My Requested movies
      </Typography>
      <SimpleTable rows={rows} />
    </Container>
  );
};
export default MyRequestedMovies;
