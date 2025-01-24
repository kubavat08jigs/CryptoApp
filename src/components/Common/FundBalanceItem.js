//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { icons } from '../../helper/iconConstant';
import { hp, wp } from '../../helper/utils';

// create a component
const FundBalanceItem = ({ iconsrc, title, onPress, isIconBG }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.fundItemContainer} >
      <View style={styles.leftView}>
        {isIconBG ? (
          <View style={styles.iconContainer}>
            <Image style={styles.iconbgStyle} source={iconsrc} />
          </View>
        ) : (
          <Image style={styles.iconStyle} source={iconsrc} />
        )}
        <Text style={styles.coinName}>{title}</Text>
      </View>
      <View style={styles.rightIconView}>
        <Image style={styles.rightIconStyle} source={icons.rightArrow} />
      </View>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  fundItemContainer: {
    borderWidth: 1,
    height: hp(64),
    borderRadius: 12,
    backgroundColor: '#F8FAFE',
    borderColor: colors.borderColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp(24),
    alignItems: 'center',
    marginBottom: hp(13),
  },
  leftView: {
    flexDirection: 'row',
    marginLeft: wp(22),
    alignItems: 'center',
  },
  iconStyle: {width: 24, height: 24, marginRight: 12},
  coinName: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.primaryText,
    fontWeight: '600',
    width: wp(215),
  },
  rightIconView: {
    marginLeft: wp(15),
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(28),
  },
  rightIconStyle: {
    width: 6,
    height: 12,
  },
  iconContainer: {
    width: hp(30),
    height: hp(30),
    borderRadius: hp(26) / 2,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(8),
  },
  iconbgStyle: {
    height: hp(18),
    width: hp(18),
  },
});

//make this component available to the app
export default FundBalanceItem;
