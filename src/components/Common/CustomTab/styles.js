import { StyleSheet } from 'react-native';
import { colors } from '../../../helper/colorConstants';
import { fonts } from '../../../helper/fontconstant';

export const styles = StyleSheet.create({
  balanveTabView: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: colors.borderColor,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  tabOuterView: {
    height: 41,
    justifyContent: 'center',
    borderColor: colors.activeBlack,
  },
  tabTitleText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: fonts.regular,
    color: '#000000',
  },
});

