//import liraries
import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../../helper/colorConstants';
import {fonts} from '../../helper/fontconstant';
import {getLocalText} from '../../helper/globalFunctions';
import {hp, wp} from '../../helper/utils';

// create a component
const Button = ({
  onPress,
  title,
  iconSrc,
  style,
  titleStyle,
  disable,
  isLoader,
  leftIcon,
  rightIconStyle,
  loaderColor = colors.primaryWhite,
}) => {
  return (
    <TouchableOpacity
      onPress={disable || isLoader ? null : onPress}
      disable={disable}
      style={[
        styles.primaryButton,
        disable ? styles.disabled : null,
        style,
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
    backgroundColor: colors.primaryBlue,
    borderRadius: 12,
    marginBottom: hp(20),
    paddingVertical: hp(12),
    paddingHorizontal: wp(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  disabled: {
    backgroundColor: '#B2CBFF',
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
export default Button;
