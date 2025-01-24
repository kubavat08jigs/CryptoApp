//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';

import { PrimaryButton } from '../../components';
import { colors } from '../../helper/colorConstants';
import { getAsyncStorage, getLocalText, setAsyncStorage } from '../../helper/globalFunctions';
import Web3Auth, {
	LOGIN_PROVIDER,
	OPENLOGIN_NETWORK,
} from '@web3auth/react-native-sdk';
import Swiper from 'react-native-swiper';
import * as WebBrowser from '@toruslabs/react-native-web-browser';
import {
	baseUrl2,
	env,
	googleClientId,
	inAppBrowserConfig,
	resolvedRedirectUrl,
	web3authClientId,
	web3authVerifier,
} from '../..//utils/consts';
import {
	Logo,
	Slide1,
	Slide2,
	Slide3,
	Slide4,
	Slide5,
	Slide6,
} from '../../helper/svgconstant';
import { _fetch } from '../../utils/_fetch';
import { useDispatch } from 'react-redux';
import { getAddress, setKey } from '../../redux/action/wallet';
import { getAllChains } from '../../redux/action/chain';
import { hp, wp, isIos } from '../../helper/utils';
import { fonts } from '../../helper/fontconstant';
import { icons } from '../../helper/iconConstant';
import { navigate, resetNavigationStack } from '../../helper/rootNavigation';
import UserStore from '../../asyncStore/user';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addUser } from '../../redux/action/user';
import { getAppConfig } from '../../redux/action/app';

// create a component
const SignInScreen = () => {
	const route = useRoute();
	// const [isCreateAccount, setCreateAccount] = useState(false);
	let navigateTo = 'BottomTab';

	// useEffect(() => {
	//   setCreateAccount(route.params?.isCreateAccount);
	//   // eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [route.params]);

	if (route.params?.navigateTo) {
		navigateTo = route.params.navigateTo;
	}
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	const navigation = useNavigation();

	console.log(route?.params?.dappShare);

	const onTermsPress = async () => {
		const url = 'https://dolf.finance/terms-of-service';
		if (await InAppBrowser?.isAvailable()) {
			InAppBrowser.open(url, inAppBrowserConfig).then((response) => {
				// console.log(response)
			});
		} else {
			Linking.openURL(url);
		}
	};

	const onPrivacyPress = async () => {
		const url = 'https://dolf.finance/privacy';
		if (await InAppBrowser?.isAvailable()) {
			InAppBrowser.open(url, inAppBrowserConfig).then((response) => {
				// console.log(response)
			});
		} else {
			Linking.openURL(url);
		}
	};

	// const onCreatAccountPress = () => {
	//   setCreateAccount(true);
	// };

	// const onLoginPress = () => {
	//   setCreateAccount(true);
	// };
	const SliderItem = ({ iconSource, titleText }) => {
		return (
			<View style={styles.slideContainer}>
				{iconSource}
				<Text style={styles.slideText}>{titleText}</Text>
			</View>
		);
	};
	async function getRefCode(email) {
		try {
			let res = await _fetch(`${baseUrl2}/referral`, {
				method: 'POST',
				body: { email },
			});
			res = await res.json();
			console.log(res);
			if (res.status === 200) {
				return res?.data?.referral_code;
			}
			return '';
		} catch (e) {
			console.log(e);
			return '';
		}
	}
	const onGoogleSigninPress = async () => {
		console.log('Clicked login1');
		try {
			setLoading(true);
			console.log('Clicked login2');
			const web3auth = new Web3Auth(WebBrowser, {
				clientId: web3authClientId,
				network:
					env === 'DEV' ? OPENLOGIN_NETWORK.TESTNET : OPENLOGIN_NETWORK.CYAN,
				loginConfig: {
					google: {
						verifier: web3authVerifier,
						typeOfLogin: 'google',
						name: 'Custom Login with Google',
						clientId: googleClientId,
					},
				},
			});
			console.log('Clicked login3');
			let loginOptions = {
				loginProvider: LOGIN_PROVIDER.GOOGLE,
				redirectUrl: resolvedRedirectUrl,
				mfaLevel: 'mandatory',
				curve: 'secp256k1',
			};

			if (route.params?.dappShare) {
				loginOptions.dappShare = route.params.dappShare;
			} else {
				let ds = await getAsyncStorage('dappShare');
				if (ds) { loginOptions.dappShare = ds; }
			}

			const info = await web3auth.login(loginOptions);

			console.log(info);

			const res = await _fetch(`${baseUrl2}/authenticateAndRegister`, {
				method: 'POST',
				body: {
					token: info.userInfo.oAuthIdToken,
				},
			});

			if (res.status === 200) {
				const token = res.headers.get('authorization') ?? '';
				const result = await res.json();

				console.log('token->',token);

				if (!info.userInfo) {
					return;
				}
				console.log(result);
				if (result.status === 200 || result.status === 405) {
					let referral_code = result.referral_code;
					if (!referral_code) {
						referral_code = await getRefCode(info.userInfo.email);
					}
					const userInfo = {
						...info.userInfo,
						jwtToken: token.substring(7),
						is_dapp_saved: result.is_dapp_saved,
						is_mobile_saved: result.is_mobile_saved,
						is_wallet_addrresss_saved: result.is_wallet_addrresss_saved,
						referral_code,
					};
					//console.log(userInfo);
					UserStore.setUser({ ...info, userInfo, privKey: undefined, jwtToken: token.substring(7) });
					console.log('Clicked login4');
					//console.log('info', info);
					dispatch(getAppConfig(token.substring(7)));
					dispatch(addUser(userInfo));
					dispatch(setKey(info.privKey));
					dispatch(getAddress());
					dispatch(getAllChains());
					setAsyncStorage('privateKey', info.privKey);
					//console.log(result);
					if (!result.is_dapp_saved) {
						navigation.navigate('CreateAccount');
					} else {

						resetNavigationStack('BottomTab');
					}
				} else {
					throw Error('Something went wrong');
				}
			} else {
				await res.text();
				//console.log();
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	const onAppleSignInPress = async () => {
		const web3auth = new Web3Auth(WebBrowser, {
			clientId: web3authClientId, // web3auth's client id
			network: OPENLOGIN_NETWORK.TESTNET, // or other networks
			loginConfig: {
				jwt: {
					verifier: "ct-apple-verifier2", // get it from web3auth dashboard for auth0 configuration
					typeOfLogin: "jwt",
					clientId: "a4wOqI3K47p7lVG0laCOyEynamGIqmYB", // get it from auth0 dashboard
				},
			},
		});
		const info = await web3auth.login({
			loginProvider: LOGIN_PROVIDER.JWT,
			redirectUrl: resolvedRedirectUrl, // redirect url after login
			extraLoginOptions: {
				domain: "dev-z4a3kx4dm6sselha.us.auth0.com", // domain of your auth0 app
				verifierIdField: "sub", // The field in jwt token which maps to verifier id.
			},
		});

		console.log(info);
	};

	const onRecoverPress = () => {
		navigate('RecoverWallet');
	};

	return (
    <View style={styles.container}>
      <View style={{alignItems: 'center', marginTop: 23}}>
        <Logo />
      </View>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Swiper
          loop
          activeDotStyle={styles.activeDotStyle}
          dotStyle={styles.inActiveDotStyle}
          autoplay
          style={styles.wrapper}>
          <SliderItem
            titleText={'Next-gen, self-custodial,\nmultichain keyless wallet'}
            iconSource={<Slide1 />}
          />
          <SliderItem
            titleText={'Swap cryptos at the\nbest rates & lowest fee.'}
            iconSource={<Slide2 />}
          />
          {/* <SliderItem
						titleText={
							' Borrow from best DeFi protocols\nfor as low as 0% interest'
						}
						iconSource={<Slide3 />}
					/> */}
          {/* <SliderItem
						titleText={
							'Spend via crypto backed card\nand earn cashback on every spend'
						}
						iconSource={<Slide4 />}
					/> */}
          <SliderItem
            titleText={'Get your free, unique\nWeb3 username'}
            iconSource={<Slide5 />}
          />
          <SliderItem
            titleText={'Track your Portfolio\nand get real-time alerts'}
            iconSource={<Slide6 />}
          />
        </Swiper>
      </View>
      {/* {isCreateAccount ? ( */}
      <View
        style={{
          padding: 10,
          maxHeight: hp(250),
          minHeight: hp(250),
          justifyContent: 'center',
        }}>
        <PrimaryButton
          onPress={() => onGoogleSigninPress()}
          leftIcon={icons.googleLogo}
          isLoader={loading}
          title={getLocalText('Continue with Google')}
          containerStyle={styles.signInButtonStyle}
          loaderColor={colors.primaryBlue}
          titleStyle={styles.signInButtonText}
        />
        {isIos && (
          <PrimaryButton
            onPress={onAppleSignInPress}
            leftIcon={icons.appleLogo}
            title={getLocalText('Continue with Apple')}
            containerStyle={styles.signInButtonStyle}
            titleStyle={styles.signInButtonText}
          />
        )}
        {!route.params?.isCreateAccount && (
          <PrimaryButton
            onPress={onRecoverPress}
            title={getLocalText('Recover wallet')}
            containerStyle={styles.recoveryButtonStyle}
            titleStyle={styles.recoverButtonText}
          />
        )}
        {/* <TouchableOpacity
          onPress={() => {}}
          style={styles.guideView}>
          <Text style={styles.guideText}>Account Creation Guide</Text>
        </TouchableOpacity> */}
      </View>
      {/* // ) : (
      //   <View style={{ padding: 10, maxHeight: hp(250), minHeight: hp(250) }}>
      //     <PrimaryButton
      //       onPress={onCreatAccountPress}
      //       title={getLocalText('Create an account')}
      //       iconSrc={icons.fi_arrow_right}
      //       containerStyle={{ marginBottom: 12 }}
      //     />
      //     <PrimaryButton
      //       onPress={onLoginPress}
      //       title={getLocalText('Login')}
      //       containerStyle={{ backgroundColor: '#F1F4FA', marginBottom: 15 }}
      //       titleStyle={{
      //         color: '#0052FE',
      //         fontSize: 14,
      //         fontWeight: '700',
      //         marginBottom: 0,
      //       }}
      //     />
      //     
      //   </View>
      // )
      // } */}
      <Text style={styles.privacyAlert}>
        By continuing, you agree to Dolf’s
      </Text>
      <View style={styles.privacyPolicyView}>
        <Text
          onPress={onTermsPress}
          style={[
            styles.privacyPolicy,
            {
              textDecorationLine: 'underline',
            },
          ]}>
          Terms of Service
        </Text>
        <Text style={styles.privacyPolicy}> and </Text>
        <Text
          onPress={onPrivacyPress}
          style={[styles.privacyPolicy, {textDecorationLine: 'underline'}]}>
          Privacy Policy
        </Text>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
  },
  star1View: {
    marginTop: hp(192),
    marginLeft: wp(60),
  },
  star1Style: {
    height: 23,
    width: 23,
    left: 7,
  },
  star2Style: {
    height: 13,
    width: 13,
    bottom: 6,
  },
  logoStyle: {
    height: 74,
    width: 207,
    alignSelf: 'center',
    marginTop: hp(33),
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: fonts.regular,
    fontWeight: '600',
    color: '#070707',
    marginTop: hp(50),
    alignSelf: 'center',
  },
  welcome1Text: {
    fontSize: 16,
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: colors.activeBlack,
    marginTop: hp(12),
    alignSelf: 'center',
  },
  star2View: {
    marginTop: hp(43),
    marginRight: wp(27),
    alignSelf: 'flex-end',
  },
  privacyAlert: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: fonts.regular,
    color: colors.textGrayColor,
    alignSelf: 'center',
  },
  privacyPolicy: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: fonts.regular,
    color: colors.activeBlack,
    alignSelf: 'center',
  },
  privacyPolicyView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 1,
    marginBottom: 10,
  },
  guideText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.primaryBlue,
    alignSelf: 'center',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: colors.primaryBlue,
  },
  recoverText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.primaryGreen,
    alignSelf: 'center',
  },
  signInButtonStyle: {
    marginBottom: 12,
    backgroundColor: '#F1F4FA',
  },
  recoverButtonText: {
    color: colors.primaryBlue,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: fonts.regular,
  },
  recoveryButtonStyle: {
    marginBottom: 12,
    backgroundColor: colors.primaryWhite,
    borderWidth: 1,
    borderColor: colors.primaryBlue,
  },
  signInButtonText: {
    color: colors.activeBlack,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: fonts.regular,
  },
  inActiveDotStyle: {
    backgroundColor: '#C9D7FF',
  },
  slideText: {
    fontSize: 20,
    fontWeight: '400',
    color: colors.darkest,
    fontFamily: fonts.regular,
    marginBottom: 80,
    marginTop: 35,
    textAlign: 'center',
  },
  slideContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    flex: 1,
  },
  guideView: {
    marginBottom: 10,
    marginTop: 10,
  },
});

//make this component available to the app
export default SignInScreen;
