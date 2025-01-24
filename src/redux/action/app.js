import { baseUrl2 } from '../../utils/consts';
import { _fetch } from '../../utils/_fetch';
import AssetStore from '../../asyncStore/assets';

export function initAppConfig() {
	return async (dispatch) => {
		try {
			const config = await AssetStore.getAppConfig();
			if (config) {
				dispatch({
					type: 'SET_APP_CONFIG',
					payload: config,
				});
			}
		} catch (err) {
			// console.log(err);
		}
	};
}

export function getAppConfig(token) {
	console.log('Calling get app config with',token);
	return async (dispatch, getState) => {
		try {
			let res = await _fetch(`${baseUrl2}/app_config`, {
				token: token,
				method: 'POST',
			});
			if (res.status === 200) {
				res = await res.json();
				console.log(res);
				console.log('App Config response',res.payload);

				AssetStore.setAppConfig(res.payload);

				dispatch({
					type: 'SET_APP_CONFIG',
					payload: res.payload,
				});
			} else {
				res = await res.text();
				console.log(res);
			}
		} catch (err) {
			console.log('app config error');
			console.log(err);
		}
	};
}

export function setBalanceVisible(visible) {
	return ({
		type: 'TOGGLE_BALANCE_VISIBLE',
		payload: visible,
	});
}

export function showZeroBalance(visible) {
	return ({
		type: 'TOGGLE_ZERO_BALANCE',
		payload: visible,
	});
}
