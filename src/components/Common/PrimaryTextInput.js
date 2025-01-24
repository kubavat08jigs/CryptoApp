//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { getLocalText } from '../../helper/globalFunctions';
import { icons } from '../../helper/iconConstant';
import { hp, wp } from '../../helper/utils';

// create a component
const PrimaryTextInput = ({
  value,
  onChangeText,
  placeholder,
  cautionText,
  errorText,
  title,
  containerStyle,
  amount,
  isAmount,
  onFocus,
  onBlur,
  keyboardType = 'default',
  disabled = false,
  placeholderColor,
  titleStyle,
}) => {
  const onFocus1 = () => { };
  const onBlur1 = () => { };

  return (
    <View style={[styles.container, containerStyle]}>
      {title && (
        <Text style={[styles.btnTitleText, titleStyle]}>
          {getLocalText(title)}
        </Text>
      )}
      <View style={styles.inputView}>
        <TextInput
          value={value}
          placeholder={getLocalText(placeholder)}
          onChangeText={onChangeText}
          style={[styles.inputContainer, isAmount ? styles.adjustWidth : null]}
          placeholderTextColor={placeholderColor || colors.placeHolderText}
          onFocus={onFocus || onFocus1}
          onBlur={onBlur || onBlur1}
          keyboardType={keyboardType}
          editable={!disabled}
        />
        {isAmount && (
          <Text style={styles.enteredAmount}>
            ${isNaN(amount) ? 0 : amount?.toFixed(2)}
          </Text>
        )}
      </View>
      {cautionText && (
        <View style={styles.cautionView}>
          <Image source={icons.helperIcon} style={styles.helperIcon} />
          <Text style={styles.cautionText}>{getLocalText(cautionText)}</Text>
        </View>
      )}
      {errorText && (
        <View style={styles.cautionView}>
          <Icon
            name="exclamationcircleo"
            size={10}
            color={colors.errorText}
            style={{marginRight: 5}}
          />
          <Text style={styles.errorText}>{getLocalText(errorText)}</Text>
        </View>
      )}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp(31),
  },
  btnTitleText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    marginLeft: wp(8),
  },
  inputView: {
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  inputContainer: {
    // maxWidth: '70%',
    height: hp(56),
    // marginTop: hp(8),
    paddingHorizontal: wp(30),
    fontSize: 16,
    color: '#000',
  },
  adjustWidth: {
    maxWidth: '85%',
  },
  cautionView: {
    flexDirection: 'row',
    marginLeft: wp(31),
    marginTop: hp(6),
    alignItems: 'center',
  },
  helperIcon: {
    height: 13,
    width: 13,
    tintColor: colors.textGrayColor,
    marginRight: wp(3.5),
  },
  cautionText: {
    fontSize: 10,
    fontFamily: fonts.regular,
    color: colors.activeBlack,
    lineHeight: 15,
  },
  errorText: {
    fontSize: 10,
    fontFamily: fonts.regular,
    color: colors.errorText,
    lineHeight: 15,
  },
  enteredAmount: {
    color: colors.activeBlack,
    fontFamily: fonts.bold,
    marginEnd: 10
    // right: 65,
    // marginTop: 10,
  },
});

//make this component available to the app
export default PrimaryTextInput;
