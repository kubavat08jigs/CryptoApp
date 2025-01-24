//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {PrimaryButton} from '../../components';
import {colors} from '../../helper/colorConstants';
import {fonts} from '../../helper/fontconstant';
import {getLocalText} from '../../helper/globalFunctions';

// create a component
const RemoveTokenBottomSheet = ({
  currentItem,
  onCancelPress,
  onRemovePress,
}) => {
  console.log('currentItem', currentItem);
  return (
    <View style={{marginTop: 15, paddingBottom: 35}}>
      <Text style={styles.sheetTitle}>Remove Token</Text>
      <View style={{marginHorizontal: 24, marginTop: 52}}>
        <View style={[styles.detailItem, {marginTop: 0}]}>
          <Text style={styles.detailItemTitle}>Token</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={{
                uri: currentItem?.imageUrl,
              }}
              style={{width: 20, height: 20, marginRight: 6}}
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: colors.activeBlack,
              }}>
              {currentItem?.name}{' '}
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.regular,
                  color: colors.textGrayColor,
                }}>
                {currentItem?.symbol}
              </Text>
            </Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailItemTitle}>Chain</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={{uri: currentItem?.network_asset_info[0]?.imageUrl}}
              style={{width: 20, height: 20, marginRight: 6}}
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: colors.activeBlack,
              }}>
              {currentItem?.network_asset_info[0]?.name}
            </Text>
          </View>
        </View>
        {/* <View style={styles.detailItem}>
          <Text style={styles.detailItemTitle}>Amount</Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.bold,
              color: colors.activeBlack,
            }}>
            {currentItem?.coinMainAmount} ETH{' '}
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.regular,
                color: colors.textGrayColor,
              }}>
              ~${currentItem?.coinSubAmount}
            </Text>
          </Text>
        </View> */}
        {/* <View style={styles.detailItem}>
          <Text style={styles.detailItemTitle}>Added on</Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.regular,
              color: colors.textGrayColor,
            }}>
            02/02/2023
          </Text>
        </View> */}
        <View
          style={{
            marginTop: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <PrimaryButton
            containerStyle={{
              width: 150,
              marginBottom: 0,
              backgroundColor: '#EDF0F8',
            }}
            titleStyle={{color: colors.darkest}}
            title={getLocalText('Cancel')}
            onPress={onCancelPress}
          />
          <PrimaryButton
            containerStyle={{
              backgroundColor: colors.errorBg,
              width: 150,
              marginBottom: 0,
            }}
            title={getLocalText('Remove')}
            titleStyle={{
              color: colors.errorText,
            }}
            onPress={onRemovePress}
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
export default RemoveTokenBottomSheet;
