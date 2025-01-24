import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Linking,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import * as Progress from 'react-native-progress';
import validator from 'validator';

import {MainHeader, PrimaryButton} from '../../../components';
import {colors} from '../../../helper/colorConstants';
import {hp, wp} from '../../../helper/utils';
import {icons} from '../../../helper/iconConstant';
import {resetNavigationStack} from '../../../helper/rootNavigation';
import {_fetch} from '../../../utils/_fetch';
import {baseUrl2, checkNaN} from '../../../utils/consts';
import {
  setAsyncStorage,
  getAsyncStorage,
} from '../../../helper/globalFunctions';
import {styles} from './styles';

// create a component
const RecoveryInputScreen = ({route}) => {
  const recoverByBackupShare = route?.params?.isBackup || false;

  const [headerText, setHeaderText] = useState(
    'Enter Email ID linked to\nyour wallet',
  );
  const [headerDesc, setHeaderDesc] = useState('');
  const [inputType, setInputType] = useState('email');
  const [resendComm, setResendComm] = useState('email');
  const [bottomText, setBottomText] = useState('Forgot Email');

  const [email, setEmail] = useState('');
  const [isEmailError, setIsEmailError] = useState('');
  const [isPhoneError, setIsPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remainingSec, setRemainingSec] = useState(60);
  const [countryCode, setCountryCode] = useState('IN');
  const [withCallingCode, setWithCallingCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otp, setOTP] = useState('');
  const [isResendText, setIsResendText] = useState(false);
  const [isRecoveredView, setIsRecoveredView] = useState(recoverByBackupShare);
  const [isProgressView, setIsProgressView] = useState(true);
  const [forgotEmail, setForgotEmail] = useState(false);
  const [dappShare, setDappShare] = useState(false);

  const inputRef = useRef();
  const otpRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setIsProgressView(false);
    }, 5000);
  }, []);

  const resetResendTimer = () => {
    setRemainingSec(60);
    if (otpRef.current) {
      clearInterval(otpRef.current);
      otpRef.current = null;
    }
    otpRef.current = setInterval(() => {
      setRemainingSec(val => {
        if (val === 1) {
          if (otpRef.current) {
            clearInterval(otpRef.current);
            otpRef.current = null;
          }
        }
        return val - 1;
      });
    }, 1000);
  };

  function onResendPress() {
    if (resendComm === 'EMAIL') {
      onEmailSubmit();
    } else {
      onMobileSubmit();
    }
  }

  const onFocus = () => {
    inputRef?.current?.focus();
  };

  const onBottomTextPress = () => {
    if (forgotEmail) {
      contactUs('Need Help (Phone Recovery)');
    } else {
      setHeaderText('Enter Phone number linked\nto your wallet');
      setHeaderDesc('');
      setInputType('phone');
      setBottomText('Need Help? Contact Us.');
      setForgotEmail(true);
      setEmail('');
      setIsEmailError('');
      setOtpError('');
    }
  };

  const onEmailSubmit = async () => {
    try {
      if (!email || !validator.isEmail(email.trim().toLowerCase())) {
        return setIsEmailError('Please enter a valid email address');
      }

      setLoading(true);
      resetResendTimer();

      let res = await _fetch(`${baseUrl2}/sendRecoveryOTP`, {
        method: 'POST',
        body: {
          channel: 'email',
          communication_id: email.trim().toLowerCase(),
        },
      });
      if (res.status === 200) {
        res = await res.json();
        // console.log('res', res);
        if (res.status === 200) {
          setIsEmailError('');
          setHeaderText('Enter OTP sent to \nyour email ID');
          setBottomText('');
          const atIndex = email.lastIndexOf('@');
          const maskedEmail =
            email.substring(0, 3) +
            '*'.repeat(email.length - atIndex - 1 - 3) +
            email.substring(atIndex);
          setHeaderDesc(`OTP has been sent to: \n${maskedEmail}`);
          setInputType('OTP');
          setResendComm('EMAIL');
        } else {
          setIsEmailError(res.message);
        }
        return;
      }
      setIsEmailError('Some error occurred please try again later');
    } catch (e) {
      console.log('e', e);
    } finally {
      setLoading(false);
    }
  };

  const verifyRecoveryEmailandGetMobile = async () => {
    // console.log('OTP', otp);
    try {
      let res = await _fetch(
        `${baseUrl2}/verifyRecoveryEmailOTPAndSendMaskedPhone`,
        {
          method: 'POST',
          body: {
            channel: 'email',
            communication_id: email.trim().toLowerCase(),
            otp: otp,
          },
        },
      );
      res = await res.json();
      // console.log('res', res);
      if (res.status === 200) {
        setOtpError('');
        setHeaderText('Enter Phone number linked \n to your wallet');
        const maskedPhone = '*'.repeat(7) + res.payload?.phone;
        setHeaderDesc(`Your wallet is connected to: \n${maskedPhone}`);
        setInputType('phone');
        setAsyncStorage(
          'recoveryVerificationToken',
          res.payload?.verification_token,
        );
      } else {
        setOtpError(res.message);
      }
    } catch (e) {
      console.log('e', e);
    } finally {
      setOTP('');
    }
  };

  const onMobileSubmit = async () => {
    try {
      if (
        !mobileNumber ||
        !validator.isMobilePhone(withCallingCode + mobileNumber.trim(), false, {
          strictMode: true,
        })
      ) {
        return setIsPhoneError('Please enter a valid phone number');
      }

      setLoading(true);

      const mobNo = withCallingCode + mobileNumber;
      resetResendTimer();

      let res = await _fetch(`${baseUrl2}/sendRecoveryOTP`, {
        method: 'POST',
        body: {
          channel: 'sms',
          communication_id: mobNo.trim(),
        },
      });
      if (res.status === 200) {
        res = await res.json();
        // console.log('res', res);
        if (res.status === 200) {
          setIsPhoneError('');
          setOtpError('');
          setHeaderDesc(
            `OTP has been sent to ${withCallingCode} ${mobileNumber?.replace(
              /.(?=.{3})/g,
              '*',
            )}`,
          );
          setHeaderText('Enter OTP sent to your\nphone number');
          setBottomText('');
          setInputType('OTP');
          setResendComm('PHONE');
        } else {
          setIsPhoneError(res.message);
          setOtpError(res.message);
        }
      } else {
        setIsEmailError('Some error occurred please try again later');
      }
    } catch (e) {
      console.log('e', e);
    } finally {
      setLoading(false);
    }
  };

  const verifyRecoveryPhoneandGetEmail = async () => {
    try {
      const mobNo = withCallingCode + mobileNumber;
      let res = await _fetch(
        `${baseUrl2}/verifyRecoveryPhoneOtpAndSendMaskedEmail`,
        {
          method: 'POST',
          body: {
            channel: 'sms',
            communication_id: mobNo.trim(),
            otp: otp,
          },
        },
      );
      res = await res.json();
      console.log('res', res);
      if (res.status === 200) {
        setOtpError('');
        setHeaderText('Confirm your email ID');
        const maskedEmail = res.payload?.email;
        setHeaderDesc(`Email connected to wallet is: \n${maskedEmail}`);
        setBottomText('');
        setInputType('email');
        setAsyncStorage(
          'recoveryVerificationToken',
          res.payload?.verification_token,
        );
        setAsyncStorage('recoverySid', res.payload?.sid);
      } else {
        setOtpError(res.message);
      }
    } catch (e) {
      console.log('e', e);
    } finally {
      setOTP('');
    }
  };

  const verifyRecoveryOtpandSendDapp = async () => {
    try {
      const mobNo = withCallingCode + mobileNumber;
      const verification_token = await getAsyncStorage(
        'recoveryVerificationToken',
      );
      console.log('verification_token', verification_token);
      let res = await _fetch(`${baseUrl2}/verifyRecoveryOtpAndSendDappShare`, {
        method: 'POST',
        body: {
          channel: forgotEmail ? 'email' : 'sms',
          communication_id: forgotEmail ? email : mobNo,
          otp: otp,
          verification_token,
        },
      });
      res = await res.json();
      console.log('res', res);
      if (res.status === 200) {
        setOtpError('');
        setIsRecoveredView(true);
        setDappShare(res.payload.dapp_share);
      } else {
        setOtpError(res.message);
      }
    } catch (e) {
      console.log('e', e);
    } finally {
      setOTP('');
    }
  };

  const onContinuePress = () => {
    if (inputType === 'phone') {
      onMobileSubmit();
    } else if (inputType === 'OTP') {
      if (email.length > 0 && mobileNumber.length === 0) {
        verifyRecoveryEmailandGetMobile();
      } else if (mobileNumber.length > 0 && email.length === 0) {
        verifyRecoveryPhoneandGetEmail();
      } else if (mobileNumber.length > 0 && email.length > 0) {
        verifyRecoveryOtpandSendDapp();
      }
    } else if (inputType === 'email') {
      onEmailSubmit();
    }
  };

  const onSelect = country => {
    setCountryCode(country.cca2);
    setWithCallingCode(`+${country?.callingCode}`);
  };

  const onMobileNumberChange = txt => {
    setMobileNumber(txt);
    setIsPhoneError('');
  };

  const contactUs = (subject = '', body = '') => {
    const contactMail = 'support@dolf.finance';
    Linking.openURL(`mailto:${contactMail}?subject=${subject}&body=${body}`);
  };

  const renderEmailInput = () => {
    return (
      <>
        <View
          style={[
            styles.emailContainer,
            {
              borderColor: isEmailError
                ? colors.errorText
                : 'rgba(0, 0, 0, 0.1)',
            },
          ]}>
          <View style={styles.emailPlaceholderView}>
            <Text
              style={[
                styles.emailLableText,
                {
                  color: isEmailError ? colors.errorText : colors.textGrayColor,
                },
              ]}>
              Email
            </Text>
          </View>
          <TextInput
            value={email}
            onChangeText={txt => {
              setIsEmailError('');
              if (typeof txt === 'string' && txt.trim() !== '') {
                setEmail(txt.trim());
              } else {
                setEmail(txt);
              }
            }}
            style={{
              marginHorizontal: wp(24),
              color: isEmailError ? colors.errorText : colors.activeBlack,
              bottom: 10,
            }}
          />
        </View>
        {isEmailError && (
          <View style={styles.invalidEmailErrorView}>
            <Image source={icons.warning} style={{height: 16, width: 16}} />
            <Text style={styles.inValidEmailText}>{isEmailError}</Text>
          </View>
        )}
      </>
    );
  };

  const renderPhoneInput = () => {
    return (
      <>
        <View style={styles.textInputStyle}>
          <CountryPicker
            containerButtonStyle={{
              marginLeft: wp(16),
            }}
            withFlag
            countryCode={countryCode}
            withCallingCode={true}
            withFilter
            onSelect={onSelect}
          />
          <Image source={icons.downIndicator} style={{width: 10, height: 6}} />
          <Text style={styles.countryCodeText}>{withCallingCode}</Text>
          <TextInput
            value={mobileNumber}
            onChangeText={onMobileNumberChange}
            style={styles.inputStyle}
            keyboardType="phone-pad"
          />
        </View>
        {isPhoneError && (
          <View style={styles.invalidEmailErrorView}>
            <Image source={icons.warning} style={{height: 16, width: 16}} />
            <Text style={styles.inValidEmailText}>{isPhoneError}</Text>
          </View>
        )}
      </>
    );
  };

  const renderOTPInput = () => {
    return (
      <>
        {/* <Text style={styles.enternumText}>Enter OTP</Text>
        <Text style={styles.addnumberDesc}>
          OTP has been sent to {withCallingCode} {mobileNumber}
        </Text> */}
        {otpError ? (
          <Text style={styles.incorrectText}>{otpError}</Text>
        ) : (
          <View style={{height: hp(23)}} />
        )}
        {/* <View style={styles.otpView}>
              <TextInput maxLength={4} />
            </View> */}
        <Pressable
          style={styles.otpContainer}
          onPress={() => inputRef.current.focus()}>
          <TextInput
            value={otp}
            onChangeText={txt => {
              setOtpError('');
              setOTP(txt);
            }}
            onFocus={onFocus}
            autoFocus={true}
            style={{height: 0, width: 0, position: 'absolute'}}
            keyboardType={'decimal-pad'}
            maxLength={6}
            blurOnSubmit={false}
            ref={inputRef}
          />
          {[1, 2, 3, 4, 5, 6]?.map((i, index) => {
            return (
              <View
                key={i}
                style={[
                  styles.otpTextItem,
                  i <= otp?.length ? styles.otpTextItemSelected : null,
                  otpError ? styles.OtpTextItemError : null,
                ]}>
                <Text style={styles.otpText}>{otp[index]}</Text>
              </View>
            );
          })}
        </Pressable>
        <Pressable
          style={{marginTop: 10}}
          onPress={remainingSec > 0 ? null : onResendPress}>
          <Text
            style={
              remainingSec > 0 ? styles.tapToResendText : styles.resendText
            }>
            {remainingSec === 0
              ? 'Tap to resend OTP'
              : `You can resend OTP in ${remainingSec}s`}
          </Text>
        </Pressable>
      </>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!isRecoveredView ? (
        <>
          <MainHeader />
          <View style={{alignItems: 'center', flex: 1}}>
            <Text style={styles.headerText}>{headerText}</Text>
            <Text style={styles.headerDesc}>{headerDesc}</Text>
            {inputType === 'email' && renderEmailInput()}
            {inputType === 'phone' && renderPhoneInput()}
            {inputType === 'OTP' && renderOTPInput()}
            <TouchableOpacity
              onPress={onBottomTextPress}
              style={{
                alignSelf: 'center',
                marginTop: isEmailError ? hp(24) : hp(45),
              }}>
              <Text style={styles.bottomTextStyle}>{bottomText}</Text>
            </TouchableOpacity>
          </View>
          <PrimaryButton
            onPress={onContinuePress}
            title={'Continue'}
            disable={
              inputType === 'email'
                ? email.length === 0
                : inputType === 'OTP'
                ? otp.length < 6
                : mobileNumber.length === 0
            }
            isLoader={loading}
          />
        </>
      ) : (
        <View style={{flex: 1, backgroundColor: colors.primaryWhite}}>
          <View style={{flex: 1}}>
            <Image source={icons.web3Wallet} style={styles.walletIcon} />
            <Text style={styles.createWalletText}>
              {isProgressView ? 'Recovering wallet' : 'Wallet Recovered'}
            </Text>
            {isProgressView && (
              <Progress.Bar
                progress={0.3}
                width={200}
                indeterminate
                indeterminateAnimationDuration={4000}
                unfilledColor={'#DADADA'}
                color={colors.primaryBlue}
                borderWidth={0}
                style={{alignSelf: 'center', marginTop: 17, width: 86}}
              />
            )}
          </View>
          {!isProgressView && (
            <PrimaryButton
              onPress={() => {
                resetNavigationStack('SignInScreen', {
                  dappShare,
                  isCreateAccount: true,
                });
              }}
              title={'Continue'}
            />
          )}
        </View>
      )}
    </ScrollView>
  );
};

// define your styles

//make this component available to the app
export default RecoveryInputScreen;
