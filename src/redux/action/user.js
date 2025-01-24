export function addUser(payload) {
	return {
		type: 'ADD_USER',
		payload,
	};
}

export function updateUser(payload) {
	return {
		type: "UPDATE_USER",
		payload
	};
}

export function logout() {
	return {
		type: 'LOGOUT'
	};
}

export function setJwt(payload) {
	return {
		type: 'SET_JWT',
		payload
	};
}
