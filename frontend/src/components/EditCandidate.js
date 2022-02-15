import React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle}  from '@mui/material';
import { validateCandidateData } from './AddCandidates';
import axiosInstance from '../axios';
import { promptResponse } from './AddCandidates';
import { useSnackbar } from 'notistack';

const EditCandidate = (props) => {
	const { enqueueSnackbar } = useSnackbar();

  const handlaChangeCandidateEdit = (event) => {
    props.setState({
      ...props.state,
      toEditCandidate: {
        ...props.state.toEditCandidate,
        [event.target.name]: event.target.value
      }
    })
  };

  const handleCandidateEditSubmit = () => {
    let validation = validateCandidateData(props.state.toEditCandidate.first_name, props.state.toEditCandidate.last_name, props.state.toEditCandidate.description);
    if (validation == true) {
      axiosInstance.patch("api/get-candidate/" + props.state.toEditCandidate.id, {
        first_name: props.state.toEditCandidate.first_name,
        last_name: props.state.toEditCandidate.last_name,
        description: props.state.toEditCandidate.description,
      }).then((res) => {
				if(res.status==202){
          promptResponse(enqueueSnackbar, 'Edycja zakończona pomyślnie.', 'success');
          props.getProfileDetails();
				} else {
					console.log(res)
				}
			})
        .catch(error => {
          promptResponse(enqueueSnackbar, 'Wystąpił nieznany błąd.', 'error')
        }
        );

    } else {
      promptResponse(enqueueSnackbar, validation, 'error');
    }
  }

  return <div>
    <Dialog open={props.state.dialogCandidateEditOpen} onClose={() => {
      props.setState({ ...props.state, dialogCandidateEditOpen: false });
    }}>
      <DialogTitle>Edytuj kandydata</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {(props.state.toEditCandidate) ?
            <React.Fragment>
              <TextField
                autoFocus
                margin="normal"
                id="first_name"
                label="Imię"
                name="first_name"
                value={props.state.toEditCandidate.first_name}
                type="text"
                fullWidth
                onChange={handlaChangeCandidateEdit}
                variant="outlined"
              />
              <TextField
                autoFocus
                margin="normal"
                id="last_name"
                label="Nazwisko"
                name="last_name"
                value={props.state.toEditCandidate.last_name}
                type="text"
                fullWidth
                onChange={handlaChangeCandidateEdit}
                variant="outlined"
              /><TextField
                autoFocus
                margin="normal"
                id="description"
                label="Opis programu"
                name="description"
                value={props.state.toEditCandidate.description}
                type="text"
                fullWidth
                onChange={handlaChangeCandidateEdit}
                variant="outlined"
              />
            </React.Fragment>
            : "Nie można edytować danych, skontaktuj się z administratorem systemu."
          }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          props.setState({ ...props.state, dialogCandidateEditOpen: false });
        }}>Anuluj</Button>
        <Button onClick={handleCandidateEditSubmit
        }>Zatwierdź zmiany</Button>
      </DialogActions>
    </Dialog></div>;
};

export default EditCandidate;
