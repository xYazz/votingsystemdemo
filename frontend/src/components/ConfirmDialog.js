import React from 'react';
import Button from '@mui/material/Button';
import Dialog  from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axiosInstance from '../axios';
import { promptResponse } from './AddCandidates';
import { useSnackbar } from 'notistack';

const ConfirmDialog = (props) => {

  const { enqueueSnackbar } = useSnackbar();

  const handleConfirmClick = () => {
    axiosInstance.delete(props.state.toDeleteURL + props.state.toDeleteId)
      .then((res) => {
        if (res.status == 202) {
          promptResponse(enqueueSnackbar, 'Pomyślnie usunięto element.', 'success')
          props.getProfileDetails();
        } else {

          promptResponse(enqueueSnackbar, 'Wystąpił nieznany błąd.', 'error')
        }

      })
      .catch(error => {
        console.log(error)
      })
  }

  

  return (
    <div>
      <Dialog
        open={props.state.confirmDialogOpen}
        onClose={() => {
          props.setState({ ...props.state, confirmDialogOpen: false });
        }}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Uwaga"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            { props.message }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            props.setState({ ...props.state, confirmDialogOpen: false });
          }}>Anuluj</Button>
          <Button onClick={handleConfirmClick}>Potwierdź</Button>
        </DialogActions>
      </Dialog></div>
  )
}

export default ConfirmDialog