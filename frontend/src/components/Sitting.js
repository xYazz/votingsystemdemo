import React, { Component } from 'react'
import axiosInstance from '../axios'
import { useState } from 'react'
import { Button, Typography, TextField, Grid, Container, Paper, MenuItem, Box } from '@material-ui/core';
import { getUser } from './Header';
import { Link } from 'react-router-dom';

export class Sitting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSittingsList: [],
      finishedSittingsList: [],
      selectedRoom: 0,
      redirectOnSubmitTo: 'url',
    }
  }

  goToSelectedRoom = () => {
    this.props.history.push(this.state.redirectOnSubmitTo,
      { room_id: this.state.selectedRoom, user_id: getUser() })
  }
  componentDidMount() {
    axiosInstance.get('sitting/ongoing_and_finished_rooms/')
      .then(response => {
        this.setState({
          ...this.state,
          activeSittingsList: response.data.ongoing_sittings,
          finishedSittingsList: response.data.finished_sittings
        })
      })

  }

  handleChange = (e) => {
    this.setState({
      ...this.state,
      selectedRoom: e.target.value,
      redirectOnSubmitTo:
        e.target.name == 'active_sittings'
          ? '/live_sitting'
          : '/finished_sitting'
    })
    console.log(e.target.value),
    console.log(e.target.name)
  };

  render() {
    return (<div>
      <Container maxWidth="sm" component="main">
        <Container component="main" maxWidth="sm" sx={{ m: 4 }}>
          <Paper elevation={16} spacing={2}>
            <Box m={2} pt={2}>
              <Grid container spacing={2}>
                {this.state.activeSittingsList.length > 0
                  ? <><Grid item xs={12}>
                    <Typography component="h1" variant="h5">
                      Trwające posiedzenia:
                    </Typography>
                  </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        required
                        select
                        fullWidth
                        id="active_sittings"
                        label="Posiedzenie"
                        name="active_sittings"
                        autoComplete="active_sittings"
                        onChange={this.handleChange}
                      >
                        {
                          this.state.activeSittingsList.map((room) => (
                            <MenuItem key={room.pk} value={room.pk}>
                              {room.name}
                            </MenuItem>
                          ))
                        }
                      </TextField>
                    </Grid></>
                  : null}
                {this.state.finishedSittingsList.length > 0
                  ? <><Grid item xs={12}>
                    <Typography component="h1" variant="h5">
                      Zakończone posiedzenia:
                    </Typography>
                  </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        required
                        select
                        fullWidth
                        id="finished_sittings"
                        label="Posiedzenie"
                        name="finished_sittings"
                        autoComplete="finished_sittings"
                        onChange={this.handleChange}
                      >
                        {
                          this.state.finishedSittingsList.map((room) => (
                            <MenuItem key={room.pk} value={room.pk}>
                              {room.name}
                            </MenuItem>
                          ))
                        }
                      </TextField>
                    </Grid></>
                  : null}
                {!this.state.finishedSittingsList && !this.state.activeSittingsList ?
                  <Typography component="h1" variant="h5">
                    Brak trwających posiedzeń.
                  </Typography> :
                  this.state.selectedRoom ?
                    <><Grid item xs={6} align="center">
                      <Button fullWidth color="primary" variant="contained" onClick={() => this.goToSelectedRoom()}>
                        Dołącz
                      </Button>
                    </Grid>
                      <Grid item xs={6} align="center">
                        <Button fullWidth color="secondary" variant="contained" to="/" component={Link}>
                          Powrót
                        </Button>
                      </Grid></> : null
                }
              </Grid>
            </Box>
          </Paper>
        </Container>
      </Container>
    </div>)
  }
}

export default Sitting