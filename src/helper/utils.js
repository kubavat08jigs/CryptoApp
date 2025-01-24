import {Platform} from 'react-native';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {RFValue} from 'react-native-responsive-fontsize';

export const wp = val => {
  const finalVal = (val * 100) / 390;
  return widthPercentageToDP(finalVal);
};

export const hp = val => {
  const finalVal = (val * 100) / 844;
  return heightPercentageToDP(finalVal);
};

export const statusBarHeight = getStatusBarHeight();

export const fontSize = val => RFValue(val, 844);

export const isIos = Platform.OS === 'ios';
