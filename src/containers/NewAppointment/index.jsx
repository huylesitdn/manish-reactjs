import React, { useState } from 'react';
import './index.scss';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button, TimePicker, Radio, Row, Col, message, Checkbox } from 'antd';
import Axios from 'axios';
import Calendar from 'react-calendar-multiday';

const { RangePicker } = TimePicker;

const URL_CREATE_APPOINTMENT = `https://tgkp8rza8b.execute-api.ap-south-1.amazonaws.com/test/addappiontmentmeetinterval`;

function NewAppointment(props) {
	const [form] = Form.useForm();

	const [dataFormStep1, setDataFormStep1] = useState(null);
	const [dataFormStep2, setDataFormStep2] = useState(null);
	const [duration, setDuration] = useState('15MIN');
	const [totalInterval, setTotalInterval] = useState(1);
	const [totalDuration, setTotalDuration] = useState(1);
	const [step, setStep] = useState(1);
	const [selectedDays, setSelectedDays] = useState([]);

	const onChangeDuration = e => {
		setDuration(e.target.value);
	};

	const reactToChange = e => {
		let results = [];
		for (let i = 0; i < e.selected.length; i++) {
			const el = e.selected[i];
			results.push(moment(el).format('DD-MM-YYYY'));
		}
		setSelectedDays(results);
	};

	const nextStep = () => {
		console.log('data form: ', form.getFieldsValue());
		if (step === 1) {
			setDataFormStep1(form.getFieldsValue());
		} else if (step === 2) {
			setDataFormStep2(form.getFieldsValue());
		}
		setStep(step + 1);
	};

	const backStep = () => {
		if (step === 1) {
			props.history.push('/');
		} else {
			setStep(step - 1);
		}
	};

	const onFinish = values => {
		let userID = localStorage.getItem('userID');
		let token = localStorage.getItem('_token');

		const { weekholidays } = values;
		const { today, week } = dataFormStep2;
		const { appiontment, default_timeout } = dataFormStep1;

		let interval = [];
		for (let i = 0; i < totalInterval; i++) {
			let obj = {
				start_time: dataFormStep1[`time_interval_${i}`][0].format('hh:mm'),
				end_time: dataFormStep1[`time_interval_${i}`][1].format('hh:mm'),
			};
			interval.push(obj);
		}

		let serviceoption = [];
		for (let i = 0; i < totalDuration; i++) {
			let obj = {
				serviceName: dataFormStep1[`serviceName_${i}`],
				time: dataFormStep1[`time_${i}`],
			};
			serviceoption.push(obj);
		}

		let data = {
			appiontment,
			default_timeout,
			interval,
			serviceoption,
			setDate: [
				{
					// step 2
					today: today[0] ? true : false,
					week: week,

					customday: selectedDays,

					// step 3
					weekholidays: weekholidays,
					// weekholidays: [1, 2, 3],
					customholidays: selectedDays,
					// customholidays: ['15-8-2020', '16-8-2020'],
				},
			],
			userId: userID,
			spaceId: userID,
		};

		console.log('data: ', data);

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
							<RangePicker format="HH:mm" bordered={true} />
						</Form.Item>
					</div>
				);
			} else {
				results.push(
					<div key={i} className="sub-item">
						<Form.Item name={`time_interval_${i}`}>
							<RangePicker format="HH:mm" bordered={true} />
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
				<Form form={form} onFinish={onFinish} layout="vertical">
					{step === 1 && (
						<>
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
						</>
					)}

					{step === 2 && (
						<>
							<div className="app-item">
								<h3>This appointment for: Interval A</h3>
								<Form.Item name="today">
									<Checkbox.Group>
										<Checkbox value="true">Only for today</Checkbox>
									</Checkbox.Group>
								</Form.Item>
							</div>

							<div className="app-item">
								<h3>Every week days:</h3>
								<Form.Item name="week">
									<Checkbox.Group>
										<Checkbox value="1">Sunday</Checkbox>
										<Checkbox value="2">Monday</Checkbox>
										<Checkbox value="3">Tuesday</Checkbox>
										<Checkbox value="4">Wednesday</Checkbox>
										<Checkbox value="5">Thursday</Checkbox>
										<Checkbox value="6">Friday</Checkbox>
										<Checkbox value="7">Saturday</Checkbox>
									</Checkbox.Group>
								</Form.Item>
							</div>
						</>
					)}

					{step === 3 && (
						<>
							<div className="app-item">
								<h3>Every week days:</h3>
								<Form.Item name="weekholidays">
									<Checkbox.Group>
										<Checkbox value="1">Sunday</Checkbox>
										<Checkbox value="2">Monday</Checkbox>
										<Checkbox value="3">Tuesday</Checkbox>
										<Checkbox value="4">Wednesday</Checkbox>
										<Checkbox value="5">Thursday</Checkbox>
										<Checkbox value="6">Friday</Checkbox>
										<Checkbox value="7">Saturday</Checkbox>
									</Checkbox.Group>
								</Form.Item>
							</div>

							<div className="app-item">
								<h3>Select custom days:</h3>

								<Calendar
									format="DD-MM-YYYY"
									reset={false}
									isMultiple={true}
									onChange={reactToChange}
								/>
							</div>
						</>
					)}

					{step === 3 ? (
						<div className="actions">
							<Button onClick={() => setStep(2)}>Back</Button>
							<Button type="primary" htmlType="submit" >
								Continue
							</Button>
						</div>
					) : (
						<div className="actions">
							<Button onClick={() => backStep()}>Back</Button>
							<Button type="primary" htmlType="button" onClick={() => nextStep()}>
								Continue
							</Button>
						</div>
					)}
				</Form>
			</div>
		</div>
	);
}

export default withRouter(NewAppointment);
