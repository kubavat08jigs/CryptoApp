//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { icons } from '../../helper/iconConstant';
import { fontSize, hp, wp } from '../../helper/utils';
import { navigate } from '../../helper/rootNavigation';

// create a component
const CoinDetailsItem = ({
  onRightIconPress,
  isleftIconVisible,
  isRightIconVisible,
  coinAmount,
  coinSubAmount,
  coinAmountTextStyle,
  coinSubAmountTextStyle,
  coinSubName,
  containerStyle,
  leftIcon,
  data
}) => {

  const onAddTokenPress = () => {
    console.log(data);
    navigate('TokenDetails', { data: data.detailData });
  };

  return (
    <TouchableOpacity onPress={onRightIconPress} style={[styles.coinDetailsView, containerStyle]}>
      <View style={{ flexDirection: 'row', marginLeft: wp(6) }}>
        {isleftIconVisible ? (
          <Image source={leftIcon} style={styles.detailedIcon} />
        ) : (
          <View style={{ marginLeft: wp(0) }} />
        )}
        <Text style={styles.coinDetailedName}>{coinSubName}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.coinAmountText, coinAmountTextStyle]}>
            {coinAmount}
          </Text>
          <Text style={[styles.coinInDollar, coinSubAmountTextStyle]}>
            {coinSubAmount}
          </Text>
        </View>
        {isRightIconVisible ? (
          <View
            style={styles.rightIconView}>
            <Image style={styles.rightIconStyle} source={icons.rightArrow} />
          </View>
        ) : (
          <View style={styles.rightIconView} />
        )}
      </View>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  coinDetailsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: hp(66),
    width: wp(310),
    alignSelf: 'center',
  },
  detailedIcon: {
    height: 20,
    width: 20,
    marginRight: wp(8),
  },
  coinDetailedName: {
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
  rightIconView: {
    // marginRight: wp(30),
    marginLeft: wp(15),
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIconStyle: {
    width: 6,
    height: 12,
  },
});

//make this component available to the app
export default CoinDetailsItem;
