import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from '@material-ui/core/FormLabel';
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from '@mui/material/Typography';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useHistory } from 'react-router-dom';
import DisplaySittingsList from './DisplaySittingsList';
import ListCreateQuestion from './ListCreateQuestion';
import ListCreateAnswer from './ListCreateAnswer';
import { Autocomplete } from '@mui/material';
import { getUser } from './Header';

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
  const handleTypeChange = (event) => {
    axiosInstance.patch(
      'sitting/room/'
      + selectedSitting.pk, {
      is_public: event.target.value == 'true' ? 'True' : 'False'
    }).catch(error => { console.log(error) })
      .then(response => {
        if (response.status == 200) {
          setSelectedSitting({ ...selectedSitting, is_public: response.data.room.is_public })
        }
      })
    console.log(event.target.value);
  };

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
                      <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Typ posiedzenia</FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue={"false"}
                          value={selectedSitting.is_public==true?'true':'false'}
                          name="private"

                          required
                          onChange={handleTypeChange}
                        >
                          <FormControlLabel value={"true"} control={<Radio />} label="Jawne" />
                          <FormControlLabel value={"false"} control={<Radio />} label="Tajne" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
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

