import { ethers } from 'ethers';
import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	Pressable,
	Linking
} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { useSelector } from 'react-redux';
import { CText } from '../../../components';
import CustomImage from '../../../components/Common/Image';
import { colors } from '../../../helper/colorConstants';
import { icons } from '../../../helper/iconConstant';
import { inAppBrowserConfig, transactionType } from '../../../utils/consts';
import { styles } from './TransactionsStyles';
import moment from 'moment/moment';

export const TransactionItem = ({
	item,
	isLeftIocn,
	isRightIcon,
	isLeftCoinIcon,
	isRadioButtonView,
	isAmountViewVisible,
	onPress,
	isChangeAmountText,
	selectedSort,
}) => {
	const deposit = item.tx_hash === transactionType.incomingTransaction;
	const amount = Number(ethers.utils.formatUnits(item.amount, item.decimal));
	const amountUSD = amount * (item.price || 0);

	return (
    <TouchableOpacity
      onPress={async () => {
        const url = `${item.explorer_link}/${item.tx_hash}`;
        if (await InAppBrowser?.isAvailable()) {
          InAppBrowser.open(url, inAppBrowserConfig).then(response => {
            // console.log(response)
          });
        } else Linking.openURL(url);
      }}
      style={[
        styles.chainItemContainer,
        {
          backgroundColor: isRadioButtonView ? colors.primaryWhite : '#F8FAFE',
        },
      ]}>
      <View style={[styles.leftView, {marginLeft: 12}]}>
        {isLeftIocn && (
          <Image
            style={{height: 16, width: 16}}
            source={deposit ? icons.bigArrorDown : icons.bigArrorUp}
          />
        )}
        {isLeftCoinIcon && (
          <CustomImage
            uri={isLeftCoinIcon}
            style={{height: 24, width: 24, marginLeft: 21, marginRight: 8}}
          />
        )}
        <View>
          <CText txt={item?.name} m />
          <Text style={styles.coinInDollar}>
            {moment(item?.tx_date).format('MMM DD YYYY, h:mm a')}
          </Text>
        </View>
      </View>
      <View style={styles.itemRightView}>
        {isAmountViewVisible && (
          <>
            {isChangeAmountText ? (
              <View style={{alignItems: 'flex-end'}}>
                <View style={styles.upDownnView}>
                  <CText
                    txt={`${deposit ? '+' : '-'}${amount}`}
                    m
                    s={deposit}
                    e={!deposit}
                    fontSize={14}
                  />
                </View>
                <CText
                  txt={`$${amountUSD.toFixed(2)}`}
                  m
                  textStyle={styles.usdCoinStyle}
                />
              </View>
            ) : (
              <View style={{alignItems: 'flex-end'}}>
                <Text style={styles.coinAmountText}>
                  {item?.coinMainAmount > 1
                    ? item?.coinMainAmount?.toLocaleString()
                    : item?.coinMainAmount}{' '}
                  {item?.unit}
                </Text>
                <Text style={styles.coinInDollar}>
                  ~${item.coinSubAmount?.toLocaleString()}
                </Text>
              </View>
            )}
            {isRightIcon && (
              <View style={styles.buybtnView}>
                <Image
                  source={icons.rightArrow}
                  style={{width: 6.5, height: 12}}
                />
              </View>
            )}
          </>
        )}
        {isRadioButtonView && (
          <TouchableOpacity>
            <View
              style={[
                styles.selectionView,
                {
                  borderColor:
                    selectedSort === item?.title
                      ? colors.primaryBlue
                      : '#DEE4F4',
                },
              ]}>
              {selectedSort === item?.title && (
                <View style={styles.activeRadio} />
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};
