import AsyncStorage from '@react-native-async-storage/async-storage';

class AssetStore {

	async setAssets(payload) {
		await AsyncStorage.setItem('allAssets', JSON.stringify(payload));
	}

	async getAssets() {
		const assets = await AsyncStorage.getItem('allAssets');
		if (assets) return JSON.parse(assets);
	}

	async setAppConfig(payload) {
		await AsyncStorage.setItem('appConfig', JSON.stringify(payload));
	}

	async getAppConfig() {
		const assets = await AsyncStorage.getItem('appConfig');
		if (assets) return JSON.parse(assets);
	}

	async setChains(payload) {
		await AsyncStorage.setItem('allChains', JSON.stringify(payload));
	}

	async getChains() {
		const chains = await AsyncStorage.getItem('allChains');
		if (chains) return JSON.parse(chains);
	}

}

export default new AssetStore();
