/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import FormDialog from './forms/formDialog';
import RadarrDialog from './forms/radarr/radarr';
import SettingsDialog from './forms/settings/settings';
import PushoverDialog from './forms/pushover/pushover';

const Container = styled.div`
  margin: 0 10%;
  margin-top: 24px;
`;
const Div = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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
  const pushoverDialog = useDialog('Pushover');
  const [flashMessage, setFlashMessage] = useState(undefined);
  const flash = message => {
    setFlashMessage(message);
  };
  return (
    <>
      <Container>
        {flashMessage && <Alert severity="success">{flashMessage}</Alert>}
        <Typography variant="h4" component="h4">
          Connetions
        </Typography>
        <Div>
          <FormDialog dialog={radarrDialog} title="Radarr">
            <RadarrDialog flash={flash} dialog={radarrDialog} />
          </FormDialog>
          <FormDialog dialog={pushoverDialog} title="Pushover">
            <PushoverDialog flash={flash} dialog={pushoverDialog} />
          </FormDialog>
        </Div>

        <Typography variant="h4" component="h4">
          Account
        </Typography>
        <Div>
          <FormDialog dialog={settingsDialog} title="Settings" icon="account">
            <SettingsDialog dialog={settingsDialog} />
          </FormDialog>
        </Div>
      </Container>
    </>
  );
};
export default SettingsAdmin;
