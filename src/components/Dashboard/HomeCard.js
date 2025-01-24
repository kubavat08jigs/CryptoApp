//import liraries
import React, { Component } from 'react';
import { Text, StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { getLocalText } from '../../helper/globalFunctions';
import { fontSize, hp, wp } from '../../helper/utils';

// create a component
const HomeCard = ({ imageSource, title, onPress, bgColor, contentColor, Icon = null }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, {backgroundColor: bgColor}]}>
      <View style={styles.innerContainer}>
        {Icon}
        {imageSource && (
          <Image
            resizeMode="center"
            source={imageSource}
            style={[styles.iconStyle, {tintColor: contentColor}]}
          />
        )}
        <Text style={[styles.textStyle, {color: contentColor}]}>
          {getLocalText(title)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    margin: wp(6),
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFE',
    borderColor: colors.borderColor,
    paddingVertical: hp(29),
    paddingHorizontal: wp(34),
    flex: 1,
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    height: hp(24),
    width: wp(24),
    justifyContent: 'center',
    marginBottom: hp(12),
  },
  textStyle: {
    fontSize: fontSize(14),
    color: colors.primaryBlack,
    fontFamily: fonts.medium,
  },
});

//make this component available to the app
export default HomeCard;
