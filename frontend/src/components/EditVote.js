import React from 'react';

import { TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle}  from '@mui/material';
import { validateVoteData } from './Profile';
import axiosInstance from '../axios';
import { vote_type } from './CreateVotePage';
import { promptResponse } from './AddCandidates';
import { useSnackbar } from 'notistack';
import { MenuItem, RadioGroup, FormControlLabel, FormLabel } from '@material-ui/core';

const EditVote = (props) => {
    const { enqueueSnackbar } = useSnackbar();
    const handleChangeVoteEdit = (event) => {
        props.setState({
            ...props.state,
            toEditVote: {
                ...props.state.toEditVote,
                [event.target.name]: event.target.value
            }
        })
    };

    const handleVoteEditSubmit = () => {
        let validation = validateVoteData(props.state.toEditVote);
        if (validation == true) {
            axiosInstance.put("api/get-vote/" + props.state.toEditVote.id, {
                name: props.state.toEditVote.name,
                type: props.state.toEditVote.type,
                description: props.state.toEditVote.description,
                start_date: props.state.toEditVote.start_date,
                end_date: props.state.toEditVote.end_date,
                private: props.state.toEditVote.private,
                max_votes: props.state.toEditVote.max_votes
            }).then((res) => {
                if (res.status == 202) {
                    promptResponse(enqueueSnackbar, 'Edycja zakończona pomyślnie.', 'success');
                    props.getProfileDetails();
                } else {
                    console.log(res)
                }
            })
                .catch(error => {
                    console.log(error)
                }
                );

        } else {
            promptResponse(enqueueSnackbar, validation, 'error');
        }
    }

    return <div>
        <Dialog open={props.state.dialogVoteEditOpen} onClose={() => {
            props.setState({ ...props.state, dialogVoteEditOpen: false });
        }}>
            <DialogTitle>Edytuj głosowanie</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {(props.state.toEditVote) ?
                        <React.Fragment>
                            <TextField
                                autoFocus
                                margin="normal"
                                id="name"
                                label="Nazwa"
                                name="name"
                                value={props.state.toEditVote.name}
                                type="text"
                                fullWidth
                                onChange={handleChangeVoteEdit}
                                variant="outlined"
                            />
                            <TextField
                                variant="outlined"
                                required
                                select
                                margin="normal"
                                fullWidth
                                id="type"
                                name="type"
                                value={props.state.toEditVote.type}
                                label="Rodzaj głosowania"
                                autoComplete="type"
                                onChange={handleChangeVoteEdit}
                            >
                                {vote_type.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                autoFocus
                                margin="normal"
                                id="max_votes"
                                label="Max. ilość głosó"
                                name="max_votes"
                                value={props.state.toEditVote.max_votes}
                                type="number"
                                fullWidth
                                onChange={handleChangeVoteEdit}
                                variant="outlined"
                            />
                            <FormControl>
                                <FormLabel id="demo-radio-buttons-group-label">Widoczność</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    name="private"
                                    required
                                    onChange={handleChangeVoteEdit}
                                >
                                    <FormControlLabel value={"True"} control={<Radio />} label="Prywatne" />
                                    <FormControlLabel value={"False"} control={<Radio />} label="Publiczne" />
                                </RadioGroup>
                            </FormControl>
                            <TextField
                                type="datetime-local"
                                fullWidth
                                margin="normal"
                                id="start_date"
                                name="start_date"
                                label="Data rozpoczęcia."
                                onChange={handleChangeVoteEdit}
                                value={props.state.toEditVote.start_date}
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{
                                    min: 1,
                                }} />
                            <TextField
                                autoFocus
                                margin="normal"
                                id="end_date"
                                name="end_date"
                                label="Data zakończenia"
                                value={props.state.toEditVote.end_date}
                                type="datetime-local"
                                fullWidth
                                onChange={handleChangeVoteEdit}
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{
                                    min: 1,
                                }} />
                            <TextField
                                autoFocus
                                margin="normal"
                                id="name"
                                name="description"
                                label="Opis"
                                value={props.state.toEditVote.description}
                                type="text"
                                fullWidth
                                onChange={handleChangeVoteEdit}
                                variant="outlined"
                            /></React.Fragment>
                        : "Nie można edytować danych, skontaktuj się z administratorem systemu."
                    }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    props.setState({ ...props.state, dialogVoteEditOpen: false });
                }}>Anuluj</Button>
                <Button onClick={handleVoteEditSubmit
                }>Zatwierdź zmiany</Button>
            </DialogActions>
        </Dialog></div>;
};

export default EditVote;
