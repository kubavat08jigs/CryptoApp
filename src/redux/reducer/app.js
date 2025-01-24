const initState = {
	config: {},
	balanceVisible: false,
	zeroBalanceVisible: '1',
};

export const appReducer = (state = initState, action) => {
	switch (action.type) {
		case 'SET_APP_CONFIG': {
			return { ...state, ...action.payload };
		}
		case 'TOGGLE_BALANCE_VISIBLE': {
			return { ...state, balanceVisible: action.payload };
		}
		case 'TOGGLE_ZERO_BALANCE': {
			return { ...state, zeroBalanceVisible: action.payload };
		}
		default:
			return state;
	}
};
