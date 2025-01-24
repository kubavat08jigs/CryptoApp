import { baseUrl2, polygonProviderUrl, ethereumProviderUrl } from '../../utils/consts';
import { _fetch } from '../../utils/_fetch';
import AssetStore from '../../asyncStore/assets';

export function setAllChains(payload) {
	return ({
		type: 'SET_ALL_CHAINS',
		payload,
	});
}

export function initChains() {
	return async (dispatch) => {
		try {
			const chains = await AssetStore.getChains();
			if (chains) {
				dispatch(setAllChains(chains));
			}
		} catch (err) {
			// console.log(err);
		}
	};
}

export function getAllChains() {
	return async (dispatch, getState) => {
		try {

			let chains = await _fetch(`${baseUrl2}/getNetworks`);

			chains = await chains.json();
			chains = chains.payload.filter(e => e.activeStatus).map(e => {
				switch (e.imageName) {
					case 'ETHEREUM':
						return ({ ...e, providerUrl: ethereumProviderUrl });
					case 'POLYGON':
						return ({ ...e, providerUrl: polygonProviderUrl });
					default:
						return ({ ...e, providerUrl: ethereumProviderUrl });
				}
			});

			AssetStore.setChains(chains);

			dispatch(setAllChains(chains));

		} catch (err) {
			console.log(err);
		}
	};
}

