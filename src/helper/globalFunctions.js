import EncryptedStorage from 'react-native-encrypted-storage';
import i18n from '../../language';

export const getLocalText = text => {
  return i18n.t(text);
};

export const setAsyncStorage = async (key, value) => {
  const tokenRes = await EncryptedStorage.setItem(key, JSON.stringify(value));
  return tokenRes;
};

export const clearAsyncStorage = async (key, value) => {
  const tokenRes = await EncryptedStorage.removeItem(key);
  return tokenRes;
};

export const getAsyncStorage = async key => {
  const tokenRes = await EncryptedStorage.getItem(key);
  return JSON.parse(tokenRes);
};
