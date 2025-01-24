//import liraries
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { CoinItems, DetailedHeader, PrimaryButton } from '../../../components';
import { getLocalText } from '../../../helper/globalFunctions';
import { icons } from '../../../helper/iconConstant';
import { isIos } from '../../../helper/utils';
import { navigate } from '../../../helper/rootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setBalanceVisible } from '../../../redux/action/app';
import { EmptyWallet } from '../../../helper/svgconstant';

const Wallet = () => {
  const walletData = useSelector(st => st.wallet);
  const [isExpanded, setIsExpanded] = useState(-1);
  const { balanceVisible } = useSelector(st => st.app);
  const amount = walletData.totalIdleDollarBalance;
  const dispatch = useDispatch();

  const getDecimal = val => {
    return parseInt(val?.toString()?.split('.')?.[0])?.toLocaleString();
  };

  const getFraction = val => {
    return val?.toString()?.split('.')?.[1];
  };

  const onSendPress = () => {
    navigate('SendToken');
  };

  const onRecievePress = () => {
    navigate('ReceiveToken');
  };

  const buttonData = [
    {
      icons: icons.upArrow,
      onPress: onSendPress,
      title: 'Send',
    },
    {
      icons: icons.downArrow,
      onPress: onRecievePress,
      title: 'Recieve',
    },
    {
      icons: icons.dollarPlus,
      onPress: () => {
        navigate('BuyCrypto');
      },
      title: 'Buy',
    },
    {
      icons: icons.swapLarge,
      onPress: () => {
        navigate('SwapScreen');
      },
      title: 'Swap',
    },
  ];

  const onRightIconPress = index => {
    index === isExpanded ? setIsExpanded(-1) : setIsExpanded(index);
  };

  const onAddTokenPress = () => {
    navigate('TokenDetails');
  };

  useEffect(() => {
    async function init() {
      const show_balance = await AsyncStorage.getItem('show_balance');
      console.log(show_balance);
      dispatch(
        setBalanceVisible(show_balance === '1' || show_balance === null),
      );
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggle() {
    dispatch(setBalanceVisible(!balanceVisible));
    if (!balanceVisible) {
      await AsyncStorage.setItem('show_balance', '1');
    } else {
      await AsyncStorage.setItem('show_balance', '0');
    }
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      bounces={false}>
      <DetailedHeader />
      <View style={styles.totalBalanceView}>
        <Text style={styles.totalBalanceText}>
          {getLocalText('Total Balance')}
        </Text>
        <Pressable onPress={toggle}>
          <Image source={!balanceVisible ? icons.eye : icons.eyeClosed} style={styles.eyeStyle} />
        </Pressable>
      </View>
      <Text style={styles.mainAmountText}>
        {balanceVisible ? (
          <>
            ${getDecimal(amount)}.
            <Text style={styles.pointamountStyle}>
              {amount > 0 ? getFraction(amount) : '00'}
            </Text>
          </>
        ) : (
          '****'
        )}
      </Text>
      <View style={styles.headerBtnView}>
        {buttonData?.map((i, index) => {
          return (
            <TouchableOpacity
              onPress={i.onPress}
              key={index?.toString()}
              style={{ alignItems: 'center' }}>
              <View style={styles.walletBtnContainer}>
                <Image style={{ width: 24, height: 24 }} source={i?.icons} />
              </View>
              <Text style={styles.btnTitle}>{i?.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={{ marginTop: isIos ? 12 : 12, paddingBottom: 20 }}>
        {walletData?.balancePerCoin?.length > 0 ? (
          walletData.balancePerCoin?.sort((a, b) => b.total_quote_balance - a.total_quote_balance).map((item, index) => {
            return (
              <CoinItems
                key={index?.toString()}
                onRightIconPress={() => { if (item?.chains?.length > 0) { onRightIconPress(index); } }}
                coinIcon={item?.logo_url}
                coinName={item?.name}
                coinMainAmount={item?.total_balance}
                coinSubAmount={item?.total_quote_balance}
                isExpanded={index === isExpanded}
                coinUnit={item?.symbol}
                coinDetailData={item?.chains || []}
              />
            );
          })
        ) : (
          <View style={{ alignItems: 'center', paddingTop: 25 }}>
            <EmptyWallet />
            <Text style={styles.emptyWalletTitle}>
              Add crypto to get started
            </Text>
            <Text style={styles.emptyWalletDesc}>
              You can add funds to your wallet to get started with your crypto
              journey
            </Text>
            <PrimaryButton
              title={'Add crypto'}
              onPress={() => { }}
              containerStyle={{ marginTop: 35, marginBottom: 23 }}
            />
          </View>
        )}
      </View>

      {/* <TouchableOpacity onPress={() => { }} style={styles.addTokenView}>
        <Image style={styles.addTokenIcon} source={icons.addCircle} />
        <Text style={styles.addTokenText}>{getLocalText('Add Token')}</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
};

// define your styles

//make this component available to the app
export default Wallet;
