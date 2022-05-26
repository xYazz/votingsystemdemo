import React, { useState, Suspense, lazy, useEffect } from 'react';
import moment from "moment";
import axiosInstance from '../axios';
import jwtDecode from 'jwt-decode';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useHistory } from 'react-router-dom';
const EditVote = lazy(() => import('./EditVote'));
const EditCandidate = lazy(() => import('./EditCandidate'));
const ConfirmDialog = lazy(() => import('./ConfirmDialog'));
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import LoadingPage from './LoadingPage';
import CreateSitting from './CreateSitting';
import DisplaySittingsList from './DisplaySittingsList';
import ListCreateQuestion from './ListCreateQuestion';
import ListCreateAnswer from './ListCreateAnswer';
import { Autocomplete } from '@mui/material';
import { getUser } from './Header';
import { Link } from 'react-router-dom';

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


function ManageSitting() {
  const history = useHistory();
  const [sittingName, setSittingName] = useState('');
  const [sittingsList, setSittingsList] = useState([]);
  const [selectedSitting, setSelectedSitting] = useState(0);
  const [questionName, setQuestionName] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [roomQuestions, setRoomQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(0);
  const updateQuestion = (event) => {
    setQuestionName(event.target.value
    )
  };

  const submitQuestion = () => {
    axiosInstance.post("sitting/create-question/", {
      question: questionName,
      room: selectedSitting,
    }).catch(error => {
      console.log(error)
    })
      .then(response => {
        if (response.status == 201) {
          props.setSittingsList([...props.sittingsList, response.data.room])
        }
      });
  }
  const getUsersList = () => {
    axiosInstance.get('/sitting/room_users/').then((response) => {
      setUsersList(response.data.users)
    });
  }

  const goToSitting = () => {
    if (selectedSitting.status == 3) {
      history.push('/finished_sitting', {
        room_id: selectedSitting.pk,
        user_id: getUser(),
        isHost: true
      })
    }

    axiosInstance.patch('sitting/room/' + selectedSitting.pk, { status: 2 })
      .then(response => {
        if (response.status == 200) {
          history.push('/live_sitting', { room_id: selectedSitting.pk, user_id: getUser(), isHost: true })
        }
      }
      )
  }
  const deleteAnswer = () => {
    axiosInstance.delete(
      '/sitting/answer/'
      + selectedAnswer.answer_id)
      .then(response => {
        if (response.status == 200) {
          setSelectedAnswer(0);
          setAnswers(response.data.question.answers)
        }
        else {
          console.log('Nie udało się usunąć.')
        }
      })
  }

  const deleteQuestion = () => {
    axiosInstance.delete('/sitting/question/' + selectedQuestion.pk).then(response => {
      if (response.status == 200) {
        setSelectedQuestion(0);
        setRoomQuestions(response.data.room.questions)
      }
      else {
        console.log('Nie udało się usunąć.')
      }
    })
  }
  const deleteSitting = () => {
    axiosInstance.delete(
      '/sitting/room/'
      + selectedSitting.pk)
      .then(response => {
        if (response.status == 200) {
          setSelectedSitting(0);
          setSittingsList(response.data.room_list)
        }
        else {
          console.log('Nie udało się usunąć.')
        }
      })
  }
  useEffect(() => {
    getUsersList();
    console.log(allowedUsers)
  }, []);

  return <div>
    <Container maxWidth="md" component="main">
      <Box mt={5}>
        <Paper elevation={16} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Grid container spacing={1}>
            <Grid item xs={12} align="center">
              <Typography component='h4' variant='h4'>
                Twoje posiedzenia:
              </Typography>
            </Grid>
            <Grid item xs={selectedSitting.name ? 9 : 12}>
              <DisplaySittingsList
                setRoomQuestions={setRoomQuestions}
                allowedUsers={allowedUsers}
                setAllowedUsers={setAllowedUsers}
                sittingsList={sittingsList}
                setSittingsList={setSittingsList}
                selectedSitting={selectedSitting}
                setSelectedSitting={setSelectedSitting} />
            </Grid>
            {selectedSitting.name ?
              <><Grid item xs={3}>
                <Button
                  fullWidth
                  color="secondary"
                  variant="contained"
                  style={{ minHeight: 52, maxHeight: 52 }}
                  onClick={() => deleteSitting()}>
                  Usuń posiedzenie
                </Button>
              </Grid>
                {selectedSitting.status == 1 ?
                  <>
                    <Grid item xs={12}>
                      <Autocomplete
                        multiple
                        fullWidth
                        limitTags={4}
                        id="allowed-users"
                        onChange={(event, value, details) => {
                          console.log(selectedSitting)
                          if (details == 'selectOption') {
                            console.log(selectedSitting)
                            axiosInstance.post("sitting/room_users/", {
                              room_pk: selectedSitting.pk,
                              user_id: value[value.length - 1].id
                            }).catch(error => {
                              console.log(error)
                            })
                              .then(response => {
                                if (response.status == 202) {
                                  setAllowedUsers(response.data.room.allowed_users)
                                }
                              });
                          } else {
                            axiosInstance.patch("sitting/room_users/", {
                              room: selectedSitting.pk,
                              user: value[value.length - 1].id
                            }).catch(error => {
                              console.log(error)
                            })
                              .then(response => {
                                if (response.status == 202) {
                                  setAllowedUsers(response.data.room.allowed_users)
                                }
                              });
                          }

                        }}
                        options={usersList}
                        getOptionLabel={(option) => option.email}
                        value={allowedUsers}
                        renderInput={(params) => (
                          <TextField {...params} label="Lista członków" placeholder="Członkowie" />
                        )}
                      />
                    </Grid>

                    <Grid item xs={selectedQuestion ? 9 : 12}>
                      <ListCreateQuestion
                        options={roomQuestions ? roomQuestions : []}
                        selectedSitting={selectedSitting}
                        setAnswers={setAnswers}
                        setSelectedQuestion={setSelectedQuestion}
                        setRoomQuestions={setRoomQuestions}
                        label="Pytania" />
                    </Grid>
                    {selectedQuestion ?
                      <Grid item xs={3}>
                        <Button
                          fullWidth
                          color="secondary"
                          variant="contained"
                          style={{ minHeight: 52, maxHeight: 52 }}
                          onClick={() => deleteQuestion()}>
                          Usuń pytanie
                        </Button></Grid>
                      : null}
                    {selectedQuestion ?

                      <Grid item xs={selectedAnswer ? 9 : 12}>
                        <ListCreateAnswer options={answers} setAnswers={setAnswers} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} setSelectedAnswer={setSelectedAnswer} label="Opcje do wyboru" />
                      </Grid>
                      : null}

                    {selectedAnswer ?
                      <Grid item xs={3}>
                        <Button
                          fullWidth
                          color="secondary"
                          variant="contained"
                          style={{ minHeight: 52, maxHeight: 52 }}
                          onClick={() => deleteAnswer()}>
                          Usuń odpowiedź
                        </Button></Grid>
                      : null}</> : null}
                <Button fullWidth color="primary" variant="contained" onClick={() => goToSitting()}>
                  {selectedSitting.status == 1
                    ? 'Rozpocznij posiedzenie'
                    : selectedSitting.status == 2 ?
                      'Dołącz do posiedzenia' :
                      'Podsumowanie posiedzenia'}
                </Button></>
              : null}

          </Grid>
        </Paper>
      </Box>
    </Container>
  </div >;
};

export default (ManageSitting);

