import React, { useState } from 'react';
import axiosInstance from '../axios';
import { useHistory } from 'react-router-dom';
//MaterialUI
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';

const educations = [
	{
		value: '1',
		label: 'Brak wykształcenia',
	},
	{
		value: '2',
		label: 'Wykształcenie podstawowe',
	},
	{
		value: '3',
		label: 'Wykształcenie gimnazjalne',
	},
	{
		value: '4',
		label: 'Wykształcenie zasadnicze zawodowe',
	},

	{
		value: '5',
		label: 'Wykształcenie branżowe',
	},

	{
		value: '6',
		label: 'Wykształcenie średnie branżowe',
	},

	{
		value: '7',
		label: 'Wykształcenie średnie',
	},

	{
		value: '8',
		label: 'Wykształcenie wyższe',
	},
];
const social_status = [
	{
		value: '1',
		label: 'Osoba pracująca',
	},
	{
		value: '2',
		label: 'Emeryt/rencista',
	},
	{
		value: '3',
		label: 'Uczeń/student',
	},
	{
		value: '4',
		label: 'Osoba pracująca dorywczo',
	},

	{
		value: '5',
		label: 'Osoba bezrobotna',
	},
];
const place_of_residences = [
	{
		value: '1',
		label: 'Miasto powyżej 500 tys. mieszkańców',
	},
	{
		value: '2',
		label: 'Miasto 200-499 tys. mieszkańców',
	},
	{
		value: '3',
		label: 'Miasto 100-199 tys. mieszkańców',
	},
	{
		value: '4',
		label: 'Miasto 50-99 tys. mieszkańców',
	},

	{
		value: '5',
		label: 'Miasto poniżej 50 tys. mieszkańców',
	},

	{
		value: '6',
		label: 'Wieś',
	},
];
const citizenships = [
	{
		value: '1',
		label: 'Polskie',
	},
	{
		value: '2',
		label: 'Inne',
	},

];



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

export default function SignUp() {
	const history = useHistory();
	const initialFormData = Object.freeze({
		email: '',
		password: '',
		first_name: '',
		last_name: '',
		pesel: '',
		social_status: '',
		education: '',
		place_of_residence: '',
		citizenship: '',
		email_err: '',
		first_name_err: '',
		last_name_err: '',
		pesel_err: '',
		password_err: '',
		social_status_err: '',
		place_of_residence_err: '',
		citizenship_err: ''
	});



	const [formData, updateFormData] = useState(initialFormData);

	const handleChange = (e) => {
		isValidField(e.target.name, e.target.value)
	};

	function isValidPesel(pesel) {
		let weight = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
		let sum = 0;
		let controlNumber = parseInt(pesel.substring(10, 11));

		for (let i = 0; i < weight.length; i++) {
			sum += (parseInt(pesel.substring(i, i + 1)) * weight[i]);
		}
		sum = sum % 10;
		return (10 - sum) % 10 === controlNumber;
	}

	function isValidEmail(email) {
		if (typeof email !== "undefined") {
			var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

			if (!pattern.test(email)) {
				return false
			} else {
				return true
			}

		}
	}

	function isValidPassword(password) {
		if (password.length < 8) {
			return false
		} else {
			return true
		}
	}

	function isValidName(formatted_name) {
		if (formatted_name.length > 100) { return false };
		if (/(^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ]+\-[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ]+$)|(^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ]+\s([a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ])+$)|(^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ]+$)/.test(formatted_name)) {
			return true;
		} else {
			return false;
		}
	}

	const validators = {
		isValidPassword,
		isValidEmail,
		isValidName,
		isValidPesel,
	}

	const errors = {
		email: "Nieprawidłowy adres e-mail.",
		first_name: "Wprowadzono niepoprawne znaki.",
		last_name: "Wprowadzono niepoprawne znaki.",
		pesel: "Nieprawidłowy numer PESEL.",
		password: "Hasło powinno zawierać co najmniej 8 znaków.",
		choice: "Pole wymagane"
	}

	const isValidField = (field, value) => {
		let upper_field = ''
		if (field.charAt(0) == "f" || field.charAt(0) == "l") {
			const temp_field = field.slice(-4);
			upper_field = temp_field.charAt(0).toUpperCase() + temp_field.slice(1);
		} else {
			upper_field = field.charAt(0).toUpperCase() + field.slice(1);
		}
		if (value == '') {
			updateFormData({
				...formData,
				[field]: value,
				[`${field}_err`]: "Pole nie może być puste"
			})
		} else {
			if (!validators[`isValid${upper_field}`]?.(value)) {
				updateFormData({
					...formData,
					[field]: value,
					[`${field}_err`]: errors[field]
				})
			} else {
				updateFormData({
					...formData,
					[field]: value,
					[`${field}_err`]: ''
				})

			}
		}

	}

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData);
		let errorstring = ''
		let errorsum = false
		for (const [key, value] of Object.entries(formData)) {

			if (key.slice(-4) == "_err") {
				if (value != undefined) {
					errorstring += value;
				}
			} else {
				if (value == '') {
					isValidField(key, value)
					errorsum=true
				}
			}
		}
		if (errorstring == '' && !errorsum) {
			axiosInstance
				.post(`api/auth/register/`, {
					email: formData.email,
					password: formData.password,
					first_name: formData.first_name,
					last_name: formData.last_name,
					pesel: formData.pesel,
					social_status: formData.social_status,
					education: formData.education,
					place_of_residence: formData.place_of_residence,
					citizenship: formData.citizenship,
				})
				.then((res) => {
					if (res.status == 201) {
						history.push('/login');
					} else {
						console.log(res)
					}
				}).catch(err => {
					alert(err.response.data["Błąd"])
				});
		}
	};

	const classes = useStyles();

	return (
		<Container component="main" maxWidth="xs">
			<Paper elevation={16} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}></Avatar>
				<Typography component="h1" variant="h5">
					Zarejestruj się
				</Typography>
				<form className={classes.form} noValidate>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								error={Boolean(formData.email_err)}
								helperText={formData.email_err}
								fullWidth
								id="email"
								label="Adres e-mail"
								name="email"
								autoComplete="email"
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								error={Boolean(formData.password_err)}
								helperText={formData.password_err}
								fullWidth
								name="password"
								label="Hasło"
								type="password"
								id="password"
								autoComplete="current-password"
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								error={Boolean(formData.first_name_err)}
								helperText={formData.first_name_err}
								fullWidth
								id="first_name"
								label="Imię"
								name="first_name"
								autoComplete="first_name"
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								error={Boolean(formData.last_name_err)}
								helperText={formData.last_name_err}
								fullWidth
								id="last_name"
								label="Nazwisko"
								name="last_name"
								autoComplete="last_name"
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								error={Boolean(formData.pesel_err)}
								helperText={formData.pesel_err}
								fullWidth
								id="pesel"
								label="Pesel"
								name="pesel"
								autoComplete="pesel"
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								select
								fullWidth
								error={Boolean(formData.social_status_err)}
								helperText={errors.choice}
								id="social_status"
								label="Status społeczny"
								name="social_status"
								autoComplete="social_status"
								onChange={handleChange}
							>
								{social_status.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								select
								required
								error={Boolean(formData.education_err)}
								helperText={errors.choice}
								fullWidth
								id="education"
								value={formData.education}
								label="Edukacja"
								name="education"
								autoComplete="education"
								onChange={handleChange}
							>
								{educations.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>

						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								select
								fullWidth
								error={Boolean(formData.place_of_residence_err)}
								helperText={errors.choice}
								id="place_of_residence"
								value={formData.place_of_residence}
								label="Miejsce zamieszkania"
								name="place_of_residence"
								autoComplete="place_of_residence"
								onChange={handleChange}
							>
								{place_of_residences.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								select
								error={Boolean(formData.citizenship_err)}
								helperText={errors.choice}
								fullWidth
								id="citizenship"
								value={formData.citizenship}
								label="Obywatelstwo"
								name="citizenship"
								autoComplete="citizenship"
								onChange={handleChange}
							>
								{citizenships.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
						onClick={handleSubmit}
					>
						Zarejetruj się
					</Button>
					<Grid container justify="flex-end">
						<Grid item>
							<Link href="/login" variant="body2">
								Masz już konto? Zaloguj się.
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
			</Paper>
		</Container>
	);
}

export { useStyles }