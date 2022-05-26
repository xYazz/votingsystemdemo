import React, { Component } from 'react'
import { Container, Paper, Box, Grid, TextField } from '@mui/material';
import MenuItem from '@material-ui/core/MenuItem';
import axiosInstance from '../axios';
import PieChart, {
    Series,
    Label,
    Connector,
    Export,
} from 'devextreme-react/pie-chart';

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
            currentQuestion: 0,
            answers: this.props.location.state.questions ?
                this.props.location.state.questions[0].answers : []
        }
    }
    getNotVoted = () => {
        let not_voted = 0
        this.state.answers.map(answer => {
            not_voted += answer.times_voted;
        })

        return (this.state.allowedUsers - not_voted).toString()
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
    handleChange = async (event) => {
        let updated_answers = []
        this.state.questions[event.target.value].answers.map(answer => {
            updated_answers.push({ answer: answer.answer, times_voted: answer.times_voted });
        })
        console.log(updated_answers)
        this.setState({ ...this.state, currentQuestion: event.target.value, answers: updated_answers, notVoted: this.getNotVoted() })
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

    componentDidMount() {
        console.log(this.state)
        if (this.state.questions.length > 0) {
            this.setState({ ...this.state, notVoted: this.getNotVoted() })
        } else {
            axiosInstance.get(
                'sitting/room/' + this.state.roomId)
                .then(response => {
                    if (response.status == 200) {
                        this.setState({
                            ...this.state,
                            questions: response.data.room.questions,
                            allowedUsers: response.data.room.allowed_users.length,
                            answers: response.data.room.questions[0].answers,
                            notVoted: this.getNotVoted()
                        });
                    }
                })

        }
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
                            </Grid> : 'test'}
                    </Box>
                </Paper>
            </Container>
        )
    }
}

export default LiveSittingFinished