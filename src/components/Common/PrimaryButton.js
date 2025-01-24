//import liraries
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { getLocalText } from '../../helper/globalFunctions';
import { icons } from '../../helper/iconConstant';
import { hp, wp } from '../../helper/utils';

// create a component
const PrimaryButton = ({
  onPress,
  title,
  iconSrc,
  containerStyle,
  titleStyle,
  disable,
  isLoader,
  leftIcon,
  rightIconStyle,
  loaderColor = colors.primaryWhite
}) => {
  return (
    <TouchableOpacity
      onPress={(disable || isLoader) ? null : onPress}
      disable={disable}
      style={[
        styles.primaryButton,
        { backgroundColor: disable ? '#B2CBFF' : colors.primaryBlue },
        containerStyle,
      ]}>
      {isLoader ? (
        <ActivityIndicator color={loaderColor} />
      ) : (
        <>
          {leftIcon && (
            <Image source={leftIcon} style={styles.leftBtnIconStyle} />
          )}
          <Text style={[styles.btnTitleStyle, titleStyle]}>
            {getLocalText(title)}
          </Text>
          {iconSrc && (
            <Image
              style={[styles.btnIconStyle, rightIconStyle]}
              source={iconSrc}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  primaryButton: {
    width: wp(340),
    height: hp(56),
    alignSelf: 'center',
    backgroundColor: colors.primaryBlue,
    borderRadius: 12,
    marginBottom: hp(37),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTitleStyle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primaryWhite,
    marginRight: wp(10.71),
  },
  btnIconStyle: {
    height: 20,
    width: 20,
  },
  leftBtnIconStyle: {
    height: 20,
    width: 20,
    marginRight: 9,
  },
});

//make this component available to the app
export default PrimaryButton;
