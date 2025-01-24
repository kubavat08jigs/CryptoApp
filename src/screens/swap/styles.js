import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { hp, wp } from '../../helper/utils';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.primaryWhite,
	},
	dropbtnContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 44,
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 42,
		borderWidth: 1,
		justifyContent: 'center',
		borderColor: '#E5E5E5',
		width: Dimensions.get('screen').width * 0.4,
	},
	dropbtnIcon: {
		height: 20,
		width: 20,
	},
	dropBtnName: {
		fontSize: 14,
		fontFamily: fonts.regular,
		marginHorizontal: 8,
		color: colors.activeBlack,
		flex: 1,
	},
	dropBtnRightIcon: {
		width: 13,
		height: 7,
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
		color: '#000',
		fontWeight: '500'
	},
	converterView: {
		width: wp(331),
		height: hp(122),
		borderRadius: 10,
		marginTop: hp(50),
		alignSelf: 'center',
		backgroundColor: '#F8F9FA',
	},
	converterText: {
		fontSize: 14,
		fontWeight: '700',
		fontFamily: fonts.bold,
		alignSelf: 'center',
		marginTop: hp(24),
		color: '#000000'
	},
	convertertitle: {
		fontSize: 14,
		fontWeight: '400',
		fontFamily: fonts.regular,
		color: '#454545',
	},
	converterVal: {
		fontSize: 14,
		fontWeight: '700',
		fontFamily: fonts.bold,
		color: colors.activeBlack,
	},
	converterInnerView: {
		flexDirection: 'row',
		marginHorizontal: wp(31),
		justifyContent: 'space-between',
		marginTop: 21,
	},
	sheetTitle: {
		alignSelf: 'center',
		fontSize: 16,
		fontFamily: fonts.regular,
		color: colors.activeBlack,
	},
	selectionItem: {
		width: 342,
		height: 80,
		// borderColor: colors.borderColor,
		borderWidth: 1,
		borderRadius: 16,
		flexDirection: 'row',
	},
	walletItemContainer: {
		borderWidth: 1,
		height: 64,
		width: Dimensions.get('screen').width - 40,
		borderRadius: 12,
		backgroundColor: '#F8FAFE',
		borderColor: colors.borderColor,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 8,
	},
	leftView: {
		flexDirection: 'row',
		marginLeft: wp(22),
		alignItems: 'center',
		flex: 1,
	},
	iconStyle: {
		width: 24,
		height: 24,
		marginRight: 8
	},
	coinName: {
		fontSize: 14,
		fontFamily: fonts.regular,
		color: colors.darkBlack,
		fontWeight: '500',
		flex: 1,
	},
	coinAmountText: {
		fontSize: 12,
		fontFamily: fonts.regular,
		color: colors.darkBlack,
		fontWeight: '500',
		lineHeight: 16.8,
	},
	coinInDollar: {
		fontSize: 12,
		fontFamily: fonts.regular,
		color: colors.textGrayColor,
		fontWeight: '500',
	},
	rightView: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	selectionView: {
		height: 20,
		width: 20,
		borderRadius: 12,
		marginRight: 12,
		marginLeft: 32,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	activeRadio: {
		height: 12,
		width: 12,
		borderRadius: 6,
		backgroundColor: colors.primaryBlue,
	},
	availableAmountText: {
		fontSize: 12,
		fontFamily: fonts.regular,
		color: colors.textGrayColor,
	},
});
