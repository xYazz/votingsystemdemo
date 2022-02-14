import React, { Component, useEffect, useState } from "react";
import LoadingPage from "./LoadingPage";
import { useHistory } from "react-router-dom";
import axiosInstance from "../axios";
import PageNotFound from "./PageNotFound";
import { CssBaseline } from "@mui/material";
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
//import { Chart, Series, Tooltip, Label, ArgumentAxis, Legend } from 'devextreme-react/chart'
import PieChart, {
    Series,
    Label,
    Connector,
    Size,
    Export,
  } from 'devextreme-react/pie-chart';

const choices = [
    "Edukacja",
    "Status społeczny",
    "Miejsce zamieszkania",
]


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

const Results = (props) => {
    const [state, setState] = useState({ loading: true });
    const [choiceData, setChoiceData] = useState();
    const history = useHistory;


    const getData = () => {
        axiosInstance('/api/results/' + props.location.state.vote_id).then((response) => {
            
            setState({
                ...state,
                results: response.data.results?JSON.parse(response.data.results):null,
                detail_id: 0,
                detail_view: false,
                loading: false,
            });
        });
    }

    const handleChange = (e) => {
        if (e.target.value) {
            setChoiceData(
                state.results['Edukacja'][e.target.value],
            )
            setState({
                ...state,
                detail_id: e.target.value,
                detail_view: true
            })
        } else {
            setChoiceData(
                Object.values(state.results['Kandydaci']).map((obj) => ({ label: obj.label, value: obj.value }))
            )
            setState({
                ...state,
                detail_id: 0,
                detail_view: false
            })
        }
    }

    const handleChangeChoice = (e) => {
        if (e.target.value) {
            setChoiceData(
                state.results[e.target.value][state.detail_id],
            )
        }
    }

    const pointClickHandler = (e) => {
        this.toggleVisibility(e.target);
      }
    
      const legendClickHandler = (e) => {
        const arg = e.target;
        const item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];
    
        this.toggleVisibility(item);
      }
    
      const toggleVisibility = (item) => {
        item.isVisible() ? item.hide() : item.show();
      }

    useEffect(() => {
        getData();
    }, []);

    const classes = useStyles();

    return <div>
        <Container component="main" maxWidth="xl" sx={{ mb: 4 }}>
            {state?.loading ? <LoadingPage /> :
                <React.Fragment>
                    <form className={classes.form} noValidate>
                        <Container component="main" maxWidth="xs" sx={{ mb: 2 }}>
                        {state.results?
                        console.log(state.results)
                                <React.Fragment>
                            <Grid container spacing={2}>
                                <Grid item xs={12} align="center">
                                    <Typography component='h4' variant='h4'>
                                        Przegląd wyników
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        select
                                        fullWidth
                                        label="Kandydat"
                                        name="candidate"
                                        onChange={handleChange}
                                    >
                                        <MenuItem key={0} value={0}>
                                            {"Ogólny wynik"}
                                        </MenuItem>
                                        {state.results['Kandydaci'].map((candidate) => (
                                            <MenuItem key={candidate.id} value={candidate.id}>
                                                {candidate.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                {state.detail_view ?
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            select
                                            fullWidth
                                            label="Statystyka"
                                            name="choices"
                                            onChange={handleChangeChoice}
                                        >
                                            {choices.map((choice) => (
                                                <MenuItem key={choice} value={choice}>
                                                    {choice}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid> : null}
                            </Grid>
                            </React.Fragment>:
                            <Grid item xs={12} align="center">
                                    <Typography component='h4' variant='h4'>
                                        Nikt nie wziął udziału w wyborach.
                                    </Typography>
                                </Grid>}
                        </Container>
                    </form>
                    {choiceData ?
                        <PieChart
                        id="pie"
                        dataSource={choiceData}
                        palette="Bright"
                        title="Podsumowanie"
                        onPointClick={this.pointClickHandler}
                        onLegendClick={this.legendClickHandler}
                      >
                        <Series
                          argumentField="label"
                          valueField="value"
                        >
                          <Label visible={true}>
                            <Connector visible={true} width={1} />
                          </Label>
                        </Series>
                
                        <Size width={500} />
                        <Export enabled={true} />
                      </PieChart>
                        // <Chart
                        //     dataSource={choiceData}
                        // >
                        //     <Series
                        //         valueField="value"
                        //         argumentField="label"
                        //         type="bar"
                        //         overlappingBehavior={'stagger'}
                        //     />
                        //     <Legend visible={false} />

                        //     <Tooltip
                        //         enabled={true}
                        //     />
                        // </Chart>
                        : null}
                </React.Fragment>}
        </Container>
    </div>

};
//<div><PieChart data={candidateData} outerRadius={200} innerRadius={100} /></div>
export default Results;

