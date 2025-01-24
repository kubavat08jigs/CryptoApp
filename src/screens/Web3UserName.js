//import liraries
import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
} from 'react-native';
import {MainHeader, PrimaryButton} from '../components';
import {colors} from '../helper/colorConstants';
import {getLocalText} from '../helper/globalFunctions';
import {fontSize, hp, isIos, wp} from '../helper/utils';
import {icons} from '../helper/iconConstant';
import {fonts} from '../helper/fontconstant';
import {navigate} from '../helper/rootNavigation';

// create a component
const WebUserName = () => {
  const [walletName, setWalletName] = useState('');
  // const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const [isWalletNameError, setIsWalletNameError] = useState(false);
  const [isWalletSuccess, setIsWalletSuccess] = useState(true);

  const onWalletNameChange = txt => {
    setWalletName(txt);
  };

  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     'keyboardDidShow',
  //     () => {
  //       setIsKeyboardOpen(true);
  //     },
  //   );

  //   const keyboardDidHideListener = Keyboard.addListener(
  //     'keyboardDidHide',
  //     () => {
  //       setIsKeyboardOpen(false);
  //     },
  //   );

  //   return () => {
  //     keyboardDidHideListener.remove();
  //     keyboardDidShowListener.remove();
  //   };
  // }, []);

  const onGetWalletPress = () => {
    setIsWalletSuccess(true);
  };
  const onSuccessBtnPress = () => {
    navigate('Home');
  };

  return (
    <View style={styles.container}>
      <MainHeader title={getLocalText('Your Web3 Username')} />
      {/* <KeyboardAvoidingView
        behavior={isIos ? 'padding' : 'height'}
        contentContainerStyle={{flex: 1}}
        style={{flex: 1}}> */}
        <ScrollView  contentContainerStyle  = {{ flex : 1}} >

        
        {isWalletSuccess ? (
          <View style = {{flex : 1, justifyContent : 'center'}} >
            <Image
              source={icons.web3Wallet}
              style={{
                marginTop : 120,
                height: hp(335),
                width: hp(335),
                alignSelf: 'center',
                marginBottom : hp(16)
              }}
            />
            <Text style={styles.walletHeader}>
              {getLocalText('Congratulations')}
            </Text>
            <Text style={[styles.walletDescText, {marginBottom: hp(95)}]}>
              <Text
                style={
                  styles.walletNameSuccessText
                }>{`${walletName}.dolf.wallet`}</Text>
              {getLocalText(' ready to send and\nreceive crypto')}
            </Text>
          </View>
        ) : (
          <View style = {{ flex  : 1, justifyContent : 'center'}} >
            <Image
              source={icons.web3Wallet}
              style={[
                styles.walletIconStyle,
              ]}
            />
            <Text style={styles.walletHeader}>
              {getLocalText('Pick your Web3 username')}
            </Text>
            <Text style={styles.walletDescText}>
              {getLocalText(
                'Easily send and receive crypto with\nyour username using Dolf app',
              )}
            </Text>
            <View
              style={{
                marginHorizontal: wp(29),
              }}>
              <Text
                style={[
                  styles.inputTitle,
                  {
                    color: isWalletNameError
                      ? colors.errorText
                      : colors.activeBlack,
                  },
                ]}>
                Username
              </Text>
              <View
                style={[
                  styles.textInputOuterContainer,
                  {
                    backgroundColor: isWalletNameError
                      ? '#FFE4E4'
                      : '#ECECEC',
                  },
                ]}>
                <TextInput
                  maxLength={8}
                  value={walletName}
                  placeholder={'Username'}
                  placeholderTextColor={'#838383'}
                  onChangeText={onWalletNameChange}
                  style={[
                    styles.inputStyle,
                    {
                      color: isWalletNameError
                        ? colors.errorText
                        : colors.activeBlack,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.walletNameExt,
                    {
                      color: isWalletNameError
                        ? colors.errorText
                        : colors.activeBlack,
                    },
                  ]}>
                  .dolf.wallet
                </Text>
              </View>
              {true ? (
                <Text
                  style={[
                    styles.validationText,
                    {
                      color: isWalletNameError
                        ? colors.errorText
                        : colors.activeBlack,
                    },
                  ]}>
                  {isWalletNameError
                    ? 'User name already exists'
                    : 'from 6 till 8 characters'}
                </Text>
              ) : (
                <View style={{flexDirection: 'row', marginTop: hp(6)}}>
                  <Text style={styles.successTExt}>All good</Text>
                  <Image
                    source={icons.checkCircle}
                    style={{height: 16, width: 16, marginLeft: wp(2)}}
                  />
                </View>
              )}
            </View>
          </View>
        )}
        </ScrollView>
        <PrimaryButton
          isLoader={false}
          onPress={isWalletSuccess ? onSuccessBtnPress : onGetWalletPress}
          disable={isWalletSuccess ? false : walletName?.length > 5 ? false : true}
          title={isWalletSuccess ? 'Continue' : getLocalText('Get your wallet')}
        />
      {/* </KeyboardAvoidingView> */}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    backgroundColor: colors.primaryWhite,
  },
  walletIconStyle: {
    width: hp(162),
    height: hp(162),
    alignSelf: 'center',
  },
  walletHeader: {
    fontSize: fontSize(20),
    marginTop: hp(8),
    fontWeight: '400',
    fontFamily: fonts.regular,
    color: colors.darkest,
    alignSelf: 'center',
  },
  walletDescText: {
    fontSize: fontSize(17),
    marginTop: hp(2),
    fontWeight: '400',
    textAlign: 'center',
    fontFamily: fonts.regular,
    color: colors.textGrayColor,
    alignSelf: 'center',
  },
  inputTitle: {
    fontSize: 12,
    marginTop: hp(13),
    fontWeight: '400',
    marginBottom: hp(4),
    fontFamily: fonts.regular,
    color: colors.activeBlack,
  },
  walletNameExt: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginHorizontal: wp(16),
    fontFamily: fonts.semiBold,
    color: colors.activeBlack,
  },
  validationText: {
    fontSize: 12,
    marginTop: hp(6),
    fontWeight: '400',
    fontFamily: fonts.regular,
    color: colors.activeBlack,
  },
  textInputOuterContainer: {
    height: hp(56),
    backgroundColor: '#ECECEC',
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  inputStyle: {
    marginLeft: wp(16),
    width: wp(200),
    fontSize: 16,
    fontWeight: '500',
  },
  successTExt: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: fonts.regular,
    color: '#34C759',
  },
  walletNameSuccessText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: '#666666',
  },
});

//make this component available to the app
export default WebUserName;
