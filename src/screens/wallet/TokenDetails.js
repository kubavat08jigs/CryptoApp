//import liraries
import React, { Component, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { CoinDetailsItem, MainHeader } from '../../components';
import CustomImage from '../../components/Common/Image';
import Loader from '../../components/Loader';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { icons } from '../../helper/iconConstant';
import { navigate } from '../../helper/rootNavigation';
import { NoTransaction } from '../../helper/svgconstant';
import { hp, wp } from '../../helper/utils';
import { baseUrl2, env } from '../../utils/consts';
import useFetch from '../../utils/_fetch';
import { TransactionItem } from '../dashboard/TransactionHistory/transactionItem';
import blockchain from '../../utils/blockchain';

const limit = 15;

const renderChainItem = ({ item }) => {
  return (
    <TransactionItem
      item={item}
      isLeftIocn
      isLeftCoinIcon={item.logo_url}
      isAmountViewVisible={item?.amount}
      isRightIcon
      isChangeAmountText
    />
  );
};

// create a component
const TokenDetails = ({ route }) => {

  const { data } = route?.params;
  const { mainnet_provider_urls, test_net_providers } = useSelector(st => st.app);
  const [loadingTX, setLoadingTX] = useState(false);
  const [TXData, setTXData] = useState([]);
  const [page, setPage] = useState(1);
  const total = useRef(0);
  const _fetch = useFetch();

  const provider_url = env === 'DEV' ? test_net_providers : mainnet_provider_urls;

  console.log(data);

  async function getTX() {
    try {
      console.log('------------in getdata---------------');
      setLoadingTX(true);

      let query = `limit=${limit}&page=${page}`;

      if (data.chainId) {
        query += `&chain-id=${data.chainId}`;
      }
      if (data.contract_address) {
        query += `&contract-address=${blockchain.getFormatedAddress(data.contract_address)}`;
      }

      console.log(query);
      let res = await _fetch(`${baseUrl2}/getWalletTransactions?${query}`);
      res = await res.json();
      // console.log(res.payload);
      if (res.status === 200) {
        console.log(res);
        total.current = res.total;
        setTXData([...TXData, ...res.payload]);
      }
    } catch (e) { console.log(e); } finally { setLoadingTX(false) }
  }

  useEffect(() => {
    getTX();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const { contract_name, balance, quote, chain_name, contract_ticker_symbol, chain_id, contract_address, native_token } = data.detailData;
  //log all details data
  console.log('native_token00000000000000000000000000000->',native_token);

  const buttonData = [
    {
      icons: icons.upArrow,
      onPress: () => {
        console.log({
          contract_address,
          chain_id: chain_id,
          symbol: contract_ticker_symbol,
        });
        navigate('SendToken', {
          contract_address,
          chain_id: chain_id,
          symbol: contract_ticker_symbol,
        });
      },
      title: 'Send',
    },
    {
      icons: icons.downArrow,
      onPress: () => {
        navigate('ReceiveToken', {
          contract_address,
          chain_id: chain_id,
          symbol: contract_ticker_symbol,
        });
      },
      title: 'Receive',
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
        navigate('SwapScreen', {
          contract_address,
          chain_id: chain_id,
          symbol: contract_ticker_symbol,
          native_token:native_token,
        });
      },
      title: 'Swap',
    },
  ];

  return (
    <View style={styles.container}>
      <MainHeader containerStyle={{ marginBottom: 0 }} />
      <View style={styles.CoinDetailView}>
        <CustomImage uri={provider_url && chain_id ? provider_url[chain_id]?.image_url : ''} style={styles.coinIcon} />
        <Text style={styles.coinNameStyle}>{contract_name}</Text>
        <Text style={styles.coinSubName}>{chain_name}</Text>
      </View>
      <Text style={styles.coinAmount}>
        {balance}{' '}
        <Text style={[styles.coinAmount, { fontWeight: '700' }]}>{contract_ticker_symbol}</Text>
      </Text>
      <Text style={styles.coinToDollar}>{`~$${quote.toFixed(2)}`}</Text>
      <View style={styles.headerBtnView}>
        {buttonData?.map((i, index) => {
          return (
            <TouchableOpacity
              key={index?.toString()}
              style={{ alignItems: 'center' }}
              onPress={i.onPress}
            >
              <View style={styles.walletBtnContainer}>
                <Image style={{ width: 24, height: 24 }} source={i?.icons} />
              </View>
              <Text style={styles.btnTitle}>{i?.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {
        loadingTX ? <Loader size={75} height="60%" /> :
          TXData.length ?
            <FlatList
              data={TXData}
              extraData={TXData}
              renderItem={renderChainItem}
              contentContainerStyle={{ paddingVertical: 10 }}
              keyExtractor={(item, index) => index?.toString()}
              onEndReached={async () => {
                if ((page + 1) * limit < total.current) {
                  setPage(page + 1);
                }
              }}
            />
            :
            <View style={styles.emptyStateView}>
              <NoTransaction width={200} />
              <Text style={styles.emptyStateTitle}>No Transactions Yet</Text>
            </View>
      }
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
  },
  CoinDetailView: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  coinIcon: {
    height: 40,
    width: 40,
    marginVertical: hp(4.25),
    padding: 5,
  },
  coinNameStyle: {
    fontSize: 20,
    fontFamily: fonts.bold,
  },
  coinSubName: {
    fontSize: 14,
    fontFamily: fonts.regular,
    fontWeight: '500',
  },
  coinAmount: {
    fontSize: 40,
    fontFamily: fonts.regular,
    alignSelf: 'center',
    marginTop: hp(26),
    color: colors.activeBlack,
  },
  coinToDollar: {
    fontSize: 14,
    marginTop: hp(4),
    fontWeight: '400',
    alignSelf: 'center',
    fontFamily: fonts.regular,
    color: colors.textGrayColor,
  },
  headerBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp(43),
    marginBottom: hp(20)
  },
  walletBtnContainer: {
    width: hp(48),
    height: hp(48),
    borderRadius: hp(24),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
  },
  btnTitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    marginTop: hp(6),
    color: colors.darkBlack,
  },
  saperatorComponent: {
    width: 280,
    height: 1,
    backgroundColor: colors.borderColor,
    alignSelf: 'center',
  },
  emptyStateView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    color: colors.darkBlack,
    fontFamily: fonts.regular,
    fontWeight: '600',
    // marginTop: 5,
  },
});

//make this component available to the app
export default TokenDetails;
