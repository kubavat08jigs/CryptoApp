import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = "user";

class UserStore {

	async getUser() {
		return JSON.parse(await AsyncStorage.getItem(KEY));
	}

	async setUser(payload) {
		await AsyncStorage.setItem(KEY, JSON.stringify(payload));
	}

	async removeUser() {
		await AsyncStorage.removeItem(KEY);
	}

}

export default new UserStore();
