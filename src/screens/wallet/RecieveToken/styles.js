import { StyleSheet } from 'react-native';
import { colors } from '../../../helper/colorConstants';
import { fonts } from '../../../helper/fontconstant';
import { hp, wp } from '../../../helper/utils';

// define your styles
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
  },
  topCoinDropView: {
    // marginTop: hp(105),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropbtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // width: wp(140),
    height: hp(44),
    borderRadius: 42,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  dropbtnIcon: {
    height: 20,
    width: 20,
    marginLeft: wp(12),
  },
  dropBtnName: {
    fontSize: 14,
    fontFamily: fonts.regular,
    marginLeft: wp(8),
    color: colors.activeBlack,
  },
  dropBtnRightIcon: {
    width: 13,
    height: 7,
    marginLeft: 12,
    marginRight: wp(16),
  },
  availableAmountText: {
    fontSize: 10,
    fontFamily: fonts.regular,
    color: colors.activeBlack,
    lineHeight: 15,
  },
  amountView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: wp(52.5),
    marginTop: hp(3),
  },
  percentageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    //   backgroundColor: 'blue',
    marginHorizontal: 43,
    marginTop: 14.5,
  },
  percentageItem: {
    width: wp(60.24),
    height: hp(24),
    alignItems: 'center',
    backgroundColor: '#F8FAFE',
    marginHorizontal: wp(11),
    borderRadius: 33,
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 12,
  },
  alertView: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 24,
    borderRadius: 16,
    alignSelf: 'center',
    marginVertical: 13,
    flexDirection: 'row',
  },
  alertIconstyle: {
    width: 13,
    height: 13,
    marginRight: 10,
    marginTop: 2,
  },
  alertText: {
    fontSize: 10,
    color: colors.textGrayColor,
    marginRight: 18,
    lineHeight: 15,
  },
  walletBtnContainer: {
    width: hp(48),
    height: hp(48),
    borderRadius: hp(24),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
  },
  btnTitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    marginTop: hp(6),
    color: colors.darkBlack,
  },
  qrCodeView: {
    alignSelf: 'center',
    marginTop: hp(29),
    borderColor: colors.hardBorderColor,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
});
