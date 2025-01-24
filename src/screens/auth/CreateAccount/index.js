import React, {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import {
	View,
	Text,
	Image,
	TextInput,
	KeyboardAvoidingView,
	ScrollView,
	TouchableOpacity,
	Keyboard,
	Pressable,
	Modal,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import * as Progress from 'react-native-progress';
import { useSelector } from 'react-redux';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';

import { colors } from '../../../helper/colorConstants';
import { icons } from '../../../helper/iconConstant';
import { hp, isIos, wp } from '../../../helper/utils';
import { _fetch } from '../../../utils/_fetch';

import { MainHeader, PrimaryButton } from '../../../components';
import { navigate, resetNavigationStack } from '../../../helper/rootNavigation';
import { styles } from './styles';
import { baseUrl2 } from '../../../utils/consts';
import UserStore from '../../../asyncStore/user';
import ReferalCodeModal from '../../../components/Common/ReferralCodeModal';
import validator from 'validator';


const EnterNumberComponenet = ({
  countryCode,
  onSelect,
  withCallingCode,
  mobileNumber,
  onMobileNumberChange,
  phoneError,
}) => (
  <>
    <Text style={styles.enternumText}>Enter your phone number</Text>
    <Text style={styles.addnumberDesc}>
      Add phone number to protect your account
    </Text>
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
        <Image source={icons.downIndicator} style={styles.downIcon} />
        <Text style={styles.countryCodeText}>{withCallingCode}</Text>
        <TextInput
          value={mobileNumber}
          onChangeText={onMobileNumberChange}
          style={styles.inputStyle}
          keyboardType="phone-pad"
        />
      </View>
      {phoneError && (
        <View style={styles.invalidEmailErrorView}>
          <Image source={icons.warning} style={styles.invalidIcon} />
          <Text style={styles.inValidEmailText}>{phoneError}</Text>
        </View>
      )}
    </>
  </>
);

const EnterOTPComponenet = ({
	withCallingCode,
	mobileNumber,
	error,
	setError,
	otp,
	setOTP,
	onFocus,
	inputRef,
	isResendText,
	remainigSec,
	onTapToResendPress
}) => {
	return (
    <>
      <Text style={styles.enternumText}>Enter OTP</Text>
      <Text style={styles.addnumberDesc}>
        OTP has been sent to {withCallingCode} {mobileNumber}
      </Text>
      {error ? (
        <Text style={styles.incorrectText}>{error}</Text>
      ) : (
        <View style={{height: hp(23)}} />
      )}
      {/* <View style={styles.otpView}>
	  <TextInput maxLength={4} />
	</View> */}
      <Pressable style={styles.otpContainerView} onPress={() => onFocus()}>
        <TextInput
          value={otp}
          onChangeText={txt => (setOTP(txt), setError(''))}
          onFocus={onFocus}
          autoFocus={true}
          style={styles.otpTextInput}
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
                error ? styles.OtpTextItemError : null,
              ]}>
              <Text style={styles.otpText}>{otp[index]}</Text>
            </View>
          );
        })}
      </Pressable>
      {isResendText ? (
        <Text style={styles.tapToResendText}>
          You can resend OTP in {remainigSec}s
        </Text>
      ) : (
        <TouchableOpacity onPress={onTapToResendPress}>
          <Text style={styles.reserndText}>Tap to resend</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

// create a component
export default function CreateAccount() {

	const [isProgressView, setIsProgressView] = useState(true);
	const [isMobileComponent, setMobileComponent] = useState(true);
	const [isResendText, setIsResendText] = useState(false);
	const [remainigSec, setRemainigSec] = useState(20);
	const [countryCode, setCountryCode] = useState('IN');
	const [withCallingCode, setWithCallingCode] = useState('+91');
	const [mobileNumber, setMobileNumber] = useState('');
	const [phoneError, setPhoneError] = useState('');
	const [error, setError] = useState(false);
	const [otp, setOTP] = useState('');
	const [openReferraModal, setOpenReferralModal] = useState(false);
	const [referralResult, serReferralResult] = useState();
	const [loading, setLoading] = useState(false);

	const inputRef = useRef();

	const user = useSelector(st => st.user);

	const { oAuthIdToken } = useSelector(st => st.user);

	useEffect(() => {
		setTimeout(() => {
			setIsProgressView(false);
		}, 1000);
		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				inputRef?.current?.blur();
			}
		);
		return () => {
			keyboardDidHideListener.remove();
		};
	}, []);

	const onMobileNumberChange = txt => {
		setMobileNumber(txt);
		setPhoneError('');
	};

	const onSelect = country => {
		setCountryCode(country.cca2);
		setWithCallingCode(`+${country?.callingCode}`);
	};

	async function signup() {
    try {
      if (
        !mobileNumber ||
        !validator.isMobilePhone(withCallingCode + mobileNumber.trim(), false, {
          strictMode: true,
        })
      ) {
        return setPhoneError('Please enter a valid phone number');
      }

      setLoading(true);
      console.log(withCallingCode, mobileNumber);
      const body = {
        mobile: `${withCallingCode}${mobileNumber}`,
        token: oAuthIdToken,
      };

      await analytics().logEvent('enter_otp', {
        mobile: 3745092,
        item: `${withCallingCode}${mobileNumber}`,
      });

      let res = await _fetch(`${baseUrl2}/sendOtp`, {
        method: 'POST',
        body,
      });

      res = await res.json();

      if (res.status === 200) {
        console.log('Inside send OTP, OTP send->', res);
        setMobileComponent(false);
        setIsResendText(true);
        setPhoneError('');
      } else {
        setPhoneError(res.message);
        console.log(res);
        console.log('Inside send OTP, OTP Not sent->', res);
      }

      // setError(res.message);
    } catch (e) {
      crashlytics().recordError(e);
      console.log(e);
      setPhoneError('Some error occurred please try again later');
    } finally {
      setLoading(false);
    }
  }

	async function handleOtp() {
		try {

			setLoading(true);

			const obj = {
				token: user.oAuthIdToken,
				mobile: `${withCallingCode}${mobileNumber}`,
				otp: otp,
			};


			obj.share = user.dappShare;


			const res = await _fetch(`${baseUrl2}/verifyOtpAndSaveShare`, {
				method: 'POST',
				body: obj,
				token: user.jwtToken,
			});

			if (res.status === 200) {
				const result = await res.json();
				console.log('Otp Verified and DAPP shared saved',result);
				if (result.status === 200) {
					const data = await UserStore.getUser();
					data.userInfo.is_dapp_saved = true;
					UserStore.setUser(data);
					resetNavigationStack('BottomTab');
				} else {
					console.log('Otp Not Verified',result);
					setError(result.message);
				}
			} else {
				const result = await res.text();
				console.log(result);
				// setError('Some error occurred, please try again later');
			}
		} catch (err) {
			console.log(err);
			// setError('Some error occurred, please try again later');
		} finally {
			setLoading(false);
		}
	}

	const onContinuePress = async () => {

		console.log(isMobileComponent);

		if (isMobileComponent) {
			signup();
		} else {
			handleOtp();
		}
	};

	const onFocus = () => {
		inputRef?.current?.focus();
	};

	const onTapToResendPress = () => {
		// setInterval(() => {
		//   setRemainigSec(remainigSec - 1);
		// }, 1000);
		setIsResendText(true);
		setError('');
		setOTP('');
		signup();
	};

	useEffect(() => {
		let interval;
		if (isResendText && remainigSec >= 0) {
			interval = setInterval(() => {
				setRemainigSec(remainigSec - 1);
			}, 1000);
		}
		if (remainigSec === 0) {
			setIsResendText(false);
			setRemainigSec(20);
		}
		return () => clearInterval(interval);
	}, [isResendText, remainigSec]);

	return (
		<ScrollView
			bounces={false}
			keyboardShouldPersistTaps='always'
			contentContainerStyle={styles.container}>
			{isProgressView ? (
				<View>
					<Image source={icons.web3Wallet} style={styles.walletIcon} />
					<Text style={styles.createWalletText}>Creating wallet</Text>
					<Progress.Bar
						progress={0.3}
						width={200}
						indeterminate
						indeterminateAnimationDuration={4000}
						unfilledColor={'#DADADA'}
						color={colors.primaryBlue}
						borderWidth={0}
						style={{ alignSelf: 'center', marginTop: 17, width: 86 }}
					/>
				</View>
			) : (
				<View
					style={{
						backgroundColor: colors.primaryWhite,
						flex: 1,
					}}
				>
					<View style={{ flex: 1 }}>
						<MainHeader hideBack={true} title={'Create Account'} />
						{
							isMobileComponent ? (
								<EnterNumberComponenet
									countryCode={countryCode}
									onSelect={onSelect}
									withCallingCode={withCallingCode}
									mobileNumber={mobileNumber}
									onMobileNumberChange={onMobileNumberChange}
									phoneError={phoneError}
								/>
							) : (
								<EnterOTPComponenet
									withCallingCode={withCallingCode}
									mobileNumber={mobileNumber}
									error={error}
									setError={setError}
									otp={otp}
									setOTP={setOTP}
									onFocus={onFocus}
									inputRef={inputRef}
									isResendText={isResendText}
									remainigSec={remainigSec}
									onTapToResendPress={onTapToResendPress}
								/>
							)
						}
					</View>
					{referralResult?.success ?
						<Text style={[styles.referralText, { color: colors.primaryGreen }]} onPress={() => setOpenReferralModal(true)}>Referral Code {referralResult?.code} Applied Successfully!</Text> :
						<Text style={styles.referralText} onPress={() => setOpenReferralModal(true)}>Have A Referral Code?</Text>
					}

					<KeyboardAvoidingView behavior={isIos ? 'padding' : 'height'}>
						<PrimaryButton
							isLoader={loading}
							disable={mobileNumber?.length === 0}
							title={'Continue'}
							iconSrc={icons.fi_arrow_right}
							onPress={onContinuePress}
						/>
					</KeyboardAvoidingView>
				</View>
			)
			}
			<ReferalCodeModal visible={openReferraModal} setVisible={setOpenReferralModal} result={serReferralResult} />
		</ScrollView >
	);
};

