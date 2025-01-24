//import liraries
import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FundBalanceItem, MainHeader } from '../../components';
import { colors } from '../../helper/colorConstants';
import { icons } from '../../helper/iconConstant';
import { navigate } from '../../helper/rootNavigation';
import { hp } from '../../helper/utils';
import Share from 'react-native-share';
import { useSelector } from 'react-redux';

// create a component
const AddFunds = () => {
  const { referral_code } = useSelector(st => st.user);
  const renderData = [
    {
      title: 'Buy Crypto',
      icon: icons.dollarPlusGreen,
      onPress: () => {
        navigate('BuyCrypto');
      },
    },
    // {
    //   title: 'Request your friend to transfer funds',
    //   icon: icons.userPlus,
    //   onPress: async () => {
    //     await Share.open({
    //       message: `Join Dolf - the Web3 Bank on DeFi. Get up to $20 MATIC free when you refer Dolf to 3 friends or more. dolf.finance/?referralcode=ABCDEF`
    //     });
    //   },
    // },
    {
      title: 'Receive crypto from another wallet',
      icon: icons.bottomCrossArrow,
      onPress: () => {
        navigate('ReceiveToken');
      },
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <FundBalanceItem
        title={item?.title}
        iconsrc={item?.icon}
        onPress={item?.onPress}
      />
    );
  };

  return (
    <View style={styles.container}>
      <MainHeader title={'Add Funds'} />
      <FlatList
        style={{ marginTop: hp(41) }}
        data={renderData}
        renderItem={renderItem}
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
});

//make this component available to the app
export default AddFunds;
