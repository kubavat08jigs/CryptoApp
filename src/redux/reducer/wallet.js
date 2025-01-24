const initState = {
	key: '',
	address: '',
	balance: {},
	idleDollarBalance: {},
	totalIdleDollarBalance: 0,
	investedBalance: {},
	investedDollarBalance: {},
	totalInvestedDollarBalance: 0,
	loadingBalance: false,
	balancePerCoin: [],
	balancePerChain: [],
	loadingInvestBalance: false,
	initialIdleLoad: false,
	initialInvestLoad: false,
	tokenBalances: {},
	chainwiseNativeToken: {},
	change24H: 0
};

export const walletReducer = (state = initState, action) => {
	switch (action.type) {
		case 'SET_KEY': {
			return {
				...state,
				key: action.payload,
			};
		}
		case 'SET_ADDRESS': {
			return {
				...state,
				address: action.payload,
			};
		}
		case 'SET_LOADING_BALANCE': {
			return {
				...state,
				loadingBalance: true,
			};
		}
		case 'SET_LOADING_INVEST_BALANCE': {
			return {
				...state,
				loadingInvestBalance: true,
			};
		}
		case 'SELECT_CHAIN': {
			return {
				...state,
				balance: {},
				idleDollarBalance: {},
				totalIdleDollarBalance: 0,
				investedBalance: {},
				investedDollarBalance: {},
				totalInvestedDollarBalance: 0,
				loadingBalance: false,
				loadingInvestBalance: false,
				initialIdleLoad: false,
				initialInvestLoad: false,
				change24H: 0,
			};
		}
		case 'SET_BALANCE': {
			return {
				...state,
				...action.payload,
			};
		}
		case 'LOGOUT': {
			return initState;
		}
		default:
			return state;
	}
};
