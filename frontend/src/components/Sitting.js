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
      roomList: [],
      selectedRoom: 0,
    }
  }
  componentDidMount() {
    axiosInstance.get('/sitting/active_rooms/')
      .then(response => {
        this.setState({ ...this.state, roomList: response.data.room_list })
      })

  }

  handleChange = (e) => {
    this.setState({ ...this.state, selectedRoom: e.target.value })
  };

  render() {
    return (<div>

      <Container maxWidth="sm" component="main">
        <Container component="main" maxWidth="sm" sx={{ m: 4 }}>
          <Paper elevation={16} spacing={2}>
            <Box m={2} pt={2}>
              <Grid container spacing={2}>
                {this.state.roomList.length > 0 ?
                  <>
                    <Grid item xs={12}>
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
                        id="selected_room"
                        label="Posiedzenie"
                        name="selected_room"
                        autoComplete="selected_room"
                        onChange={this.handleChange}
                      >
                        {
                          this.state.roomList.map((room) => (
                            <MenuItem key={room.pk} value={room.pk}>
                              {room.name}
                            </MenuItem>
                          ))
                        }
                      </TextField>
                    </Grid></> :
                  <Typography component="h1" variant="h5">
                    Brak trwających posiedzeń.
                  </Typography>
                }
                <Grid item xs={6} align="center">
                  <Button fullWidth color="primary" variant="contained" onClick={() => { this.props.history.push('/live_sitting', { room_id: this.state.selectedRoom, user_id: getUser() }) }}>
                    Dołącz
                  </Button>
                </Grid>
                <Grid item xs={6} align="center">
                  <Button fullWidth color="secondary" variant="contained" to="/" component={Link}>
                    Powrót
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
      </Container>
    </div>)
  }
}

export default Sitting