import React, { Component } from 'react'
import axiosInstance from '../axios'
import { useState } from 'react'
import { Button, Typography, TextField, Grid, Container, Paper, MenuItem, Box } from '@material-ui/core';
import { getUser } from './Header';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
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

    componentDidMount() {
        const roomId = this.props.location.state.room_id;
        const userId = this.props.location.state.user_id;
        const isHost = this.props.location.state.isHost ? this.props.location.state.isHost : false;

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
            ws.send(
                JSON.stringify({
                    pk: roomId,
                    action: "subscribe_to_answers_in_room",
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
                    break;
                case "update_users":
                    this.setState({ ...this.state, currentUsers: data.users })
                    console.log('here')
                    break;
                case "update_current_question":
                    this.setState({ ...this.state, currentQuestion: data.data.current_question })
                    break;
                default:
                    break;
            }
            console.log(data);
            console.log(data['action']);
            console.log(data.data);
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
                            <Grid item xs container direction='column' spacing={1}>
                                {this.state.questions.length > 0 ?
                                    <Grid item xs={2}>
                                        <Typography component='h4' variant='h4'>
                                            {this.state.questions[this.state.currentQuestion].question}
                                        </Typography>
                                    </Grid> : null}
                                <Grid item xs={3}>
                                    <List
                                        sx={{
                                            width: '100%',
                                            position: 'relative',
                                            overflow: 'auto',
                                        }}
                                    >
                                        {this.state.answers.map((answer) => (
                                            <ListItem key={answer.id}>
                                                <ListItemText primary={answer.answer} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Grid>
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
                                <Grid item xs={8}>
                                    <Button fullWidth color='primary' variant='contained' onClick={() => {
                                        ws.send(JSON.stringify({
                                            action: "change_current_question",
                                            room_pk: this.state.roomId,
                                            question_pk: (this.state.currentQuestion + 1),
                                            request_id: this.state.userId,
                                        }))
                                        this.setState({ ...this.state, currentQuestion: this.state.currentQuestion + 1 })
                                        console.log(this.state)
                                    }}>
                                        Następne pytanie
                                    </Button>
                                </Grid> : null}
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        )
    }
}

export default LiveSitting