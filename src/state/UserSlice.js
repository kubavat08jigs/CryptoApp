import { createSlice } from '@reduxjs/toolkit'

const initialState = {
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
	jwtToken: ""
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    }
})

export default userSlice.reducer