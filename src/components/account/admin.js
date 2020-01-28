/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import FormDialog from './forms/formDialog';
import RadarrDialog from './forms/radarr/radarr';
import SettingsDialog from './forms/settings/settings';

const Container = styled.div`
  margin: 0 10%;
  margin-top: 24px;
`;

const useDialog = init => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(init);

  const onClick = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  return {
    open,
    onClick,
    onClose,
    title,
    setTitle,
  };
};

const SettingsAdmin = () => {
  const radarrDialog = useDialog('Radarr');
  const settingsDialog = useDialog('Settings');
  return (
    <>
      <Container>
        <Typography variant="h4" component="h4">
          Connetions
        </Typography>
        <FormDialog dialog={radarrDialog} title="Radarr">
          <RadarrDialog dialog={radarrDialog} />
        </FormDialog>
        <Typography variant="h4" component="h4">
          Account
        </Typography>
        <FormDialog dialog={settingsDialog} title="Settings" icon="account">
          <SettingsDialog dialog={settingsDialog} />
        </FormDialog>
      </Container>
    </>
  );
};
export default SettingsAdmin;
