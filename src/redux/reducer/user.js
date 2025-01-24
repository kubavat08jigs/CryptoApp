import User from '../../asyncStore/user';

const initState = {
	email: "",
	name: "",
	profileImage: "",
	aggregateVerifier: "",
	verifier: "",
	verifierId: "",
	typeOfLogin: "",
	dappShare: "",
	idToken: "",
	oAuthIdToken: "",
	phone: "",
	jwtToken: "",
	referral_code: '',
};

export const userReducer = (state = initState, action) => {
	switch (action.type) {
		case 'ADD_USER': {
			return action.payload;
		}
		case 'LOGOUT': {
			User.removeUser();
			return {};
		}
		case 'UPDATE_USER': return { ...state, ...action.payload };
		case 'SET_JWT': return { ...state, jwtToken: action.payload };
		default:
			return state;
	}
};
