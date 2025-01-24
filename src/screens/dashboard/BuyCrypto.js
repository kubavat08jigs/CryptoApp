//import liraries
import CheckBox from '@react-native-community/checkbox';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Dimensions,
  Modal,
  Linking,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSelector } from 'react-redux';

import { FundBalanceItem, MainHeader } from '../../components';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { icons } from '../../helper/iconConstant';
import { navigate } from '../../helper/rootNavigation';
import { hp, wp } from '../../helper/utils';

// create a component
const BuyCrypto = () => {
  const [visible, setVisible] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const { address } = useSelector(st => st.user);
  const refRBSheet = useRef();

  function closeModal() {
    refRBSheet.current?.close();
    setVisible(null);
  }

  const renderItem = ({ item }) => (
    <FundBalanceItem
      title={item?.title}
      iconsrc={item?.icon}
      onPress={() => {
        setVisible(item);
        refRBSheet.current?.open();
      }}
      isIconBG
    />
  );

  function getChainId(net) {
    switch (net) {
      case 'ETHEREUM':
        return 'erc20';
      case 'POLYGON':
        return 'matic20';
      default:
        return 'matic20';
    }
  }

  const providerList = [
    {
      title: 'TRANSAK',
      name: 'Transak',
      icon: icons.transakSquareBlue,
      pageUrl: 'onramp_webview',
      terms_link: 'https://transak.com/terms-of-service',
      onPress: async () => {
        navigate('BuyFromTransak');
        setAccepted(false);
        closeModal();
      },
    },
    // {
    //   title: 'OnRamp',
    //   icon: icons.onramp,
    //   pageUrl: 'onramp_webview',
    //   terms_link: 'https://onramp.money/terms-and-conditions/',
    //   onPress: async () => {
    //     // const isAvailable = await InAppBrowser.isAvailable();
    //     //console.log(isAvailable);
    //     // const url = `https://onramp.money/app/?appId=247512&walletAddress=${address}&network=erc20`;
    //     // Linking.openURL(url);
    //     navigate('BuyFromOnRamp');
    //     setAccepted(false);
    //     closeModal();
    //   },
    // },
  ];

  return (
    <View style={styles.container}>
      <MainHeader title={'Buy using Fiat'} />
      <FlatList
        // ListHeaderComponent={
        //   <Text style={styles.listHeaderText}>Maximum Coins</Text>
        // }
        style={{ marginTop: hp(41) }}
        data={providerList}
        renderItem={renderItem}
      />

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 'auto',
          },

          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: '#EDF0F8',
          },
        }}>
        <View
          style={{ padding: 25, backgroundColor: '#ffffff' }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              alignItems: 'center',
              color: colors.textGrayColor,
              marginBottom: 20
            }}>
            Disclaimer
          </Text>
          <Text style={{ color: colors.textGrayColor }}>
            {`You will be taken to ${visible?.name}. Services relating to payments are provided by ${visible?.name}, which is a separate platform owned by a third party, please read and agree to ${visible?.name} Terms of Service before using their service. Dolf Finance does not assume any responsibility for any loss or damage caused by the use of this payment service.`}
          </Text>

          <View
            style={{
              marginVertical: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CheckBox
              tintColors={{
                true: colors.primaryBlue,
                false: colors.lightgrey,
              }}
              value={accepted}
              onValueChange={val => setAccepted(val)}
            />
            <Text style={{ marginLeft: 10, color: colors.textGrayColor }}>
              I have read and agree to the{' '}
              <Text
                style={{ color: colors.primaryBlue }}
                onPress={() => Linking.openURL(visible.terms_link)}>
                Terms of Service
              </Text>
            </Text>
          </View>
          <Pressable
            title="Continue"
            onPress={!accepted ? null : visible.onPress}
            style={{
              backgroundColor: colors.primaryBlue,
              paddingHorizontal: 10,
              paddingVertical: 20,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 12
            }}>
            <Text style={{ color: '#fff' }}>Continue</Text>
          </Pressable>
        </View>
      </RBSheet>

    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
  },
  listHeaderText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    fontWeight: '700',
    marginLeft: wp(27),
    marginBottom: hp(8),
    color: colors.activeBlack,
  },
});

//make this component available to the app
export default BuyCrypto;
