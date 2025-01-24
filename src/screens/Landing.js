//import liraries
import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { colors } from '../helper/colorConstants';
import { getAsyncStorage } from '../helper/globalFunctions';
import { icons } from '../helper/iconConstant';
import { resetNavigationStack } from '../helper/rootNavigation';
import { useDispatch } from "react-redux";
import UserStore from '../asyncStore/user';
import { addUser } from "../redux/action/user";
import { getAddress, initAssets, setKey } from "../redux/action/wallet";
import { getAllChains, initChains } from '../redux/action/chain';
import { getWalletBalance } from '../redux/action/wallet';
import { getAppConfig, initAppConfig, showZeroBalance } from '../redux/action/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

// create a component
const Landing = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // init();
    setTimeout(() => {
      validateLogin();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateLogin = async () => {
    const storedUser = await UserStore.getUser();
    //const _key = await EncryptedStorage.getItem('@dolf-private-key');
    const isValidateKey = await getAsyncStorage('privateKey');
    console.log('storedUser');
    //console.log(storedUser);
    if (isValidateKey) {

      const show_balance = await AsyncStorage.getItem('show_zero_balance');
      dispatch(showZeroBalance(show_balance ?? '1'));

      dispatch(addUser(storedUser));
      dispatch(setKey(isValidateKey));
      dispatch(initAssets());
      dispatch(initAppConfig());
      dispatch(initChains());
      dispatch(getAddress());
      dispatch(getAllChains());
      dispatch(getWalletBalance());
      dispatch(getAppConfig(storedUser.jwtToken));
    }
    //console.log('isValidateKey :: ', isValidateKey);
    if (!storedUser?.jwtToken || !storedUser?.userInfo?.is_dapp_saved || !isValidateKey) { resetNavigationStack('SignInScreen'); }
    else if (isValidateKey && isValidateKey?.length > 2) {
      resetNavigationStack('BottomTab');
    } else {
      resetNavigationStack('SignInScreen');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={icons.logo} style={styles.logoStyle} />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryWhite,
  },
  logoStyle: {
    height: 74,
    width: 207,
  },
});

//make this component available to the app
export default Landing;
