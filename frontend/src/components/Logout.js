import React, { useEffect } from 'react';
import axiosInstance from '../axios';
import { useHistory } from 'react-router-dom';
import LoadingPage from './LoadingPage';
export default function SignOut() {
	const history = useHistory();

	useEffect(() => {
		const response = axiosInstance.post('api/auth/blacklist', {
			'refresh_token': localStorage.getItem('refresh_token'),
		});
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		axiosInstance.defaults.headers['Authorization'] = null;
		history.push('/login');
	}), [];
	return <div><LoadingPage /></div>;
}