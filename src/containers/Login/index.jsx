import React, { useState } from 'react';
import './index.scss';
import { withRouter } from 'react-router-dom';
import { Form, Input, Button, message, Spin } from 'antd';
import Axios from 'axios';

const URL_LOGIN = 'https://tgkp8rza8b.execute-api.ap-south-1.amazonaws.com/test/userlogin';

function Login(props) {
	const [isLoading, setLoading] = useState(false);

	const onFinish = async values => {
		const { email, password } = values;

		setLoading(true);

		Axios.post(URL_LOGIN, { email, password })
			.then(res => {
				console.log(res);
				setLoading(false);
				if (res.status === 200) {
					message.success('Login successfully!');
					localStorage.setItem('_token', res.data.token);
					props.history.push('/');
				}
			})
			.catch(err => {
				console.log(err);
				setLoading(false);
			});
	};

	return (
		<Spin spinning={isLoading}>
			<div className="login-page">
				<Form onFinish={onFinish} layout="vertical">
					<Form.Item
						label="Username"
						name="email"
						rules={[
							{
								type: 'email',
								message: 'The input is not valid E-mail!',
							},
							{
								required: true,
								message: 'Please input your E-mail!',
							},
						]}
					>
						<Input placeholder="Username" />
					</Form.Item>
					<Form.Item
						label="Password"
						name="password"
						rules={[{ required: true, message: 'Please input your password!' }]}
					>
						<Input.Password placeholder="Password" />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit" block>
							Login
						</Button>
					</Form.Item>
				</Form>
			</div>
		</Spin>
	);
}

export default withRouter(Login);
