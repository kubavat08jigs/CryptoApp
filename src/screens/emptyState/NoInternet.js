//import liraries
import { useNetInfo } from '@react-native-community/netinfo';
import React, { Component, useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { useDispatch } from 'react-redux';
import { PrimaryButton } from '../../components';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { goBack } from '../../helper/rootNavigation';
import { NoInternet } from '../../helper/svgconstant';
import UserStore from '../../asyncStore/user';
import { getAllChains } from '../../redux/action/chain';
import { getWalletBalance } from '../../redux/action/wallet';
import { getAppConfig } from '../../redux/action/app';

// create a component
const NoInternetScreen = () => {

  const netInfo = useNetInfo();
  const dispatch = useDispatch();

  useEffect(() => {
    let handler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => handler.remove();
  }, []);


  async function reconnect() {
    if (netInfo.isConnected) {
      const storedUser = await UserStore.getUser();
      dispatch(getAllChains());
      dispatch(getWalletBalance());
      dispatch(getAppConfig(storedUser.jwtToken));
      goBack();
    }
  }

  return (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateView}>
        <NoInternet />
        <Text style={styles.emptyStateTitle}>No Internet</Text>
        <Text style={styles.emptyStateDesc}>
          Please check your internet & try again
        </Text>
      </View>
      <PrimaryButton onPress={reconnect} title="Reconnect" />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  emptyStateView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 24,
    color: colors.darkBlack,
    fontFamily: fonts.regular,
    fontWeight: '600',
    marginTop: 33,
  },
  emptyStateDesc: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: fonts.regular,
    color: colors.textGrayColor,
    width: 233,
    textAlign: 'center',
    marginTop: 4,
  },
});

//make this component available to the app
export default NoInternetScreen;
