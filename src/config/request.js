/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
import axios from 'axios';

const debugData = data => {
	return Promise.resolve(data);
};

const debugError = er => {
	if (er.response && er.response.status === 401) {
		localStorage.clear();
	}
	return Promise.reject(er.response);
};

const request = () => {
	const token = localStorage.getItem("_token");

	const axiosApi = axios.create({
		// baseURL: process.env.URL_API,
		headers: {
			Authorization: `Bearer ${token}`,
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
		},
		paramsSerializer(params) {
			let urlParameters = '';
			Object.keys(params).forEach(function (keys) {
				if (typeof params[keys] === 'object') {
					Object.keys(params[keys]).forEach(function (step_1_value, step_1_index) {
						if (typeof params[keys][step_1_value] === 'object') {
							Object.keys(params[keys][step_1_value]).forEach(function (step_2_value, step_2_index) {
								urlParameters +=
									`${keys}[${step_1_value}]` +
									`[${step_2_value}]` +
									`=${
										typeof params[keys][step_1_value][step_2_value] === 'string' &&
										params[keys][step_1_value][step_2_value].split(' ').length > 0
											? params[keys][step_1_value][step_2_value]
													.split(' ')
													.map(e => e)
													.join('+')
											: params[keys][step_1_value][step_2_value].toString()
									}&`;
							});
						} else {
							urlParameters += `${keys}[${step_1_value}]` + `=${params[keys][step_1_value]}&`;
						}
					});
				} else if (params[keys] !== undefined) {
					urlParameters += `${keys}=${params[keys]}`;
				}
			});
			urlParameters =
				urlParameters.substring(urlParameters.length - 2, urlParameters.length - 1) === '&'
					? urlParameters.substring(0, urlParameters.length - 1)
					: urlParameters;
			return urlParameters;
		},
	});

	return {
		get(url, params = {}, options = {}) {
			return axiosApi.get(url, { params }).then(debugData).catch(debugError);
		},
		post(url, data, options = {}) {
			return axiosApi.post(url, data).then(debugData).catch(debugError);
		},
		put(url, data, options = {}) {
			return axiosApi.put(url, data).then(debugData).catch(debugError);
		},
		delete(url, params = {}, options = {}) {
			return axiosApi.delete(url, { data: params }).then(debugData).catch(debugError);
		},
	};
};

export default request;
