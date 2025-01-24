const initState = {
	selected: null,
	allChains: []
};

export const chainReducer = (state = initState, action) => {
	switch (action.type) {
		case 'SELECT_CHAIN': {
			return {
				...state,
				selected: action.payload,
			};
		}
		case 'SET_ALL_CHAINS': {
			return {
				...state,
				allChains: action.payload
			};
		}
		case 'LOGOUT': {
			return initState;
		}
		default:
			return state;
	}
};
