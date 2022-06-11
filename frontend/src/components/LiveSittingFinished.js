import React, { Component } from 'react'
import { Container, Paper, Box, Grid, TextField, Button, Typography } from '@mui/material';
import MenuItem from '@material-ui/core/MenuItem';
import axiosInstance from '../axios';
import PieChart, {
    Series,
    Label,
    Connector,
    Export,
} from 'devextreme-react/pie-chart';
import LoadingPage from './LoadingPage';

export class LiveSittingFinished extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: this.props.location.state.room_id,
            questions: this.props.location.state.questions ?
                this.props.location.state.questions : [],
            userId: this.props.location.state.user_id,
            allowedUsers: this.props.location.state.questions ?
                this.props.location.state.allowed_users : [],
            notVoted: '0',
            showVoters: false,
            results: [],
            currentQuestion: 0,
            votedForAnswer: [],
            answers: this.props.location.state.questions ?
                this.props.location.state.questions[0].answers : []
        }
    }
    getNotVoted = (allowedUsers, answers) => {
        let not_voted = 0
        answers.map(answer => {
            not_voted += answer.times_voted;
        })
        return (allowedUsers - not_voted).toString()
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
    handleChange = (event) => {
        let updated_answers = []
        this.state.questions[event.target.value].answers.map(answer => {
            updated_answers.push({ answer: answer.answer, times_voted: answer.times_voted });
        })
        this.setState({ ...this.state, 
            currentQuestion: event.target.value, 
            showVoters: false, 
            votedForAnswer: [], 
            answers: updated_answers, 
            notVoted: this.getNotVoted(this.state.allowedUsers, updated_answers) })
    }

    getResults() {
        var results = []
        axiosInstance.get(
            'sitting/room/' + this.state.roomId)
            .then(response => {
                if (response.status == 200) {
                    results.push(response.data.room.questions);
                    results.push(response.data.room.allowed_users.length);
                    results.push(response.data.room.questions[0].answers);

                }
            })
        return results
    }
    getPublicData(question_pk) {
        axiosInstance.get('sitting/votedforanswer/' + this.state.questions[question_pk].pk)
            .then(response => {
                if (response.status == 200) {
                    this.setState({ ...this.state, showVoters: true, votedForAnswer: response.data })
                }
            })


    }
    componentDidMount() {
        axiosInstance.get(
            'sitting/room/' + this.state.roomId)
            .then(response => {
                if (response.status == 200) {
                    this.setState({
                        ...this.state,
                        questions: response.data.room.questions,
                        allowedUsers: response.data.room.allowed_users.length,
                        answers: response.data.room.questions[0].answers,
                        is_public: response.data.room.is_public,
                        notVoted: this.getNotVoted(response.data.room.allowed_users.length, response.data.room.questions[0].answers)
                    });
                }
            })
    }
    render() {
        return (
            <Container component="main" maxWidth="md" sx={{ m: 4 }}>
                <Paper elevation={16} spacing={2}>
                    <Box m={2} pt={2}>
                        {this.state.questions ?
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        select
                                        fullWidth
                                        id="question"
                                        label="Pytanie"
                                        name="question"
                                        autoComplete="question"
                                        defaultValue={0}
                                        onChange={this.handleChange}
                                    >
                                        {this.state.questions.map((question, idx) => (
                                            <MenuItem key={question.pk} value={idx}>
                                                {question.question}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <PieChart
                                        id="pie"
                                        dataSource={this.state.answers}
                                        palette="Bright"
                                        title={'Nie zagłosowało: ' + this.state.notVoted}
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
                                {this.state.is_public ?
                                    <Grid item xs={12}>
                                        <Button onClick={() => this.getPublicData(this.state.currentQuestion)}>
                                            Pokaż imiona
                                        </Button>
                                        {this.state.showVoters ?
                                            this.state.questions[this.state.currentQuestion].answers.map(answer => {
                                                return <React.Fragment>
                                                    <Grid item xs={12}>
                                                        <Typography>{answer.answer}:</Typography>
                                                    </Grid>

                                                    {this.state.votedForAnswer[answer.answer].length == 0 ?
                                                        <Grid item xs>
                                                            Brak głosów.
                                                        </Grid> : null}
                                                    {this.state.votedForAnswer[answer.answer].map((user, idx) => {
                                                        return <Grid item xs>
                                                            {user.first_name} {user.last_name}{idx < this.state.votedForAnswer[answer.answer].length - 1 ? ', ' : ''}
                                                        </Grid>
                                                    })
                                                    }
                                                </React.Fragment>
                                            }) : null}
                                    </Grid> : null
                                }
                            </Grid> : <LoadingPage/>}
                    </Box>
                </Paper>
            </Container>
        )
    }
}

export default LiveSittingFinished