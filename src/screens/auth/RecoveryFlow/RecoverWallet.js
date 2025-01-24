//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MainHeader, PrimaryButton } from '../../../components';
import { colors } from '../../../helper/colorConstants';
import { fonts } from '../../../helper/fontconstant';
import { icons } from '../../../helper/iconConstant';
import { navigate } from '../../../helper/rootNavigation';

// create a component
const RecoverWallet = () => {
  return (
    <View style={styles.container}>
      <MainHeader />
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image style={{height: 335, width: 335}} source={icons.web3Wallet} />
        <Text style={styles.recoverHeader}>Recover your wallet</Text>
        <Text style={styles.recoverDesc}>
          {'Recover your wallet with\nyour Email and Phone number'}
        </Text>
      </View>
      {/* <PrimaryButton
        onPress={() => navigate('SignInScreen', {
          isCreateAccount: true,
          navigateTo: 'RecoveryInputScreen',
        })}
        title={'Recover using Backup Share'}
        containerStyle={{marginBottom: 0}}
      /> */}
      <View>
      <PrimaryButton
        onPress={() => navigate('RecoveryInputScreen', {isBackup: false})}
        title={'Recover using Email and Phone'}
        containerStyle={styles.recoverButton}
        titleStyle={{color: colors.primaryBlue}}
      />
      {/* <TouchableOpacity
        onPress={() => {}}
        style={styles.recoverGuideView}>
        <Text style={styles.recoverGuideText}>Recovery Guide</Text>
      </TouchableOpacity> */}
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
  },
  recoverHeader: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: fonts.bold,
    marginTop: 16,
    color: colors.activeBlack,
  },
  recoverDesc: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: fonts.regular,
    marginTop: 4,
    color: colors.textGrayColor,
    textAlign: 'center',
  },
  recoverButton: {
    backgroundColor: '#F1F4FA',
    marginTop: 12,
    marginBottom: 40,
  },
  recoverGuideText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.primaryBlue,
    alignSelf: 'center',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: colors.primaryBlue,
  },
  recoverGuideView: {
    marginBottom: 40,
  },
});

//make this component available to the app
export default RecoverWallet;
