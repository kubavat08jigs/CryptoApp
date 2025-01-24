import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { hp, wp } from '../../helper/utils';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: screenHeight,
    width: screenWidth,
    backgroundColor: colors.primaryWhite,
  },
  pinInputView: {
		width: 200,
		height: 64,
		borderRadius: 10,
		alignSelf: 'center',
		marginTop: hp(5),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	numpadContainer: { alignSelf: 'center', marginTop: 10, borderRadius: 20 },
	numpadItem: {
		height: 74,
		width: 74,
		marginVertical: 10,
		marginHorizontal: 21,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	enternumText: {
		fontSize: 24,
		fontFamily: fonts.bold,
		fontWeight: '600',
		color: colors.darkest,
		alignSelf: 'center',
		marginTop: hp(19),
	},
	addnumberDesc: {
		fontSize: 16,
		fontFamily: fonts.regular,
		fontWeight: '400',
		color: colors.activeBlack,
		alignSelf: 'center',
		marginTop: hp(12),
	},
	resetText: {
		fontSize: 14,
		fontFamily: fonts.bold,
		fontWeight: '700',
		color: colors.primaryBlue,
	},
	incorrectText: {
		fontSize: 16,
		fontWeight: '400',
		fontFamily: fonts.regular,
		alignSelf: 'center',
		color: colors.errorText,
		marginTop: hp(4),
	},
	btmsheetTitle: {
		fontSize: 24,
		fontWeight: '600',
		fontFamily: fonts.regular,
		color: colors.activeBlack,
		marginTop: hp(16),
	},
	btmsheetDesc: {
		fontSize: 16,
		fontWeight: '500',
		fontFamily: fonts.regular,
		color: colors.textGrayColor,
		textAlign: 'center',
	},
	btnView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 56,
	},
	cancelBtnStyle: {
		width: wp(167),
		height: hp(54),
		borderRadius: 10,
		marginHorizontal: 4,
		backgroundColor: '#F1F4FA',
	},
	approveBtnStyle: {
		width: wp(167),
		height: hp(54),
		borderRadius: 10,
		marginHorizontal: 4,
		backgroundColor: colors.primaryBlue,
	},
});

export default styles;
