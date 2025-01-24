//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { getLocalText } from '../../helper/globalFunctions';
import { icons } from '../../helper/iconConstant';
import { env } from '../../utils/consts';
import CustomImage from '../Common/Image';
import PrimaryButton from '../Common/PrimaryButton';

// create a component

const ApproveTransaction = ({ onApprovePress, onRejectPress, selectedAsset, selectedChain, address, amount, loading, gas, gasSymbol }) => {

  const { mainnet_provider_urls, test_net_providers } = useSelector(st => st.app);
  const provider_url = env === 'DEV' ? test_net_providers : mainnet_provider_urls;

  console.log(selectedAsset);

  return (
    <View style={{ marginTop: 15, paddingBottom: 35 }}>
      <Text style={styles.sheetTitle}>
        {getLocalText('Approve Transaction')}
      </Text>
      <View style={{ marginHorizontal: 24, marginTop: 52 }}>
        <View style={[styles.detailItem, { marginTop: 0 }]}>
          <Text style={styles.detailItemTitle}>Token</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CustomImage uri={selectedAsset?.logo_url} style={{ width: 20, height: 20, marginRight: 6 }} />
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: colors.activeBlack,
              }}>
              {selectedAsset?.name}
            </Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailItemTitle}>Chain</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={{ uri: provider_url && selectedChain?.chain_id ? provider_url[selectedChain?.chain_id]?.image_url : '' }}
              style={{ width: 20, height: 20, marginRight: 6 }}
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: colors.activeBlack,
              }}>
              {selectedChain?.chain_name}
            </Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailItemTitle}>Receiver Address</Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.bold,
              color: colors.activeBlack,
            }}>
            {address.substring(0, 4)}...{address.substring(address.length - 5)}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailItemTitle}>Amount</Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.bold,
              color: colors.activeBlack,
            }}>
            {amount} {selectedAsset.symbol}
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.regular,
                color: colors.textGrayColor
              }}>
              {` ~$${parseFloat(amount * selectedChain.quote_rate).toFixed(2)}`}
            </Text>
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailItemTitle}>Gas Fee</Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.regular,
              color: colors.textGrayColor,
            }}>
            ~{parseFloat(gas).toFixed(5)} {gasSymbol}
          </Text>
        </View>
        <View
          style={{
            marginTop: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <PrimaryButton
            containerStyle={{
              backgroundColor: colors.errorBg,
              width: 167,
              marginBottom: 0,
              marginRight: 5
            }}
            title={getLocalText('Reject')}
            titleStyle={{
              color: colors.errorText,
            }}
            onPress={onRejectPress}
            disable={loading}
          />
          <PrimaryButton
            containerStyle={{
              width: 167,
              marginBottom: 0,
              marginLeft: 5
            }}
            title={getLocalText('Approve')}
            onPress={onApprovePress}
            isLoader={loading}
            disable={amount === 0 || address?.length === 0}
          />
        </View>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  sheetTitle: {
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.activeBlack,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    marginTop: 18,
  },
  detailItemTitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textGrayColor,
  },
});

//make this component available to the app
export default ApproveTransaction;
