import {StyleSheet} from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import {colors} from '../../../helper/colorConstants';
import {fonts} from '../../../helper/fontconstant';
import {fontSize, hp, wp} from '../../../helper/utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
  },
  balanceView: {},
  totalBalanceView: {
    marginTop: hp(37),
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  totalBalanceText: {
    fontSize: fontSize(15),
    color: colors.textGrayColor,
    fontFamily: fonts.regular,
  },
  eyeStyle: {
    height: hp(16),
    width: wp(16),
    marginLeft: wp(3),
    padding: 5,
  },
  mainAmountText: {
    fontSize: fontSize(40),
    marginTop: hp(15),
    alignSelf: 'center',
    fontFamily: fonts.regular,
    color: colors.primaryBlack,
  },
  pointamountStyle: {
    fontSize: fontSize(20),
    fontFamily: fonts.regular,
    color: colors.primaryBlack,
  },
  walletBtnContainer: {
    width: hp(48),
    height: hp(48),
    borderRadius: hp(24),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    marginHorizontal : wp(20)
  },
  btnTitle: {
    fontSize: 14,
    fontFamily: fonts.medium,
    marginTop: hp(6),
    color: colors.darkBlack,
  },
  headerBtnView: {
    flexDirection: 'row',
    justifyContent : 'center',
    marginTop: hp(32),
  },
  addTokenView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: hp(19.5),
    marginBottom: hp(25),
  },
  addTokenIcon: {
    height: 16,
    width: 16,
    tintColor: colors.primaryBlack,
    marginRight: wp(6),
  },
  addTokenText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.darkBlack,
    fontWeight: '500',
  },
  emptyWalletTitle: {
    fontSize: 24,
    fontFamily: fonts.semiBold,
    color: colors.darkest,
    marginTop: 20,
    lineHeight : 28.8,
    letterSpacing : -0.5
  },
  emptyWalletDesc: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: fonts.regular,
    color : colors.textGrayColor,
    width: 266,
    textAlign: 'center',
    marginTop: hp(2),
  },
});
