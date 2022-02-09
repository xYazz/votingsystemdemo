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

const vote_type = {
  1: 'Wybory prezydenckie',

  2: 'Wybory parlamentarne',

  3: 'Wybory starosty roku',

  4: 'Wybory dziekana wydziału',

  5: 'Wybory ogólne',

}

const validateVoteData = (vote) => {
  if (!vote.name || !vote.type || !vote.max_votes || !vote.start_date || !vote.end_date) {
    return "Uzupełnij brakujące pola."
  }
  if (vote.name.length > 100) { return "Długość nazwy nie może przekraczać 100 znaków." };
  if (vote.description.length > 500) { return "Długość opisu nie może przekraczać 500 znaków." };
  var start = new Date(vote.start_date);
  var end = new Date(vote.end_date);
  var today = new Date();
  if (start >= end) { return "Rozpoczęcie musi odbyć się przed zakończeniem." }
  if (today > start) { return "Nie można ustawić daty rozpoczęcia wcześniejszej niż dzisiejsza data." }
  if (today > end) { return "Nie można ustawić daty zakończenia wcześniejszej niż dzisiejsza data." }
  return true
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Profile () {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState({
    user: localStorage.getItem('access_token') ? jwtDecode(localStorage.getItem('access_token')).user_id : null,
    userData: false,
    votes: [],
    open: null,
    dialogVoteEditOpen: false,
    toEditVote: null,
    toEditCandidate: null,
    dialogCandidateEditOpen: false,
    add_candidate: null,
    confirmDialogOpen: false,
    toDeleteId: false,
    toDeleteURL: false,
  })



  const getProfileDetails = () => {
    axiosInstance('/api/profile/' + state.user).then((response) => {
      let array = [false]
      for (const element of response.data.votes) {
        array[element.id] = false;
      }
      setState({...state,
        userData: response.data.user,
        votes: response.data.votes,
        open: array,
        confirmDialogOpen: false,
      });
    });
  }

  useEffect(() => {
    getProfileDetails();
  }, []);

  const addCandidate = (data) => {
      history.push("/add_candidate", { vote_id: data })
  };

  const handleConfirmClick = () =>  {
    axiosInstance.delete(state.toDeleteURL + state.toDeleteId)
      .then((res) => {
        if (res.status == 202) {
          promptResponse(enqueueSnackbar, 'Pomyślnie usunięto element.', 'success')
        } else {
          
          promptResponse(enqueueSnackbar, 'Wystąpił nieznany błąd.', 'error')
        }
        getProfileDetails()
      })
      .catch(error => {
        console.log(error)
      })
  }
  return <div>
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
    <EditVote state={state} setState={setState} getProfileDetails={getProfileDetails} />
    <EditCandidate state={state} setState={setState} getProfileDetails={getProfileDetails} />
    <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        
        <h3>{state.userData.first_name} {state.userData.last_name}</h3>
        <p>PESEL: {state.userData.pesel}</p>
        <p>Adres e-mail: {state.userData.email}</p>
        <p>Status społeczny: {state.userData.social_status}</p>
        <p>Edukacja: {state.userData.education}</p>
        <p>Obywatelstwo: {state.userData.citizenship}</p>
        <p>Miejsce zamieszkania: {state.userData.place_of_residence}</p>
        {state.votes.length>0?<TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell align="right">Nazwa</TableCell>
                <TableCell align="right">Typ</TableCell>
                <TableCell align="right">Kod dostępu</TableCell>
                <TableCell align="right">Data rozpoczęcia</TableCell>
                <TableCell align="right">Data zakończenia</TableCell>
              </TableRow>
            </TableHead>
            {(state.votes.length == 0) ? null :
              (state.votes.map((vote) => (
                <React.Fragment>
                  <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => {
                          const newItemsArr = state.open;
                          newItemsArr[vote.id] = !newItemsArr[vote.id];
                          setState({ ...state, open: newItemsArr });

                        }}
                      >
                        {state.open[vote.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell> <TableCell>
                      <IconButton
                        aria-label="edit"
                        size="small"
                        onClick={() => {
                          let today = new Date();
                          if (new Date(vote.start_date) <= today) { alert("Nie można edytować głosowania, które się już rozpoczęło. W szczególnych przypadkach skontaktuj się z administratorem.") }
                          else {
                            setState({
                              ...state, dialogVoteEditOpen: true, toEditVote
                                : vote
                            });
                          }

                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="add"
                        size="small"
                        id="1"
                        name={vote.id}
                        onClick={((e) => addCandidate(vote.id))}
                      >
                        <PersonAddIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="delete"
                        size="small"
                        id="1"
                        name={vote.id}
                        onClick={() => {setState({ ...state, confirmDialogOpen: true, toDeleteId: vote.id, toDeleteURL: '/api/get-vote/' })}}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="right">{vote.name}</TableCell>
                    <TableCell align="right">{vote_type[vote.type]}</TableCell>
                    <TableCell align="right">{vote.private?vote.code:"Brak"}</TableCell>
                    <TableCell align="right">{moment(vote.start_date).format("YYYY-MM-DD " + "hh:mm:ss")}</TableCell>
                    <TableCell align="right">{moment(vote.end_date).format("YYYY-MM-DD " + "hh:mm:ss")}</TableCell>
                  </TableRow>

                  {vote.candidates.length > 0 ?
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={state.open[vote.id]} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                              Lista kandydatów
                            </Typography>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <TableRow>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell>Imię</TableCell>
                                  <TableCell>Nazwisko</TableCell>
                                  <TableCell align="right">Opis programu</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>

                                {vote.candidates.map((candidate) => (
                                  <TableRow key={candidate.id}>
                                    <TableCell>
                                      <IconButton
                                        aria-label="edit"
                                        size="small"
                                        onClick={() => {
                                          let today = new Date();
                                          if (new Date(vote.start_date) <= today) { alert("Nie można edytować głosowania, które się już rozpoczęło. W szczególnych przypadkach skontaktuj się z administratorem.") }
                                          else {
                                            setState({
                                              ...state, dialogCandidateEditOpen: true, toEditCandidate: candidate
                                            });
                                          }

                                        }}
                                      >
                                        <EditIcon />
                                      </IconButton>
                                    </TableCell>
                                    <TableCell>
                                      <IconButton
                                        aria-label="delete-candidate"
                                        size="small"
                                        id="1"
                                        name={candidate.id}
                                        onClick={() => {setState({ ...state, confirmDialogOpen: true, toDeleteId: candidate.id, toDeleteURL: '/api/get-candidate/' })}}
                                      >
                                        <DeleteForeverIcon />
                                      </IconButton>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                      {candidate.first_name}
                                    </TableCell>
                                    <TableCell>{candidate.last_name}</TableCell>
                                    <TableCell align="right">{candidate.description}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow> :
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={state.open[vote.id]} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                              Brak kandydatów
                            </Typography>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>}


                </React.Fragment>
              )))}

          </Table>
        </TableContainer>:null}
      </Paper>
    </Container>
  </div>;
};

export default (Profile);

export { validateVoteData };
