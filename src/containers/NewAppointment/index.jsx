import React, { useState } from 'react';
import './index.scss';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Form, Input, InputNumber, Button, DatePicker, TimePicker, Radio, Row, Col, message } from 'antd';
import Axios from 'axios';

const { RangePicker } = TimePicker;

const URL_CREATE_APPOINTMENT = `https://tgkp8rza8b.execute-api.ap-south-1.amazonaws.com/test/addappiontmentmeetinterval`;

function NewAppointment(props) {
	const [duration, setDuration] = useState('15MIN');
	const [totalInterval, setTotalInterval] = useState(1);
	const [totalDuration, setTotalDuration] = useState(1);

	const onChangeDuration = e => {
		console.log(e);
		setDuration(e.target.value);
	};

	const onFinish = values => {
		console.log(values);

		const { appiontment, default_timeout } = values;

		let interval = [];
		for (let i = 0; i < totalInterval; i++) {
			let obj = {
				start_time: values[`time_interval_${i}`][0].format('hh:mm'),
				end_time: values[`time_interval_${i}`][1].format('hh:mm'),
			};
			console.log('interval obj: ', obj);
			interval.push(obj);
		}
		console.log('interval: ', interval);

		let serviceoption = [];
		for (let i = 0; i < totalDuration; i++) {
			let obj = {
				serviceName: values[`serviceName_${i}`],
				time: values[`time_${i}`],
			};
			console.log('serviceoption obj: ', obj);
			serviceoption.push(obj);
		}
		console.log('serviceoption: ', serviceoption);

		let data = {
			appiontment,
			default_timeout,
			interval,
			serviceoption,
			setDate: [
				{
					today: 'true',
					week: [1, 2],
					customday: ['12-8-2020', '13-8-2020'],
					weekholidays: [1, 2, 3],
					customholidays: ['15-8-2020', '16-8-2020'],
				},
			],
			userId: '27771wwqkqas7kkk774www24',
			spaceId: '123',
		};

		console.log('data: ', data);

		let token = localStorage.getItem('_token');
		if (token) {
			Axios.post(URL_CREATE_APPOINTMENT, data, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
				.then(res => {
					console.log(res);
					if (res.status === 200) {
						message.success('Created successfully!');
						props.history.push('/');
					}
				})
				.catch(err => {
					console.log(err);
					message.error('Created failed!');
				});
		} else {
			props.history.push('/login');
		}
	};

	const renderTimeInterval = () => {
		const results = [];
		for (let i = 0; i < totalInterval; i++) {
			if (i === 0) {
				results.push(
					<div key={i} className="sub-item">
						<Form.Item name={`time_interval_${i}`}>
							<RangePicker format="h:mm" bordered={true} />
						</Form.Item>
					</div>
				);
			} else {
				results.push(
					<div key={i} className="sub-item">
						<Form.Item name={`time_interval_${i}`}>
							<RangePicker format="h:mm" bordered={true} />
						</Form.Item>
						<Button
							onClick={() => setTotalInterval(totalInterval - 1)}
							className="btn-remove"
							type="link"
							danger
							icon={<MinusCircleOutlined />}
						/>
					</div>
				);
			}
		}
		return results;
	};

	const renderTimeDuration = () => {
		let results = [];
		for (let i = 0; i < totalDuration; i++) {
			if (i === 0) {
				results.push(
					<Row gutter={24} key={i}>
						<Col md={10}>
							<Form.Item name={`serviceName_${i}`}>
								<Input placeholder="Please enter Service" />
							</Form.Item>
						</Col>
						<Col md={10}>
							<Form.Item name={`time_${i}`}>
								<Input placeholder="Please enter Service" />
							</Form.Item>
						</Col>
					</Row>
				);
			} else {
				results.push(
					<Row gutter={24} key={i}>
						<Col md={10}>
							<Form.Item name={`serviceName_${i}`}>
								<Input placeholder="Please enter Service" />
							</Form.Item>
						</Col>
						<Col md={10}>
							<Form.Item name={`time_${i}`}>
								<Input placeholder="Please enter Service" />
							</Form.Item>
						</Col>
						<Col md={4}>
							<Button
								onClick={() => setTotalDuration(totalDuration - 1)}
								className="btn-remove"
								type="link"
								danger
								icon={<MinusCircleOutlined />}
							/>
						</Col>
					</Row>
				);
			}
		}

		return results;
	};

	return (
		<div className="new-appointment">
			<div className="new-appoint-content">
				<Form onFinish={onFinish} layout="vertical">
					<div className="app-item">
						<h3>Set appointment timing:</h3>
						<Form.Item label="Appointment name:" name="appiontment">
							<Input placeholder="Enter Appointment name" />
						</Form.Item>
					</div>

					<div className="app-item">
						<h3>Select time duration:</h3>

						<Form.Item name="default_timeout">
							<Radio.Group value={duration} onChange={onChangeDuration}>
								<Radio.Button value="15MIN">15 Min</Radio.Button>
								<Radio.Button value="20MIN">20 Min</Radio.Button>
								<Radio.Button value="30MIN">30 Min</Radio.Button>
							</Radio.Group>
						</Form.Item>
					</div>

					<div className="app-item">
						<h3>Set time Interval: A</h3>

						{/* <div className="sub-item">
							<RangePicker use12Hours format="h:mm a" bordered={true} />
							<Button className="btn-remove" type="link" danger icon={<MinusCircleOutlined />} />
						</div> */}

						{renderTimeInterval()}

						<div className="action-new">
							<Button
								onClick={() => setTotalInterval(totalInterval + 1)}
								type="link"
								icon={<PlusCircleOutlined />}
							/>
						</div>
					</div>

					<div className="app-item">
						<h3>Services time duration:</h3>
						{renderTimeDuration()}
						<div className="action-new">
							<Button
								onClick={() => setTotalDuration(totalDuration + 1)}
								type="link"
								icon={<PlusCircleOutlined />}
							/>
						</div>
					</div>

					<div className="actions">
						<Button>Back</Button>
						<Button type="primary" htmlType="submit">
							Continue
						</Button>
					</div>
				</Form>
			</div>
		</div>
	);
}

export default withRouter(NewAppointment);
