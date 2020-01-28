import React, { useReducer } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { reducer } from './reducer';

export default function RadarrDialog({ dialog }) {
  const { onClose, title } = dialog;
  const [state, dispatch] = useReducer(reducer, '');
  const {
    isValid,
    urlFeilmelding,
    urlIsValid,
    apiFeilmelding,
    apiIsValid,
    folderFeilmelding,
    folderIsValid,
  } = state;

  const handleSubmit = e => {
    e.preventDefault();
    const elements = Array.from(e.target.elements);
    elements.forEach(el => {
      dispatch({
        type: el.name,
        el,
      });
    });
  };
  console.log('isvalid', urlIsValid);
  return (
    <>
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>Enable your radarr endpoint for requesting movies</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            error={typeof urlFeilmelding !== 'undefined'}
            id="radarrUrl"
            name="url"
            label="Radarr Url"
            type="radarrUrl"
            helperText={urlFeilmelding}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="radarrAPI"
            error={typeof apiFeilmelding !== 'undefined'}
            name="api"
            label="Radarr Api key"
            helperText={apiFeilmelding}
            type="radarrAPI"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="radarrFolder"
            error={typeof folderFeilmelding !== 'undefined'}
            helperText={folderFeilmelding}
            name="folder"
            label="Radarr root folder"
            type="radarrFolder"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onClose} color="primary">
            Test
          </Button>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </DialogActions>
      </form>
    </>
  );
}
