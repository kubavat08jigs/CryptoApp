import uuid from 'react-native-uuid';
import { useSelector } from 'react-redux';

/**
 *
 * @param {String} url url of the api / service
 * @param {Object} obj options to pass method, body, token for the request
 * @param {('GET'|'POST'|'PATCH'|'PUT'|'DELETE')} obj.method http method to use for request
 * @param {Object} obj.body http message body if request type is POST or PATCH
 * @param {Object} obj.uuid uuid for the request
 * @returns
 */

export async function _fetch(url, obj = {}) {
	const headers = {};
	const { method = 'GET', body = undefined, token } = obj;

	headers['X-Dolf-Request-Id'] = obj?.uuid ?? uuid.v4();
	if (body) {
		headers['Content-Type'] = 'application/json';
	}

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const options = {
		headers,
		body: JSON.stringify(body),
		method,
	};

	console.log('Inside _fetch with -> ',url, options);

	const res = await fetch(url, options);
	return res;
}

export default function useFetch() {

	const { jwtToken } = useSelector(st => st.user);

	console.log(jwtToken);

	async function hookFetch(url, obj = {}) {
		const headers = {};
		const { method = 'GET', body = undefined } = obj;

		headers['X-Dolf-Request-Id'] = obj?.uuid ?? uuid.v4();
		if (body) {
			headers['Content-Type'] = 'application/json';
		}

		if (jwtToken) {
			headers.authorization = `Bearer ${jwtToken}`;
		}

		const options = {
			headers,
			body: JSON.stringify(body),
			method,
		};
		console.log('Inside UseFetch with -> ',url, options);
		const res = await fetch(url, options);
		return res;
	}

	return hookFetch;
}
