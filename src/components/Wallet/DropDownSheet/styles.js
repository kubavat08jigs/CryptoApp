import { StyleSheet } from 'react-native';
import { colors } from '../../../helper/colorConstants';
import { fonts } from '../../../helper/fontconstant';
import { hp, wp } from '../../../helper/utils';

export const styles = StyleSheet.create({
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
		height: hp(64),
		width: 342,
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
	},
	iconStyle: { width: 24, height: 24, marginRight: 8 },
	coinName: {
		fontSize: 14,
		fontFamily: fonts.regular,
		color: colors.darkBlack,
		fontWeight: '500',
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
		// borderColor: colors.primaryBlue,
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
});
