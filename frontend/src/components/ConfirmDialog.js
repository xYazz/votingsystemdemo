import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
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

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  return (
    <div>
      <Dialog
        open={props.state.confirmDialogOpen}
        //TransitionComponent={Transition}
        //keepMounted
        onClose={() => {
          props.setState({ ...props.state, confirmDialogOpen: false });
        }}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Uwaga"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Czy na pewno chcesz usunąć wybrany element?
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