const initState = {
	assets: [],
	allAssets: []
};

export const investReducer = (state = initState, action) => {
	switch (action.type) {
		case 'SELECT_ASSET': {
			return { ...state, selected: action.payload };
		}
		case 'SAVE_INVEST_ASSETS': {
			return { ...state, ...action.payload };
		}
		case 'SELECT_PROTOCOL': {
			return { ...state, protocol: action.payload };
		}
		case 'LOGOUT': {
			return initState;
		}
		default:
			return state;
	}
};
