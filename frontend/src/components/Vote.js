import React, { Component } from 'react';
import moment from "moment";
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import { withStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import axiosInstance from '../axios';
import jwtDecode from 'jwt-decode';

const useStyles = makeStyles(() => ({
	cardMedia: {
		paddingTop: '56.25%', // 16:9
	},
	link: {
		margin: useTheme().spacing(1, 1.5),
	},
	cardHeader: {
		backgroundColor:
		useTheme().palette.mode === 'light'
				? useTheme().palette.grey[200]
				: useTheme().palette.grey[700],
	},
	voteTitle: {
		fontSize: '16px',
		textAlign: 'left',
	},
	voteText: {
		display: 'flex',
		justifyContent: 'left',
		alignItems: 'baseline',
		fontSize: '12px',
		textAlign: 'left',
		marginBottom: useTheme().spacing(2),
	},
}));



class Vote extends Component {
    constructor(props){
        super(props);
        this.state = {
			user:  localStorage.getItem('access_token')?jwtDecode(localStorage.getItem('access_token')).user_id:null,
            type: false,
            name: false,
            description: false,
            start_date: moment().format("DD-MM-YYYY hh:mm:ss"),
            end_date: moment().format("DD-MM-YYYY hh:mm:ss"),
            max_votes: this.defaultMaxVotes,
			vote_voter: [],
            candidates: [],
			picked_votes: 0,
			picked_candidates: [],
			able_to_vote: true
        };
        this.id=this.props.location.state.vote_id;
        this.getVoteDetails();
		this.getVoteVoterDetails();
    }

    getVoteDetails() {
         axiosInstance('/api/get-vote/'+this.id).then((response) =>{
			console.log(this.id)
            this.setState({
                type: response.data.type,
                name: response.data.name,
                description: response.data.description,
                max_votes: response.data.max_votes,
                start_date: response.data.start_date,
                end_date: response.data.end_date,
                candidates: response.data.candidates
               });
          });
    }

	getVoteVoterDetails() {
		axiosInstance.get('/api/vote_voter', {params: {vote: this.id, user: this.state.user}}).then((response) => {
			console.log(response.data)
			if(response.data.length>0){
				this.setState({
				able_to_vote: false
				})
			}	   
		}).catch(error => {
			console.log(error);
		});
	}

	handleChange = (event) => {
		console.log(event.target.value);
		(this.state.picked_candidates.filter(element => element == event.target.value)).length>0?
		this.setState({
			...this.state,
			picked_votes: this.state.picked_votes-1,
			picked_candidates: [...this.state.picked_candidates.filter(element => element != event.target.value)]
			
		  }):
		this.setState({
			...this.state,
			picked_votes: this.state.picked_votes+1,
			picked_candidates: [...this.state.picked_candidates, event.target.value]
			
		  });
	  };
	  
	  handleVoteButtonPressed = () => {
		if (this.state.picked_candidates.length<=this.state.max_votes &&this.state.picked_candidates.length>0){
			console.log("test")
			this.state.picked_candidates.map(candidate => {
				axiosInstance.post("api/submit_vote/", {
					vote: this.id,
					voter: this.state.user,
					candidate: candidate,
				})
				.then((response) => {this.props.history.push("/")});
			})
		}
        
    }
    render() {
		
		const error = this.state.picked_votes>this.state.max_votes;
		const { classes } = this.props;
        return <div>
            {console.log(this.state)}
            <h3>{this.name}</h3>
            <p>Rodzaj głosowania: {this.state.type}</p>
            <p>Opis głosowania: {this.state.description}</p>
            <p>Maksymalna ilość głosów oddanych przez wyborcę: {this.state.max_votes}</p>
            <p>Data rozpoczęcia: {this.state.start_date}</p>
            <p>Data zakończenia: {this.state.end_date}</p>
			{(this.state.candidates.length<1)?
			<h2>Brak kandydatów. Skontaktuj się z twórcą głosowania</h2>:
			(this.state.able_to_vote==true)?
			<Box sx={{ display: 'flex', justifySelf: 'center'}}>
			<FormControl
				required
				error={error}
				component="fieldset"
				sx={{ m: 3 }}
				variant="standard"
			>	
				<FormLabel component="legend">Wybierz kandydatów</FormLabel>
				<FormGroup aria-label='position' row>
				{this.state.candidates.map((candidate) => {
				return(
					<Tooltip title={<h2>{candidate.description}</h2>}>
				<FormControlLabel
					control={
					<Checkbox color='primary' value={candidate.id} checked={(this.state.picked_candidates.filter(element => element == candidate.id)).length>0?true:false} onChange={(e)=>this.handleChange(e)} name={candidate.first_name+" "+candidate.last_name} />
					}
					label={candidate.first_name+" "+candidate.last_name}
				/></Tooltip>
				
				)})}
				</FormGroup>
				<FormHelperText>Maksymalnie możesz wybrać {this.state.max_votes} {(this.state.max_votes==1)?
					'kandydata':'kandydatów'}
				</FormHelperText>
			</FormControl>
			<Stack spacing={2} direction="row" justifyContent={"center"}>
					<Button color="primary" variant="contained" onClick={this.handleVoteButtonPressed}>
						Oddaj głos
					</Button>
					<Button margin="15px" color="secondary" variant="contained" to="/vote/"{...this.id} component={Link}>
						Powrót
					</Button>
			</Stack>
			</Box>:<h2>Nie można oddać więcej głosów. Wyniki zostaną udostępnione po zakończeniu głosowania.</h2>}



        </div>
    }
}

export default withStyles(useStyles)(Vote);