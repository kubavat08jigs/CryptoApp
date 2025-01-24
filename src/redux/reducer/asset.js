const initState = {
	assets: [],
	allAssets: []
};

export const assetReducer = (state = initState, action) => {
	switch (action.type) {
		case 'SELECT_ASSET': {
			return { ...state, selected: action.payload };
		}
		case 'SAVE_ASSETS': {
			return { ...state, ...action.payload };
		}
		case 'LOGOUT': {
			return initState;
		}
		default:
			return state;
	}
};
