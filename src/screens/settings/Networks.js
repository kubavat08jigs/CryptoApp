//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import {MainHeader} from '../../components';
import {colors} from '../../helper/colorConstants';
import {fonts} from '../../helper/fontconstant';
import {icons} from '../../helper/iconConstant';
import {hp, wp} from '../../helper/utils';
import {Switch} from '../../components';

// create a component
const Networks = () => {
  const coinSelectionData = [
    {
      title: 'USD Coin',
      icon: icons.usdCoin,
      isInNetwork: false,
    },
    {
      title: 'Tether',
      icon: icons.tetherCoin,
      isInNetwork: false,
    },
    {
      title: 'Ethereum',
      icon: icons.etheCoin,
      isInNetwork: false,
    },
    {
      title: 'Dai',
      icon: icons.daiCoin,
      isInNetwork: false,
    },
  ];

  const renderItem = ({item}) => {
    return (
      <View style={styles.networkItemContainer}>
        <View style={styles.leftView}>
          <Image style={styles.iconStyle} source={item?.icon} />
          <View>
            <Text style={styles.coinName}>{item?.title}</Text>
          </View>
        </View>
        <Switch switchContainer={{marginRight: wp(22)}} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <MainHeader title={'Networks'} />
      <FlatList
        contentContainerStyle={{alignSelf: 'center'}}
        data={coinSelectionData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index?.toString()}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
  },
  networkItemContainer: {
    borderWidth: 1,
    height: hp(80),
    width: 342,
    borderRadius: 12,
    backgroundColor: colors.primaryWhite,
    borderColor: colors.borderColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignItems: 'center',
  },
  leftView: {
    flexDirection: 'row',
    marginLeft: wp(22),
    alignItems: 'center',
  },
  iconStyle: {width: 24, height: 24, marginRight: 8},
  coinName: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.darkBlack,
    fontWeight: '500',
  },
});

//make this component available to the app
export default Networks;
