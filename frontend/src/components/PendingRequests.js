import React, { Component, useEffect } from 'react';
import moment from "moment";
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { withStyles } from "@mui/styles";
import axiosInstance from '../axios';
import jwtDecode from 'jwt-decode';
import { Paper } from '@mui/material';
import { Container } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Redirect, useHistory } from 'react-router-dom';
import EditVote from './EditVote';
import EditCandidate from './EditCandidate';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useState } from 'react';
import { promptResponse } from './AddCandidates';
import { useSnackbar } from 'notistack';
import SpinStretch from "react-cssfx-loading/lib/SpinStretch";
import LoadingPage from './LoadingPage';

const vote_type = {
    1: 'Wybory prezydenckie',

    2: 'Wybory parlamentarne',

    3: 'Wybory starosty roku',

    4: 'Wybory dziekana wydziału',

    5: 'Wybory ogólne',

}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function PendingRequests() {
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [state, setState] = useState({
        open: false,
        confirmDialogOpen: false,
        toDeleteId: false,
        toDeleteURL: false,
        extra_data: false,
        loading: true,
        error: ''
    })



    const getPendingRequestsDetails = () => {
        axiosInstance.get('/api/can-vote').then((response) => {
            setState({
                ...state, extra_data: response.data, loading: false
            })
        }).catch(error => {
            setState({
                ...state, error: "Brak oczekujących próśb"
            })
        });
    }

    useEffect(() => {
        getPendingRequestsDetails();
    }, []);

    const acceptRequest = (id) => {
        axiosInstance.patch('api/can-vote/' + id, {
            can_vote: true,
        }).then(response => {
            promptResponse(enqueueSnackbar, 'Zaakceptowano prośbę.', 'success');
            getPendingRequestsDetails();
        })
    }

    const handleConfirmClick = () => {
        axiosInstance.delete(state.toDeleteURL + state.toDeleteId)
            .then((res) => {
                if (res.status == 202) {
                    promptResponse(enqueueSnackbar, 'Pomyślnie usunięto element.', 'success')
                } else {

                    promptResponse(enqueueSnackbar, 'Wystąpił nieznany błąd.', 'error')
                }
                getPendingRequestsDetails();
            })
            .catch(error => {
                console.log(error)
            })
    }
    return <div>
        {console.log(state.error)}
        <Dialog
            open={state.confirmDialogOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => {
                setState({ ...state, confirmDialogOpen: false });
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
                    setState({ ...state, confirmDialogOpen: false });
                }}>Anuluj</Button>
                <Button onClick={handleConfirmClick}>Potwierdź</Button>
            </DialogActions>
        </Dialog>
        <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
            {state.loading?<LoadingPage />:
                <Paper elevation={16} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                {state?.extra_data ?
                    <TableContainer component={Paper}>
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell />
                                    <TableCell align="right">Nazwa</TableCell>
                                    <TableCell align="right">Kod dostępu</TableCell>
                                    <TableCell align="right">E-mail</TableCell>
                                    <TableCell align="right">Imię</TableCell>
                                    <TableCell align="right">Nazwisko</TableCell>
                                </TableRow>
                            </TableHead>
                            {state.extra_data.can_vote.map((can_vote) => (
                                <React.Fragment>
                                    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                        <TableCell>
                                            <IconButton
                                                aria-label="add"
                                                size="small"
                                                id="1"
                                                name={can_vote.id}
                                                onClick={((e) => acceptRequest(can_vote.id))}
                                            >
                                                <PersonAddIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                aria-label="delete"
                                                size="small"
                                                id="1"
                                                name={can_vote.id}
                                                onClick={() => { setState({ ...state, confirmDialogOpen: true, toDeleteId: can_vote.id, toDeleteURL: '/api/can-vote/' }) }}
                                            >
                                                <DeleteForeverIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="right">{state.extra_data.vote_data[can_vote.vote]['name']}</TableCell>
                                        <TableCell align="right">{state.extra_data.vote_data[can_vote.vote]['code']}</TableCell>
                                        <TableCell align="right">{state.extra_data.voter_data[can_vote.voter]['email']}</TableCell>
                                        <TableCell align="right">{state.extra_data.voter_data[can_vote.voter]['first_name']}</TableCell>
                                        <TableCell align="right">{state.extra_data.voter_data[can_vote.voter]['last_name']}</TableCell>
                                    </TableRow>
                                </React.Fragment>))}
                        </Table>
                    </TableContainer> : <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
                            <Typography component="h1" variant="h5">
                                Brak oczekujących próśb do dołączenia
                            </Typography>
                    </Container>
                
                            }</Paper>}
        </Container>
    </div>;
};

export default PendingRequests;

