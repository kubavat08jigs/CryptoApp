import {StyleSheet} from 'react-native';
import {colors} from '../../../helper/colorConstants';
import {fonts} from '../../../helper/fontconstant';
import {hp, wp} from '../../../helper/utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
  },
  walletIcon: {
    width: hp(335),
    height: hp(335),
    alignSelf: 'center',
    marginTop: hp(170),
  },
  createWalletText: {
    fontSize: 24,
    fontFamily: fonts.bold,
    fontWeight: '600',
    color: colors.darkest,
    alignSelf: 'center',
    marginTop: hp(55),
  },
  enternumText: {
    fontSize: 24,
    fontFamily: fonts.bold,
    fontWeight: '600',
    color: colors.darkest,
    alignSelf: 'center',
    marginTop: hp(80),
  },
  addnumberDesc: {
    fontSize: 16,
    fontFamily: fonts.regular,
    fontWeight: '400',
    color: colors.activeBlack,
    alignSelf: 'center',
    marginTop: hp(12),
  },
  textInputStyle: {
    alignSelf: 'center',
    width: wp(336),
    backgroundColor: '#ECECEC',
    height: hp(64),
    borderRadius: 12,
    marginTop: hp(48),
    flexDirection: 'row',
    alignItems: 'center',
  },
  downIcon: {
    width: 10,
    height: 6,
  },
  countryCodeText: {
    fontSize: 24,
    fontFamily: fonts.bold,
    fontWeight: '600',
    color: colors.darkest,
    marginLeft: wp(16),
  },
  invalidEmailErrorView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
  },
  inValidEmailText: {
    fontSize: 12,
    fontWeight: '400',
    marginLeft: 4,
    color: colors.errorText,
  },
  invalidIcon: {
    height: 16,
    width: 16,
  },
  referralInput: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: fonts.bold,
    alignSelf: 'center',
    width: wp(336),
    backgroundColor: '#ECECEC',
    height: hp(64),
    borderRadius: 12,
    paddingHorizontal: 10,
    marginTop: hp(28),
    flexDirection: 'row',
    alignItems: 'center',
  },
  referralText: {
    fontSize: 16,
    color: colors.primaryBlue,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: fonts.semiBold,
  },
  inputStyle: {
    width: wp(150),
    marginLeft: wp(16),
    fontSize: 24,
    fontWeight: '800',
    fontFamily: fonts.bold,
    color: colors.activeBlack,
  },
  otpView: {
    alignSelf: 'center',
    width: wp(200),
    // backgroundColor: 'red',
    backgroundColor: '#ECECEC',
    height: hp(64),
    borderRadius: 12,
    marginTop: hp(25),
    alignItems: 'center',
  },
  otpContainerView: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
    backgroundColor: '#ECECEC',
    alignSelf: 'center',
    marginTop: hp(25),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpTextInput: {
    height: 0,
    width: 0,
    position: 'absolute',
  },
  otpText: {
    color: colors.primaryWhite,
    fontWeight: '500',
    fontSize: 18,
    fontFamily: fonts.bold,
    padding: 2,
  },
  otpTextItem: {
    minHeight: 35,
    minWidth: 28,
    borderRadius: 15,
    backgroundColor: '#ECECEC',
    borderWidth: 2,
    borderColor: '#808588',
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpTextItemSelected: {
    backgroundColor: 'blue',
    borderWidth: 0,
    borderColor: '#ECECEC',
  },
  OtpTextItemError: {
    borderColor: colors.errorText,
  },
  tapToResendText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: fonts.regular,
    alignSelf: 'center',
    color: colors.textGrayColor,
    marginTop: hp(12),
  },
  reserndText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: fonts.bold,
    alignSelf: 'center',
    color: colors.primaryBlue,
    marginTop: hp(12),
  },
  incorrectText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: fonts.regular,
    alignSelf: 'center',
    color: colors.errorText,
    marginTop: hp(4),
  },
});
