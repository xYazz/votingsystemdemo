import React, { Component, useState } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import moment from "moment";
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import { validateVoteData } from "./Profile";
import axiosInstance from "../axios";
import { promptResponse } from "./AddCandidates";
import { useSnackbar } from "notistack";
import { Paper } from '@mui/material';
import { Container } from '@mui/material';
import { useHistory } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { FormLabel } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1000,
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
        zIndex: 1200,
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    textfield: {
        zIndex: 1300,
    }
}));


const vote_type = [
    {
        value: '1',
        label: 'Wybory prezydenckie',
    },
    {
        value: '2',
        label: 'Wybory parlamentarne',
    },
    {
        value: '3',
        label: 'Wybory starosty roku',
    },
    {
        value: '4',
        label: 'Wybory dziekana wydziału',
    },
    {
        value: '5',
        label: 'Wybory ogólne',
    },

]

const CreateVotePage = () => {
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [state, setState] = useState({
        type: 5,
        name: "Wybory ogólne",
        description: "Wybory bez specyficznych kryteriów, każda osoba może zagłosować.",
        start_date: moment().format("YYYY-MM-DD"+"T"+"hh:mm:ss"+"Z"),
        end_date: moment().format("YYYY-MM-DD"+"T"+"hh:mm:ss"+"Z"),
        max_votes: 2,
        private: 'False',
    });

    const handleChangeVoteEdit = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
        console.log(state)
    };
    const handleVoteButtonPressed = () => {
        console.log(state)
        let validation = validateVoteData(state);
        if (validation == true) {

            axiosInstance.post("api/create-vote", {
                type: state.type,
                name: state.name,
                description: state.description,
                max_votes: state.max_votes,
                start_date: state.start_date,
                end_date: state.end_date,
                private: state.private,
            }).catch(error => {
                console.log(error)
            })
                .then((res) => history.push("/add_candidate", { vote_id: res.data.id })
                );

        } else {
            promptResponse(enqueueSnackbar, validation, 'error');
        }
    }


    const classes = useStyles();

    return <div>
        <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
        <Paper elevation={16} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} align="center">
                            <Typography component='h4' variant='h4'>
                                Utwórz głosowanie
                            </Typography>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <TextField
                                variant="outlined"
                                required
                                className={classes.textfield}
                                fullWidth
                                select
                                name="type"
                                id="vote_type"
                                value={state.type}
                                label="Rodzaj głosowania"
                                onChange={handleChangeVoteEdit}
                            >
                                {vote_type.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="name"
                                type="text"
                                onChange={handleChangeVoteEdit}
                                defaultValue="Wybory ogólne"
                            />
                            <FormHelperText>
                                <div align="center">
                                    Nazwa głosowania.
                                </div>
                            </FormHelperText>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                type="text"
                                name="description"
                                onChange={handleChangeVoteEdit}
                                multiline
                                label="Opis głosowania"
                                maxRows={6}
                                defaultValue="Wybory bez specyficznych kryteriów, każda osoba może zagłosować."
                            />
                        </Grid>
                        <Grid item xs={12} align="center">
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="max_votes"
                                type="number"
                                label="Maksymalna ilość głosów jakie może oddać wyborca."
                                onChange={handleChangeVoteEdit}
                                defaultValue={1}
                                inputProps={{
                                    min: 1,
                                }} />
                        </Grid>
                        <Grid item xs={12} align="center">
                            <FormControl>
                                <FormLabel id="demo-radio-buttons-group-label">Widoczność</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue={"False"}
                                    name="private"
                                    
                                    required
                                    onChange={handleChangeVoteEdit}
                                >
                                    <FormControlLabel value={"True"} control={<Radio />} label="Prywatne" />
                                    <FormControlLabel value={"False"} control={<Radio />} label="Publiczne" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="start_date"
                                type="datetime-local"
                                label="Data rozpoczęcia wyborów."
                                onChange={handleChangeVoteEdit}
                                defaultValue={state.start_date}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{
                                    min: 1,
                                }} />
                        </Grid>
                        <Grid item xs={12} align="center">
                            <TextField
                                variant="outlined"
                                required
                                name="end_date"
                                fullWidth
                                type="datetime-local"
                                label="Data zakończenia wyborów."
                                onChange={handleChangeVoteEdit}
                                defaultValue={state.end_date}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{
                                    min: 1,
                                }} />
                        </Grid>
                        <Grid item xs={12} align="center">
                            <Button color="primary" variant="contained" onClick={handleVoteButtonPressed}>
                                Utwórz głosowanie
                            </Button>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <Button color="secondary" variant="contained" to="/" component={Link}>
                                Powrót
                            </Button>
                        </Grid>

                    </Grid>
                </form>
            </Paper>
        </Container>
    </div >;
};

export default CreateVotePage;

export { vote_type }