const initState = {
	page: 0,
	limit: 10,
	news: [],
	loading: false
};

export const newsReducer = (state = initState, action) => {
	switch (action.type) {
		case 'SELECT_NEWS': {
			return { ...state, selected: action.payload };
		}
		case 'LOADING_NEWS': {
			return { ...state, loading: true };
		}
		case 'SET_PAGE': {
			return { ...state, page: action.payload };
		}
		case 'SET_NEWS': {
			return { ...state, news: action.payload, loading: false };
		}
		case 'APPEND_NEWS': {
			const _news = [...state.news, ...action.payload];
			return { ...state, news: _news, loading: false };
		}
		default:
			return state;
	}
};
