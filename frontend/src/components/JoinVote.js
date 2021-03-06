import React, { useState } from 'react';
import axiosInstance from '../axios';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Container from '@material-ui/core/Container';
import Paper from '@mui/material/Paper';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


const promptResponse = (snackbar, message, variant) => {
    if (variant == 'success') {
        snackbar(message, { variant });
    }
    else {
        snackbar(message, { variant });
    }
};

export default function JoinVote(props) {
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const initialFormData = Object.freeze({
        code: '',
    });

    const vote = props.location.state
    const [formData, updateFormData] = useState(initialFormData);

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            // Trimming any whitespace
            [e.target.name]: e.target.value.trim(),
        });
    };




    const handleButtonPressed = (e) => {
        e.preventDefault();
        if (formData.code.length == 6) {
            axiosInstance.post("/api/can-vote", {
                code: formData.code,
            }).catch(error => {

                promptResponse(enqueueSnackbar, error.response.data['B????d'], 'error');
            })
                .then(response => {
                    if (response.status == 200) {
                        promptResponse(enqueueSnackbar, 'Wys??ano pro??b?? o do????czenie.', 'success');
                    } else {
                        console.log(response.data)
                        promptResponse(enqueueSnackbar, 'Wyst??pi?? nieznany b????d.', 'error');
                    }
                })
        }
        else {
            promptResponse(enqueueSnackbar, 'Wprowadzony kod jest nieprawid??owy.', 'error');
        }


    }

    const classes = useStyles();

    return (


        <Container component="main" maxWidth="xs">
            <Paper elevation={16} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}></Avatar>
                    <Typography component="h1" variant="h5">
                        Do????cz do g??osowania
                    </Typography>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="code"
                                    label="Kod dost??pu"
                                    name="code"
                                    autoComplete="code"
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}

                            onClick={handleButtonPressed}
                        >
                            Do????cz
                        </Button>
                        <Grid container justifyContent="flex-end">
                        </Grid>
                    </form>
                </div>
            </Paper>
        </Container>);
}

export { promptResponse }