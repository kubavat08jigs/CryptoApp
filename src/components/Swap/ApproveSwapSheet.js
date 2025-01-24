//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { getLocalText } from '../../helper/globalFunctions';
import { formatNumber, getDecimals } from '../../utils/consts';
import PrimaryButton from '../Common/PrimaryButton';

// create a component

const ApproveSwapSheet = ({ onApprovePress, onRejectPress, quote, asset1, asset2, loading }) => {
  return (
    <View style={{ marginTop: 15, paddingBottom: 35 }}>
      <Text style={styles.sheetTitle}>
        {getLocalText('Approve Transaction')}
      </Text>
      <View style={{ marginHorizontal: 24, marginTop: 52 }}>
        <View style={styles.detailItem}>
          <Text style={styles.detailItemTitle}>Swap</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={styles.valueAmount}>
              {formatNumber(quote?.fromAmount || 0, getDecimals(asset1.priceUSD))}
            </Text>
            <Text
              style={styles.amountUnit}>
              {' '}
              {asset1.symbol}{' '}
            </Text>
            <Text
              style={styles.amountEquivalent}>
              ~${quote?.fromAmountUSD}
            </Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailItemTitle}>Receive</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={styles.valueAmount}>
              {formatNumber(quote?.toAmount, getDecimals(asset2.priceUSD))}
            </Text>
            <Text
              style={styles.amountUnit}>
              {' '}
              {asset2.symbol}{' '}
            </Text>
            <Text
              style={styles.amountEquivalent}>
              ~${quote?.toAmountUSD}
            </Text>
          </View>
        </View>
        <View
          style={styles.buttonView}>
          <PrimaryButton
            containerStyle={styles.rejectBtnContainer}
            title={getLocalText('Reject')}
            titleStyle={{
              color: colors.errorText,
            }}
            onPress={onRejectPress}
            disable={loading}
          />
          <PrimaryButton
            containerStyle={styles.approveBtnContainer}
            title={getLocalText('Approve')}
            onPress={onApprovePress}
            isLoader={loading}
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
    fontFamily: fonts.medium,
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
  valueAmount : {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.activeBlack,
  },
  amountUnit : {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.activeBlack,
  },
  amountEquivalent : {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textGrayColor,
  },
  buttonView : {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rejectBtnContainer : {
    backgroundColor: colors.errorBg,
    width: 167,
    marginBottom: 0,
    marginRight: 5,
  },
  approveBtnContainer : {
    width: 167,
    marginBottom: 0,
    marginLeft: 5,
  }
});

//make this component available to the app
export default ApproveSwapSheet;
