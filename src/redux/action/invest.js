import { baseUrl1, env } from "../../../consts";
import { _fetch } from "../../../_fetch";
import { getInvestedBalance } from "./wallet";
import AssetStore from '../../asyncStore/assets';

export function setSelectedAsset(payload) {
	return ({
		type: 'SELECT_ASSET',
		payload,
	});
}

export function setSelectedProtocol(payload) {
	return ({
		type: 'SELECT_PROTOCOL',
		payload,
	});
}

export function initInvestAssets() {
	return async (dispatch) => {
		try {
			const assets = await AssetStore.getInvestAssets();
			if (assets) {
				dispatch({
					type: 'SAVE_INVEST_ASSETS',
					payload: {
						allAssets: assets
					},
				});
			}
		} catch (err) {
			// console.log(err);
		}
	};
}

export function getAllInvestmentAssets() {
	return async (dispatch, getState) => {
		try {

			const { asset, chain } = getState();

			if (Array.isArray(asset?.assets) && asset.assets.length) return;

			// todo: Remove hardcoded network id
			let assets = await _fetch(`${baseUrl1}/${env === 'DEV' ? '' : 'prod/'}getInvestCoinsApy`);

			assets = await assets.json();

			if (assets.status_code === '200') {
				AssetStore.setInvestAssets(assets.data);
				const payload = {
					allAssets: assets.data
				};

				if (chain.selected) {
					payload.assets = assets.data.filter(st => st.is_live)
						.map(a => {
							const protocol_list = a.protocol_list.filter(n => n.network === chain.selected.id);
							return ({
								...a,
								protocol_list
							});
						})
						.filter(st => st.protocol_list.length > 0);
				}

				dispatch({
					type: 'SAVE_INVEST_ASSETS',
					payload
				});
				dispatch(getInvestedBalance());
			}
		} catch (err) {
			// console.log(err);
		}
	};
}

export function filterInvestAssets() {
	return async (dispatch, getState) => {
		try {

			const { chain, invest } = getState();
			if (chain.selected) {
				const filteredAssets = invest.allAssets.filter(st => st.is_live)
					.map(a => {
						const protocol_list = a.protocol_list.filter(n => n.network === chain.selected.id);
						return ({
							...a,
							protocol_list
						});
					})
					.filter(st => st.protocol_list.length > 0);
				dispatch({
					type: 'SAVE_INVEST_ASSETS',
					payload: {
						assets: filteredAssets
					}
				});
				dispatch(getInvestedBalance());
			}
		} catch (err) {
			// console.log(err);
		}
	};
}
