import React, { Component } from 'react'
import { useState } from 'react'
import { Button, Stepper, StepLabel, Step, Typography, TextField, Grid, Container, Paper, MenuItem, Box } from '@material-ui/core';
import { getUser } from './Header';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import axiosInstance from '../axios';
import PieChart, {
    Series,
    Label,
    Connector,
    Export,
} from 'devextreme-react/pie-chart';
import Skipper from './Skipper';

const ws = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/')

class LiveSitting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answers: [],
            questions: [],
            currentQuestion: 0,
            currentUsers: [],
            timesQuestionAnswered: 0,
            selectedAnswer: null,
            allowedUsers: [],
            alreadyAnswered: false,
            roomId: props.location.state.room_id,
            userId: props.location.state.user_id,
            isHost: props.location.state.isHost ? props.location.state.isHost : false,
        }
    }
    handleAnswerClick = (event, answer_pk) => {
        this.state.alreadyAnswered ? null :
            this.setState({ ...this.state, selectedAnswer: answer_pk });
    };
    changeCurrentQuestion = () => {
        ws.send(JSON.stringify({
            action: "change_current_question",
            room_pk: this.state.roomId,
            question_pk: (this.state.currentQuestion + 1),
            request_id: this.state.userId,
        }))
        this.setState({ ...this.state, currentQuestion: this.state.currentQuestion + 1 })
    }
    checkIfSentAnswerBefore = () => {
        axiosInstance.post('/sitting/check_if_voted/', {
            user_pk: this.state.userId,
            question_pk: this.state.questions[this.state.currentQuestion].pk
        }).then((response) => {
            this.setState({
                ...this.state,
                alreadyAnswered: response.data.if_voted
            })
        });
    }
    handleSendAnswer() {
        ws.send(JSON.stringify({
            action: "create_sent_answer",
            user_id: this.state.userId,
            request_id: this.state.userId,
            answer_pk: this.state.selectedAnswer,
            question_pk: this.state.questions[this.state.currentQuestion].pk
        }))
        let updated_answers = []
        this.state.answers.map(answer => {
            updated_answers.push(answer)
        })

        const search = answer => answer.id === this.state.selectedAnswer;

        updated_answers[this.state.answers.findIndex(search)].times_voted += 1;
        this.setState({
            ...this.state,
            answers: updated_answers,
            alreadyAnswered: true,
            timesQuestionAnswered: this.state.timesQuestionAnswered+=1,
        })
    }
    pointClickHandler = (e) => {
        this.toggleVisibility(e.target);
    }

    toggleVisibility = (item) => {
        item.isVisible() ? item.hide() : item.show();
    }

    legendClickHandler = (e) => {
        const arg = e.target;
        const item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];

        this.toggleVisibility(item);
    }

    endSitting = () => {
        axiosInstance.patch('sitting/room/' + this.state.roomId, { status: 3 })
            .then(response => {
                if (response.status == 200) {
                    this.disconnect()
                }
            }
            )
    }
    getTimesQuestionAnswered(answers){
        let timesQuestionAnswered = 0;
        answers.map(answer => {
            timesQuestionAnswered+=answer.times_voted;
        })
        return timesQuestionAnswered;
    }

    disconnect = () => {
        ws.send(JSON.stringify({
            pk: this.state.roomId,
            action: "end_vote",
            request_id: this.state.userId,
            is_host: this.state.isHost
        }))
        let updated_questions = []
        this.state.questions.map((question, idx) => {
            idx != this.state.currentQuestion
                ? updated_questions.push(question)
                : (question.answers = this.state.answers,
                updated_questions.push(question))
        })
        let allowed_users = this.state.allowedUsers.length
        this.props.history.push('/finished_sitting', {
            room_id: this.state.roomId,
            user_id: this.state.userId,
            questions: updated_questions,
            isHost: this.state.isHost,
            allowed_users: allowed_users
        })
    }

    componentDidMount() {
        const roomId = this.props.location.state.room_id;
        const userId = this.props.location.state.user_id;
        const isHost = this.props.location.state.isHost
            ? this.props.location.state.isHost
            : false;

        ws.onopen = function () {

            ws.send(
                JSON.stringify({
                    pk: roomId,
                    action: "subscribe_instance",
                    request_id: userId,
                })
            );
            ws.send(
                JSON.stringify({
                    pk: roomId,
                    action: "join_room",
                    request_id: userId,
                    user_id: userId,
                    is_host: isHost,
                })
            );
            ws.send(
                JSON.stringify({
                    pk: roomId,
                    action: "retrieve",
                    request_id: userId,
                    user_id: userId,
                })
            );
        }
        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            switch (data.action) {
                case "retrieve":
                    data.data.status != 2 ? this.state.history.push(
                        '/sitting/finished/',
                        { room_id: this.state.roomId }) :

                        this.setState({
                            ...this.state,
                            questions: data.data.questions,
                            currentQuestion: data.data.current_question,
                            answers: data.data.questions[data.data.current_question].answers,
                            timesQuestionAnswered: this.getTimesQuestionAnswered(data.data.questions[data.data.current_question].answers),
                            currentUsers: data.data.current_users,
                            allowedUsers: data.data.allowed_users
                        });

                    this.checkIfSentAnswerBefore();
                    break;

                case "update_users":
                    this.setState({ ...this.state, currentUsers: data.content })
                    break;

                case "update_current_question":
                    this.setState({
                        ...this.state,
                        currentQuestion: data.content,
                        answers: this.state.questions[data.content].answers,
                        timesQuestionAnswered: this.getTimesQuestionAnswered(this.state.questions[data.content].answers),
                    })
                    this.checkIfSentAnswerBefore();
                    break;

                case "update_answer":
                    let updated_answers = []
                    this.state.answers.map(answer => {
                        updated_answers.push(answer)
                    })
                    const search = answer => answer.id === data.content.id;
                    let updated_questions = this.state.questions
                    updated_questions[this.state.currentQuestion].answers = updated_answers
                    updated_answers[this.state.answers.findIndex(search)] = data.content;
                    
                    this.setState({
                        ...this.state,
                        answers: updated_answers,
                        questions: updated_questions,
                        timesQuestionAnswered: this.getTimesQuestionAnswered(updated_answers),
                    })
                    break;

                default:
                    break;
            }
            data['action'] == "update" ?
                data.data.status == 3
                    ? this.disconnect()
                    : null
                : null
        }
        ws.onclose = function (e) {
            console.log(e)
            console.error('Chat socket closed unexpectedly');
        }
    }

    render() {
        return (
            <Container component="main" maxWidth="md" sx={{ m: 4 }}>
                <Paper elevation={16} spacing={2}>
                    <Box m={2} pt={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Skipper 
                                questions={this.state.questions} 
                                currentQuestion={this.state.currentQuestion}
                                timesQuestionAnswered={this.state.timesQuestionAnswered}
                                isHost={this.state.isHost}
                                />

                            </Grid>
                            <Grid item xs={8} container direction='column' spacing={1}>
                                {this.state.questions.length > 0
                                    ? <Grid item xs>
                                        <Typography component='h4' variant='h4'>
                                            {this.state.questions[this.state.currentQuestion].question}
                                        </Typography>
                                    </Grid>
                                    : null}
                                <Grid item xs>
                                    <List
                                        disabled={true}
                                        fullWidth
                                        sx={{
                                            width: '100%',
                                            position: 'flex',
                                            overflow: 'auto',
                                        }}
                                    >
                                        {this.state.answers.map((answer) => (
                                            <ListItem disablePadding>
                                                <ListItemButton
                                                    selected={this.state.selectedAnswer === answer.id}
                                                    onClick={(event) => this.handleAnswerClick(event, answer.id)}
                                                >
                                                    <ListItem key={answer.id}>
                                                        <ListItemText primary={answer.answer} />
                                                    </ListItem>
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Grid>
                                {(this.state.selectedAnswer && !this.state.isHost) || this.state.alreadyAnswered ?
                                    <Grid item xs>
                                        <Button disabled={this.state.alreadyAnswered} fullWidth color='primary' variant='contained' onClick={() => this.handleSendAnswer()}>
                                            {this.state.alreadyAnswered ? 'Zagłosowano' : 'Wyślij odpowiedź'}
                                        </Button>
                                    </Grid> : null}
                            </Grid>
                            <Grid item xs={4}>
                                <List
                                    sx={{
                                        width: '100%',
                                        maxWidth: 360,
                                        bgcolor: 'background.paper',
                                        position: 'relative',
                                        overflow: 'auto',
                                        maxHeight: 300,
                                        '& ul': { padding: 0 },
                                    }}
                                    subheader={<li />}
                                >
                                    <ListSubheader>{'Obecni użytkownicy'}</ListSubheader>
                                    {this.state.currentUsers.map((obj) => (
                                        <ListItem key={obj.id}>
                                            <ListItemText primary={obj.email} />
                                        </ListItem>
                                    ))}

                                </List>
                            </Grid>
                            {this.state.isHost ?

                                this.state.questions.length - 1 > this.state.currentQuestion ?
                                    <Grid item xs={8}>
                                        <Button fullWidth color='primary' variant='contained' onClick={this.changeCurrentQuestion}>
                                            Następne pytanie
                                        </Button>
                                    </Grid> :
                                    <Grid item xs={8}>
                                        <Button fullWidth color='primary' variant='contained' onClick={this.endSitting}>
                                            Zakończ posiedzenie
                                        </Button>
                                    </Grid>
                                : null}
                            <Grid item xs={12}>
                                <PieChart
                                    id="pie"
                                    dataSource={this.state.answers}
                                    palette="Bright"
                                    title="Podsumowanie"
                                    onPointClick={this.pointClickHandler}
                                    onLegendClick={this.legendClickHandler}
                                >
                                    <Series
                                        argumentField="answer"
                                        valueField="times_voted"
                                    >
                                        <Label visible={true}>
                                            <Connector visible={true} width={1} />
                                        </Label>
                                    </Series>

                                    <Export enabled={true} />
                                </PieChart>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        )
    }
}

export default LiveSitting