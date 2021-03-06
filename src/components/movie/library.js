import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DoneOutlineRoundedIcon from '@material-ui/icons/DoneOutlineRounded';
import Typography from '@material-ui/core/Typography';

const LibContainer = styled.div`
  display: flex;
  margin-left: 10px;
`;
const Library = ({ hasFile, inRadarrCollection, movieStatus }) => {
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (inRadarrCollection) {
      setMessage('Awaiting confirmation');
    }
    if (hasFile) {
      setMessage('In Library');
    }
    if (movieStatus && movieStatus.status === 'Downloading') {
      setMessage(`Downloading`);
    }
    return () => {
      setMessage('');
    };
  }, [hasFile, inRadarrCollection, movieStatus]);
  if (message) {
    return (
      <LibContainer>
        <DoneOutlineRoundedIcon style={{ fontSize: '36px', color: '#ff6987e6' }} />
        <Typography variant="h6" component="h6" style={{ lineHeigh: 2, margin: 'auto' }}>
          {message}
        </Typography>
      </LibContainer>
    );
  }
  return <></>;
};
export default Library;
