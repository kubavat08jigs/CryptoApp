//import liraries
import React, { Component, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { useSelector } from 'react-redux';
import { BalanceCard, CustomTab } from '../../components';
import DetailedHeader from '../../components/Common/DetailedHeader';
import CustomImage from '../../components/Common/Image';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { icons } from '../../helper/iconConstant';
import { navigate } from '../../helper/rootNavigation';
import { AddCircle } from '../../helper/svgconstant';
import { hp, wp } from '../../helper/utils';
import { env } from '../../utils/consts';

// create a component
const Portfolio = () => {
  const [toggleSwitch, setToggleSwitch] = useState(true);
  const [activeTeb, setActiveTab] = useState(0);
  const app = useSelector(st => st.app);
  console.log("AAAAAPPPPPPP", app);

  const onSwitchPress = () => {
    setToggleSwitch(!toggleSwitch);
  };

  const walletData = useSelector(st => st.wallet);

  const amount = walletData.totalIdleDollarBalance;

  const onSeeListPress = () => {
    navigate('PortfolioList', { data: walletData });
  };

  const renderItem = ({ item }) => {
    console.log(item);
    return (
      <TouchableOpacity style={styles.fundItemContainer}>
        <View style={styles.leftView}>
          <CustomImage
            style={styles.iconStyle}
            uri={activeTeb === 0
              ? item?.logo_url
              : app?.[env === 'DEV' ? 'test_net_providers' : 'mainnet_provider_urls']?.[`${item.chain_id}`]?.image_url
            } />
          <Text style={styles.coinName}>{item?.name}</Text>
        </View>
        <View onPress={() => { }} style={styles.rightIconView}>
          <Text style={[styles.tabTitleText, { fontWeight: '700' }]}>
            {toggleSwitch ? item?.percentage?.toFixed(1) + '%' : '$' + item?.total_quote_balance.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <DetailedHeader />
      <View>
        <BalanceCard amount={amount} changeAmount={walletData.change24H} />
      </View>
      {
        amount > 0 &&
        <TouchableOpacity style={styles.addButtonView} onPress={() => navigate('AddFunds')}>
          <Text style={styles.addFundTextStyle}>Add Funds</Text>
          <Image source={icons.addCircle} style={styles.addIconStyle} />
        </TouchableOpacity>
      }
      <View style={styles.balanceAllocationView}>
        <Text style={styles.balanceAllocationText}>Balance Allocation</Text>
        <View style={{ flexDirection: 'row', marginRight: wp(24) }}>
          <Text style={styles.switchLEftText}>$</Text>
          <TouchableOpacity onPress={onSwitchPress} style={styles.switchView}>
            <View
              style={[
                styles.switchstyle,
                { alignSelf: toggleSwitch ? 'flex-end' : 'flex-start' },
              ]}></View>
          </TouchableOpacity>
          <Text style={styles.switchLEftText}>%</Text>
        </View>
      </View>
      <View style={styles.portfoliomainView}>
        <CustomTab tabData={['By Assets', 'By Chains']} setTabActive={setActiveTab} />
        <FlatList
          data={activeTeb === 0 ? walletData.balancePerCoin?.sort((a, b) => b.total_quote_balance - a.total_quote_balance).slice(0, 3) : walletData.balancePerChain?.slice(0, 3)}
          renderItem={renderItem}
          ListFooterComponent={() => (
            <TouchableOpacity
              onPress={onSeeListPress}
              style={styles.seeMoreView}>
              <Text style={styles.seeMoreText}>See full portfolio</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
  },
  addButtonView: {
    marginHorizontal: wp(24),
    height: hp(50),
    borderRadius: 15,
    backgroundColor: '#F8FAFE',
    marginTop: hp(13),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  addFundTextStyle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    fontWeight: '500',
    color: colors.primaryBlue,
  },
  addIconStyle: {
    height: hp(18),
    width: wp(18),
    tintColor: colors.primaryBlue,
    marginLeft: wp(4),
  },
  balanceAllocationView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(35),
  },
  balanceAllocationText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.activeBlack,
    marginLeft: wp(24),
  },
  switchLEftText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: fonts.medium,
    color: colors.darkest,
  },
  switchView: {
    width: wp(36),
    height: hp(20),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D3D5DA',
    marginHorizontal: wp(6),
    justifyContent: 'center',
    paddingHorizontal: wp(2),
  },
  switchstyle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: colors.primaryBlue,
  },
  portfoliomainView: {
    marginHorizontal: wp(24),
    borderWidth: 2,
    borderColor: colors.borderColor,
    borderRadius: 16,
    marginTop: hp(18),
    flex: 1,
    marginBottom: hp(8),
  },
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
    textAlign: 'right',
  },
  fundItemContainer: {
    borderWidth: 1,
    height: hp(64),
    borderRadius: 12,
    backgroundColor: '#F8FAFE',
    borderColor: colors.borderColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp(8),
    alignItems: 'center',
    marginTop: hp(8),
  },
  leftView: {
    flexDirection: 'row',
    marginLeft: wp(22),
    alignItems: 'center',
    flex: 1,
  },
  iconStyle: { width: 24, height: 24, marginRight: 8 },
  coinName: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.darkBlack,
    fontWeight: '500',
    width: wp(215),
  },
  rightIconView: {
    marginRight: wp(10),
    height: 20,
    width: 60,
    justifyContent: 'center',
  },
  iconContainer: {
    width: hp(26),
    height: hp(26),
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
  seeMoreView: {
    height: hp(50),
    borderRadius: 15,
    backgroundColor: '#F8FAFE',
    marginHorizontal: wp(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  seeMoreText: {
    fontSize: 14,
    color: colors.primaryBlue,
    fontFamily: fonts.regular,
    fontWeight: '500',
  },
});

//make this component available to the app
export default Portfolio;
