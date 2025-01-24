//import liraries
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { icons } from '../../helper/iconConstant';
import { navigate } from '../../helper/rootNavigation';
import { wp, hp, fontSize } from '../../helper/utils';
import CustomImage from '../Common/Image';
import CoinDetailsItem from './CoinDetailsItem';

// create a component
const CoinItems = ({
  isExpanded,
  onRightIconPress,
  coinName,
  coinIcon,
  coinUnit,
  coinMainAmount,
  coinSubAmount,
  coinDetailData,
}) => {
  const renderEmptySubComponent = () => (
    <Text style={{ alignSelf: 'center', marginVertical: 5 }}>No Data</Text>
  );

  return (
    <View
      style={{
        borderColor: colors.borderColor,
        borderWidth: isExpanded ? 1 : 0,
        marginTop: hp(12),
        marginHorizontal: wp(25),
        borderRadius: 12,
      }}
    >
      <TouchableOpacity onPress={onRightIconPress} style={[styles.walletItemContainer, { borderWidth: isExpanded ? 0 : 1 }]}>
        <View style={styles.leftView}>
          <CustomImage style={styles.iconStyle} uri={coinIcon} />
          <Text style={styles.coinName}>{coinName}</Text>
        </View>
        <View style={styles.rightView}>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.coinAmountText}>
              {coinMainAmount > 1
                ? coinMainAmount?.toLocaleString()
                : coinMainAmount}{' '}
              {coinUnit}
            </Text>
            <Text style={styles.coinInDollar}>
              ~${coinSubAmount?.toFixed(2).toLocaleString()}
            </Text>
          </View>
          <View style={styles.downIconView}>
            <Image
              style={{ width: 12, height: 6.5, transform: isExpanded ? [{ rotate: "180deg" }] : [] }}
              source={icons.downIndicator}
            />
          </View>
        </View>
      </TouchableOpacity>
      {isExpanded && (
        // <FlatList
        //   data={coinDetailData || []}
        //   bounces={false}
        //   renderItem={({item}) => (
        //     <CoinDetailsItem
        //       onRifhtIconPress={() => {

        //       }}
        //       coinSubName={item?.coinSubName}
        //       coinAmount={`${item?.coinMainAmount?.toLocaleString()} ${coinUnit}`}
        //       coinSubAmount={`~$${item?.coinSubAmount?.toLocaleString()}`}
        //       isRightIconVisible
        //     />
        //   )}
        //   ItemSeparatorComponent={<View style={styles.saperatorComponent} />}
        //   ListEmptyComponent={renderEmptySubComponent}
        // />
        <ScrollView>
          {coinDetailData?.length
            ? coinDetailData?.map((item, index) => {
              return (
                <View key={index?.toString()}>
                  <CoinDetailsItem
                    onRightIconPress={() => {
                      let data = {
                        coinName: coinName,
                        chainName: item?.coinSubName,
                        amount: item?.coinMainAmount,
                        coinUnit: coinUnit,
                        subAmount: item?.coinSubAmount,
                        detailData: item,
                        chainId: item.chain_id,
                        contract_address: item.contract_address,
                        native_token: item.native_token,
                      };
                      navigate('TokenDetails', { data: data });
                    }}
                    coinSubName={item?.chain_name}
                    coinAmount={`${item?.balance?.toLocaleString()} ${coinUnit}`}
                    coinSubAmount={`~$${item?.quote?.toFixed(2).toLocaleString()}`}
                    isRightIconVisible
                  />
                  {index + 1 !== item?.length && (
                    <View style={styles.saperatorComponent} />
                  )}
                </View>
              );
            })
            : renderEmptySubComponent()}
        </ScrollView>
      )}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  walletItemContainer: {
    borderWidth: 1,
    height: hp(64),
    borderRadius: 12,
    backgroundColor: '#F8FAFE',
    borderColor: colors.borderColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftView: {
    flexDirection: 'row',
    marginLeft: wp(22),
    alignItems: 'center',
  },
  iconStyle: { width: 24, height: 24, marginRight: 8 },
  coinName: {
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
  rightView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downIconView: {
    marginRight: wp(25),
    marginLeft: wp(20),
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saperatorComponent: {
    width: 280,
    height: 1,
    backgroundColor: colors.borderColor,
    alignSelf: 'center',
  },
});

//make this component available to the app
export default CoinItems;
