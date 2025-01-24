import { baseUrl1, env } from "../../../consts";
import { _fetch } from "../../../_fetch";

export function setSelectedNews(payload) {
	return ({
		type: 'SELECT_NEWS',
		payload,
	});
}

export function setPage(payload) {
	return ({
		type: 'SET_PAGE',
		payload,
	});
}

export function setLimit(payload) {
	return ({
		type: 'SELECT_LIMIT',
		payload,
	});
}

export function getNews() {
	return async (dispatch, getState) => {
		const { news } = getState();
		try {

			if (news.loading) return;
			dispatch({
				type: 'LOADING_NEWS'
			});
			let res = await _fetch(`${baseUrl1}/${env === 'DEV' ? '' : 'prod/'}news?limit=${news?.limit ?? 10}&offset=${news?.page ?? 0}`);

			res = await res.json();

			if (res.status_code === '200') {
				dispatch({
					type: (news?.page ?? 0) === 0 ? 'SET_NEWS' : 'APPEND_NEWS',
					payload: res.data,
				});
			}
		} catch (err) {
		}
	};
}
