import React, { Component } from 'react'
import axiosInstance from '../axios'
import { useState } from 'react'
import { Button, Typography, TextField, Grid, Container, Paper, MenuItem, Box } from '@material-ui/core';
import { getUser } from './Header';
import { Link } from 'react-router-dom';

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
            roomId: props.location.state.room_id,
            userId: props.location.state.user_id,
            isHost: props.location.state.isHost ? props.location.state.isHost : false,
        }
    }

    componentWillMount() {
        const roomId = this.props.location.state.room_id;
        const userId = this.props.location.state.user_id;
        const isHost = this.props.location.state.isHost ? this.props.location.state.isHost : false;

        ws.onopen = function () {
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
            ws.send(
                JSON.stringify({
                    pk: roomId,
                    action: "subscribe_to_answers_in_room",
                    request_id: userId,
                })
            );
            ws.send(
                JSON.stringify({
                    pk: roomId,
                    action: "subscribe_instance",
                    request_id: userId,
                })
            );
            console.log('connected');
            console.log(this.props);
        }
        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            switch (data.action) {
                case "retrieve":
                    this.setState({
                        ...this.state,
                        questions: data.data.questions,
                        currentQuestion: data.data.current_question,
                        answers: data.data.questions[data.data.current_question].answers,
                        currentUsers: data.data.current_users,
                    });
                    // setCurrentQuestion(data.data.current_question);
                    // setAnswers(data.data.questions[data.data.current_question].answers)
                    // questions=data.data.questions
                    // current_question=data.data.current_question
                    // answers=data.data.questions[current_question].answers
                    break;
                case "update_users":
                    this.setState({...this.state, currentUsers: data.users})
                    break;
                case "update_current_question":
                    this.setState({ ...this.state, currentQuestion: data.data.current_question })
                    break;
                // default:
                //     break;
            }
            console.log(data);
        }
        ws.onclose = function (e) {
            console.log(e)
            console.error('Chat socket closed unexpectedly');
        }
    }
    render() {
        return (
            <Container component="main" maxWidth="sm" sx={{ m: 4 }}>
                <Paper elevation={16} spacing={2}>
                    <Box m={2} pt={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {this.state.isHost ?
                                    <Button fullWidth color='primary' variant='contained' onClick={() => {
                                        ws.send(JSON.stringify({
                                            action: "change_current_question",
                                            room_pk: this.state.roomId,
                                            question_pk: (this.state.currentQuestion + 1),
                                            request_id: this.state.userId,
                                        }))
                                        this.setState({...this.state, currentQuestion: this.state.currentQuestion + 1})
                                        console.log(this.state)
                                    }}>
                                        Następne pytanie
                                    </Button> : null}

                            </Grid>
                        </Grid>
                        <div> {this.state.currentQuestion}</div >
                    </Box>
                </Paper>
            </Container>
        )
    }
}

export default LiveSitting