import React, { useState } from "react";
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
import makeStyles from '@material-ui/core/styles/makeStyles';
import MenuItem from '@material-ui/core/MenuItem';
import { validateVoteData } from "./Profile";
import axiosInstance from "../axios";
import { promptResponse } from "./AddCandidates";
import { useSnackbar } from "notistack";
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import { useHistory } from "react-router-dom";
import FormLabel from "@material-ui/core/FormLabel";

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


const CreateSitting = (props) => {
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();


    const changeSittingName = (event) => {
        props.setSittingName(event.target.value
        )
    };
    const handleSubmit = () => {
        axiosInstance.post("sitting/create/", {
            name: props.sittingName
        }).catch(error => {
            console.log(error)
        })
            .then(response => {
                if(response.status==201){
                    props.setSittingsList([...props.sittingsList, response.data.room])
                    console.log(response.data.room)
                }
            });
            console.log(props.sittingsList)
    }




    const classes = useStyles();

    return <div>
        <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
            <Paper elevation={16} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} align="center">
                            <Typography component='h4' variant='h4'>
                                Utwórz posiedzenie
                            </Typography>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="sittingName"
                                type="text"
                                label="Nazwa posiedzenia"
                                onChange={changeSittingName}
                                defaultValue="Posiedzenie"
                            />
                        </Grid>
                        <Grid item xs={12} align="center">
                            <Button color="primary" variant="contained" onClick={handleSubmit}>
                                Utwórz posiedzenie
                            </Button>
                        </Grid>

                    </Grid>
                </form>
            </Paper>
        </Container>
    </div >;
};

export default CreateSitting;
