import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withStyles } from "@material-ui/core/styles";
import { CardActionArea, CardHeader } from '@material-ui/core';
import { Redirect } from 'react-router';
import axiosInstance from '../axios';
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import { Paper } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
	cardMedia: {
		paddingTop: '56.25%', // 16:9
	},
	link: {
		margin: theme.spacing(1, 1.5),
	},
	cardHeader: {
		backgroundColor:
			theme.palette.type === 'light'
				? theme.palette.grey[200]
				: theme.palette.grey[700],
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
		marginBottom: theme.spacing(2),
	},
}));

class Votes extends React.Component {
	constructor() {
		super()
		this.state = {
			votes: [], toUrl: '/vote/'
		}
	}

	getCurrentVotes = () => {
		axiosInstance("api/votes")
			.then((response) => {
				this.setState({ ...this.state, votes: response.data, toUrl: '/vote' });
			}).catch(error => {
				console.log(error)
			})
	}

	getFinishedVotes = () => {
		axiosInstance("api/finished_votes")
			.then((response) => {
				this.setState({ votes: response.data, toUrl: "/results" });
			}).catch(error => {
				console.log(error.response.data)
			})
	}

	componentDidMount() {
		this.getCurrentVotes();
	}




	render() {
		const { classes } = this.props;
		return (<div>
			{this.state?.votes?.length > 0 ? <React.Fragment>
				<Stack spacing={2} direction="row" justifyContent={"center"} marginTop={"15px"} marginBottom={"15px"}>
					<Button color="primary" variant="contained" onClick={this.getCurrentVotes}>
						Trwające głosowania
					</Button>
					<Button color="secondary" variant="contained" onClick={this.getFinishedVotes}>
						Zakończone głosowania
					</Button>
				</Stack>
				<Container maxWidth="md" component="main" display='flex' >
					<Grid container spacing={5} alignItems="flex-end" >
						{this.state.votes.map((vote) => {
							return (
								// Enterprise card is full width at sm breakpoint
								<Grid item key={vote.id} xs={12} md={3}>
									<Card className={classes.card}>
										<CardMedia
											className={classes.cardMedia}
										/>
										<CardActionArea onClick={() => { this.props.history.push(this.state.toUrl, { vote_id: vote.id }) }}>
											<CardContent className={classes.cardContent}>
												<Typography
													gutterBottom
													variant="h6"
													component="h2"
													className={classes.voteTitle}
												>
													{vote.name}...
												</Typography>
												<div className={classes.voteText}>
													<Typography color="textSecondary">
														{vote.description}...
													</Typography>
												</div>
											</CardContent>
										</CardActionArea>
									</Card>
								</Grid>
							);
						})}
					</Grid>
				</Container>
			</React.Fragment> :
				<Container maxWidth="sm" component="main" display='flex' >
					<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
						<Typography component="h1" variant="h5">
							Brak głosowań do wyświetlenia
						</Typography>
					</Paper>
				</Container>
			}
		</div>
		);
	}
};
export default withStyles(useStyles)(Votes);;