//import liraries
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Share from 'react-native-share';
import Clipboard from '@react-native-clipboard/clipboard';

import {
  DropDownSheet,
  MainHeader,
  QRCodeGenerate,
} from '../../../components';
import { colors } from '../../../helper/colorConstants';
import { getLocalText } from '../../../helper/globalFunctions';
import { icons } from '../../../helper/iconConstant';
import { hp } from '../../../helper/utils';
import { useSelector } from 'react-redux';
import { styles } from './styles';
import { useRoute } from '@react-navigation/native';
import CustomImage from '../../../components/Common/Image';
import { env } from '../../../utils/consts';

// create a component
const ReceiveToken = () => {

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [sheetAciveIndex, setSheetActiveIndex] = useState(0);

  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedChain, setSelectedChain] = useState('');

  const walletData = useSelector(st => st.wallet);
  const { allChains } = useSelector(st => st.chain);
  const { mainnet_provider_urls, test_net_providers } = useSelector(st => st.app);
  const provider_url = env === 'DEV' ? test_net_providers : mainnet_provider_urls;

  const route = useRoute();

  const refRBSheet = useRef();

  const onAssetPress = () => {
    setSheetActiveIndex(3);
    refRBSheet?.current?.open();
  };

  const onChainAssetPress = () => {
    setSheetActiveIndex(4);
    refRBSheet?.current?.open();
  };

  useEffect(() => {
    console.log('wallet Data');
    console.log(allChains);
    console.log(walletData);
  }, [walletData, allChains]);


  useEffect(() => {
    console.log(walletData.balancePerCoin);
    if (walletData.balancePerCoin) {
      if (route.params?.contract_address && route.params?.symbol && route.params?.chain_id) {
        let chain, token;
        for (let i = 0; i < walletData.balancePerCoin.length; i++) {
          let e = walletData.balancePerCoin[i];
          if (e.symbol === route.params?.symbol) {
            chain = e.chains.find(c => (c.contract_address === route.params?.contract_address && c.chain_id === route.params?.chain_id));
            token = e;
            if (chain && token) {
              setSelectedAsset(token);
              setSelectedChain(chain);
              return;
            }
          }
        }
      }
      let first = walletData.balancePerCoin.find(e => Array.isArray(e.chains) && e.chains.length > 0);
      setSelectedAsset(first);
      setSelectedChain(first?.chains[0]);
    }
  }, [walletData, route.params]);

  return (
    <View style={styles.container}>
      <MainHeader title={getLocalText('Receive Tokens')} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardDismissMode={'interactive'}>
        <View
          style={[
            styles.topCoinDropView,
            {marginTop: isKeyboardOpen ? hp(8) : hp(105)},
          ]}>
          <TouchableOpacity
            onPress={onAssetPress}
            style={styles.dropbtnContainer}>
            <CustomImage
              uri={selectedAsset?.logo_url}
              style={styles.dropbtnIcon}
            />
            <Text style={styles.dropBtnName}>{selectedAsset?.name}</Text>
            <Image
              source={icons.downIndicator}
              style={styles.dropBtnRightIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onChainAssetPress}
            style={[styles.dropbtnContainer, {marginLeft: 8}]}>
            <Image
              source={{
                uri:
                  provider_url && selectedChain?.chain_id
                    ? provider_url[selectedChain?.chain_id]?.image_url
                    : undefined,
              }}
              style={styles.dropbtnIcon}
            />
            <Text style={styles.dropBtnName}>{selectedChain?.chain_name}</Text>
            <Image
              source={icons.downIndicator}
              style={styles.dropBtnRightIcon}
            />
          </TouchableOpacity>
        </View>
        <>
          <View style={styles.qrCodeView}>
            <QRCodeGenerate value={walletData.address} size={280} />
          </View>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 12,
              color: colors.textGrayColor,
              marginTop: hp(20),
            }}>
            {walletData.address}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              marginTop: hp(20),
              marginBottom: hp(30),
            }}>
            <View style={{alignItems: 'center'}}>
              <Pressable
                style={styles.walletBtnContainer}
                onPress={() => {
                  Clipboard.setString(walletData.address);
                  // Toast.show({
                  //   type: 'info',
                  //   text1: 'Copied!!'
                  // });
                  ToastAndroid.show('Copied!!', ToastAndroid.SHORT);
                }}>
                <Image
                  style={{width: hp(24), height: hp(24)}}
                  source={icons.fi_copy}
                />
              </Pressable>
              <Text style={styles.btnTitle}>{getLocalText('Copy')}</Text>
            </View>
            <View style={{alignItems: 'center', marginLeft: 40}}>
              <Pressable
                style={styles.walletBtnContainer}
                onPress={async () => {
                  await Share.open({
                    message: walletData.address,
                  });
                }}>
                <Image
                  style={{width: 24, height: 24}}
                  source={icons.fi_share}
                />
              </Pressable>
              <Text style={styles.btnTitle}>{getLocalText('Share')}</Text>
            </View>
          </View>
        </>
        <View style={styles.alertView}>
          <Image source={icons.info} style={styles.alertIconstyle} />
          <Text style={styles.alertText}>{getLocalText('tokenAlertSend')}</Text>
        </View>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            container: {
              borderTopRightRadius: 32,
              borderTopLeftRadius: 32,
              height: 'auto',
              maxHeight: Dimensions.get('screen').height * 0.7,
            },
            wrapper: {
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
            draggableIcon: {
              backgroundColor: '#EDF0F8',
            },
          }}>
          <DropDownSheet
            onItemPress={res =>
              sheetAciveIndex === 3
                ? setSelectedAsset(res)
                : setSelectedChain(res)
            }
            sheetRef={refRBSheet}
            isAsset={sheetAciveIndex === 3 ? true : false}
            selectedAsset={selectedAsset}
            setSelectedAsset={setSelectedAsset}
            setSelectedChain={setSelectedChain}
            selectedChain={selectedChain}
          />
        </RBSheet>
      </ScrollView>
    </View>
  );
};

//make this component available to the app
export default ReceiveToken;
