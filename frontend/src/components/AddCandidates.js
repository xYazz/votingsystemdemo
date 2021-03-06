import React, { useState } from 'react';
import axiosInstance from '../axios';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Container from '@material-ui/core/Container';
import { useSnackbar } from 'notistack';
import { isValidName } from './Register';

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


const promptResponse = ( snackbar, message, variant) => {
	if (variant == 'success') {
		snackbar(message, { variant });
	}
	else {
		snackbar(message, { variant });
	}
};

const validateCandidateData = (first_name, last_name, description) => {

	if (isValidName(first_name) && isValidName(last_name)) {
		if (first_name.length > 100) { return "Długość imienia nie może przekraczać 100 znaków." };
		if (last_name.length > 100) { return "Długość nazwiska nie może przekraczać 100 znaków." };
		if (description.length > 500) { return "Długość nazwiska nie może przekraczać 100 znaków." };
		if (!description || !first_name || !last_name) { return "Uzupełnij wymagane pola." }
		return true
	} else {
		return "Nieprawidłowe imię bądź nazwisko."
	}



}

export default function AddCandidate(props) {
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();
	const initialFormData = Object.freeze({
		first_name: '',
		last_name: '',
		description: '',
	});

	const vote = props.location.state
	const [formData, updateFormData] = useState(initialFormData);

	const handleChange = (e) => {
		updateFormData({
			...formData,
			// Trimming any whitespace
			[e.target.name]: e.target.value.trim(),
		});
	};



	const handleButtonPressed = (e) => {
		e.preventDefault();
		console.log(props)
		const validation = validateCandidateData(formData.first_name, formData.last_name, formData.description)
		if (validation == true) {
			axiosInstance.post("/api/add_candidate/" + vote.vote_id, {
				first_name: formData.first_name,
				last_name: formData.last_name,
				description: formData.description
			}).catch(error => {
				promptResponse(enqueueSnackbar, 'Serwer odrzucił połączenie.', 'error');
			})
				.then(response => {
					if (response.status == 201) {
						promptResponse(enqueueSnackbar, 'Pomyślnie dodano kandydata.', 'success');
					} else {
						promptResponse(enqueueSnackbar, 'Serwer odrzucił połączenie.', 'error');
					}
				})
		} else {
			promptResponse(enqueueSnackbar, validation, 'error');
		}

	}

	const classes = useStyles();

	return (


		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}></Avatar>
				<Typography component="h1" variant="h5">
					Dodaj kandydata
				</Typography>
				<form className={classes.form} noValidate>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="first_name"
								label="First name"
								name="first_name"
								autoComplete="first_name"
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="last_name"
								label="Last name"
								name="last_name"
								autoComplete="last_name"
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="description"
								label="Program kandydata"
								name="description"
								autoComplete="description"
								onChange={handleChange}
							/>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}

						onClick={handleButtonPressed}
					>
						Utwórz
					</Button>
					<Grid container justifyContent="flex-end">
					</Grid>
				</form>
			</div>
		</Container>);
}

export { validateCandidateData, promptResponse }