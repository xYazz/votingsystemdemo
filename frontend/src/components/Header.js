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
import { useHistory } from 'react-router-dom';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';

const getUser = () => {
	let refreshToken = localStorage.getItem('refresh_token') ? jwtDecode(localStorage.getItem('refresh_token')) : null;
	if (refreshToken != null) {
		let user = refreshToken.user_id;
		let isExpired = dayjs.unix(refreshToken.exp).diff(dayjs()) < 1;
		if (!isExpired) {
			return true
		} else {
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
	paper: {
		zIndex: 1500,
	}
}));



function Header(props) {
	const classes = useStyles();
	const user = getUser();
	const history = useHistory();

	const handleClick = (path) => {
		history.push(path);
	}

	const [open, setOpen] = React.useState(false);
	const anchorRef = React.useRef(null);

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}

		setOpen(false);
	};

	function handleListKeyDown(event) {
		if (event.key === 'Tab') {
		  event.preventDefault();
		  setOpen(false);
		} else if (event.key === 'Escape') {
		  setOpen(false);
		}
	  }
	
	  const prevOpen = React.useRef(open);
	  React.useEffect(() => {
		if (prevOpen.current === true && open === false) {
		  anchorRef.current.focus();
		}
	
		prevOpen.current = open;
	  }, [open]);

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
							VotingSystem
						</Link>
					</Typography>
					{(!user) ? (
						<Stack direction="row" spacing={2}>
							<div>
								<Button
									ref={anchorRef}
									id="composition-button"
									aria-controls={open ? 'composition-menu' : undefined}
									aria-expanded={open ? 'true' : undefined}
									aria-haspopup="true"
									onClick={handleToggle}
								>
									Menu
								</Button>
								<Popper
									open={open}
									anchorEl={anchorRef.current}
									role={undefined}
									placement="bottom-start"
									transition
									disablePortal
								>
									{({ TransitionProps, placement }) => (
										<Grow
											{...TransitionProps}
											style={{
												transformOrigin:
													placement === 'bottom-start' ? 'left top' : 'left bottom',
												flexDirection: 'column',
											}}
										>
											<Paper elevation={18} className={classes.paper}>
												<ClickAwayListener onClickAway={handleClose}>
													<MenuList
														autoFocusItem={open}
														id="composition-menu"
														aria-labelledby="composition-button"
														onKeyDown={handleListKeyDown}
													>	
													
														<MenuItem component={Link} to="/register">Rejestracja</MenuItem>
														<MenuItem component={Link} to="/login">Logowanie</MenuItem>
													</MenuList>
												</ClickAwayListener>
											</Paper>
										</Grow>
									)}
								</Popper>
							</div>
						</Stack>) :(<Stack direction="column" spacing={2}>
							<div>
								<Button
									ref={anchorRef}
									id="composition-button"
									aria-controls={open ? 'composition-menu' : undefined}
									aria-expanded={open ? 'true' : undefined}
									aria-haspopup="true"
									onClick={handleToggle}
								>
									Menu
								</Button>
								<Popper
									open={open}
									anchorEl={anchorRef.current}
									role={undefined}
									className={classes.paper}
									placement="bottom-start"
									transition
									disablePortal
								>
									{({ TransitionProps, placement }) => (
										<Grow
											{...TransitionProps}
											style={{
												transformOrigin:
													placement === 'bottom-start' ? 'left top' : 'left bottom',
											}}
										>
											<Paper elevation={18} className={classes.paper}>
												<ClickAwayListener onClickAway={handleClose}>
													<MenuList
														autoFocusItem={open}
														id="composition-menu"
														aria-labelledby="composition-button"
														onKeyDown={handleListKeyDown}
													>
														<MenuItem component={Link} to="/create">Utwórz głosowanie</MenuItem>
														<MenuItem component={Link} to="/votes">Lista głosowań</MenuItem>
														<MenuItem component={Link} to="/profile">Profil</MenuItem>
														<MenuItem component={Link} to="/join">Dołącz do głosowania</MenuItem>
														<MenuItem component={Link} to="/pending">Prośby o dołączenie</MenuItem>
														<MenuItem component={Link} to="/logout">Wyloguj się</MenuItem>
														
													</MenuList>
												</ClickAwayListener>
											</Paper>
										</Grow>
									)}
								</Popper>
							</div>
						</Stack>)
					}


				</Toolbar>
			</AppBar>
		</React.Fragment >
	);
}

export default Header;