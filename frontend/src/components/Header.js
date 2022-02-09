import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import jwtDecode from 'jwt-decode';
import dayjs from 'dayjs'
import axiosInstance from '../axios';
import axios from 'axios';

const getUser = () => {
	let refreshToken=localStorage.getItem('refresh_token')?jwtDecode(localStorage.getItem('refresh_token')):null;
	if(refreshToken!=null){
		let user = refreshToken.user_id;
		let isExpired = dayjs.unix(refreshToken.exp).diff(dayjs()) < 1;
		if(!isExpired){
			return true
		} else{
			return false
			}
	} else {
		return false
	}	
}

const useStyles = makeStyles((theme) => ({
	appBar: {
        width: "100%",
		borderBottom: `1px solid ${theme.palette.divider}`,
	},
	link: {
		margin: theme.spacing(1, 1.5),
	},
	toolbarTitle: {
		flexGrow: 1,
	},
}));



function Header(props) {
	const classes = useStyles();
	const user = getUser();
	return (
		
		<React.Fragment>
			<CssBaseline />
			<AppBar
				position="static"
				color="default"
				elevation={0}
				className={classes.appBar}
			>	
				
				<Toolbar className={classes.toolbar}>
					<Typography
						variant="h6"
						color="inherit"
						noWrap
						className={classes.toolbarTitle}
					>
						<Link
							component={NavLink}
							to="/"
							underline="none"
							color="textPrimary"
						>
							Blog
						</Link>
					</Typography>
					{(!user)?
					<><nav>
						<Link
							color="textPrimary"
							href="#"
							className={classes.link}
							component={NavLink}
							to="/register"
						>
							Rejestracja
						</Link>
					</nav>
					<Button
						href="#"
						color="primary"
						variant="outlined"
						className={classes.link}
						component={NavLink}
						to="/login"
					>
						Logowanie
					</Button></>
					:<>
					<Button
						href="#"
						color="primary"
						variant="outlined"
						className={classes.link}
						component={NavLink}
						to="/create"
					>
						Utwórz głosowanie
					</Button>
					<Button
						href="#"
						color="primary"
						variant="outlined"
						className={classes.link}
						component={NavLink}
						to="/votes"
					>
						Lista głosowań
					</Button>
					<Button
						href="#"
						color="primary"
						variant="outlined"
						className={classes.link}
						component={NavLink}
						to="/join"
					>
						Dołącz do głosowania
					</Button>
					<Button
						href="#"
						color="primary"
						variant="outlined"
						className={classes.link}
						component={NavLink}
						to="/pending"
					>
						Prośby o dołączenie
					</Button>
					<Button
						color="primary"
						variant="outlined"
						className={classes.link}
						component={NavLink}
						to="/profile"
					>
						Profil
					</Button>
					<Button
						href="#"
						color="primary"
						variant="outlined"
						className={classes.link}
						component={NavLink}
						to="/logout"
					>
						Wylogowanie
					</Button></>
					}
					
					
				</Toolbar>
			</AppBar>
		</React.Fragment>
	);
}

export default Header;