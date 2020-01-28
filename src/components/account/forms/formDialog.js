import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SettingsIcon from '@material-ui/icons/Settings';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import styled from 'styled-components';

const Div = styled.div`
  text-align: center;
`;

export default function FormDialog({ title, children, dialog, icon }) {
  const { onClick, onClose, open } = dialog;
  return (
    <div>
      <Button color="primary" onClick={onClick}>
        <Card style={{ minWidth: '200px' }}>
          <CardContent>
            <Div>
              <Typography variant="h5" component="h2">
                {title}
              </Typography>
              {icon === 'account' ? (
                <SettingsIcon style={{ fontSize: '100px' }} />
              ) : (
                <AddCircleOutlineIcon style={{ fontSize: '100px' }} />
              )}
            </Div>
          </CardContent>
        </Card>
      </Button>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        {children}
      </Dialog>
    </div>
  );
}
