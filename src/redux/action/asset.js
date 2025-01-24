import { getIdleBalance } from "./wallet";
import AssetStore from '../../asyncStore/assets';
import { baseUrl2, env } from "../../utils/consts";
import { _fetch } from "../../utils/_fetch";

export function setSelectedAsset(payload) {
	return ({
		type: 'SELECT_ASSET',
		payload,
	});
}

export function initAssets() {
	return async (dispatch) => {
		try {
			const assets = await AssetStore.getAssets();
			if (assets) {
				dispatch({
					type: 'SAVE_ASSETS',
					payload: {
						allAssets: assets
					}
				});
			}
		} catch (err) {
			// console.log(err);
		}
	};
}

export function filterAssets() {
	return async (dispatch, getState) => {
		try {

			const { chain, asset } = getState();

			if (chain.selected) {
				const filteredAssets = asset.allAssets.filter(st => (
					Array.isArray(st?.network_asset_info) &&
					st.network_asset_info.some(e => e.network_id === chain.selected.id)
				))
					.map(a => {
						const networkInfo = a.network_asset_info.find(n => n.network_id === chain.selected.id);
						return ({
							address: networkInfo.contract_address,
							decimal: networkInfo.decimals,
							...a
						});
					});

				dispatch({
					type: 'SAVE_ASSETS',
					payload: {
						assets: filteredAssets
					}
				});
				dispatch(getIdleBalance());
			}
		} catch (err) {
			// console.log(err);
		}
	};
}
