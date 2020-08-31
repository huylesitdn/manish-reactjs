import React, { useEffect, useState } from 'react';
import './index.scss';
import { withRouter, Link } from 'react-router-dom';
import Axios from 'axios';
import { Button } from 'antd';

const URL_PROFILE = `https://tgkp8rza8b.execute-api.ap-south-1.amazonaws.com/test/userdata`;

function Home(props) {
	const [dataUser, setDateUser] = useState(null);

	useEffect(() => {
		getProfile();
	}, []);

	const getProfile = () => {
		let token = localStorage.getItem('_token');

		Axios.post(
			URL_PROFILE,
			{},
			{
				headers: {
					Authorization: 'Bearer ' + token,
				},
			}
		)
			.then(res => {
				if (res.status === 200) {
					setDateUser(res.data.result);
				}
			})
			.catch(err => {
				console.log(err);
			});
	};

	const onLogout = () => {
		localStorage.removeItem('_token');
		props.history.push('/login');
	};

	return (
		<div className="home-page">
			<div className="home-content">
				<h1>Home page</h1>
				<p>
					<Link to="/new-appointment">Create Appointment</Link>
				</p>
				{dataUser && dataUser.name && <h4 style={{ marginBottom: '30px' }}>Hello {dataUser.name}!</h4>}
				{dataUser ? <Button onClick={onLogout}>Logout</Button> : <Link to="/login">Login</Link>}
			</div>
		</div>
	);
}

export default withRouter(Home);
