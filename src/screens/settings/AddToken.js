//import liraries
import React, { Component, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ToastAndroid,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { useSelector } from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import { MainHeader, PrimaryButton, PrimaryTextInput } from '../../components';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { getLocalText } from '../../helper/globalFunctions';
import { icons } from '../../helper/iconConstant';
import { hp, wp } from '../../helper/utils';
import blockchain from '../../utils/blockchain';
import { _fetch } from '../../utils/_fetch';
import { goBack } from '../../helper/rootNavigation';
import { baseUrl2, env } from '../../utils/consts';

// create a component
const AddToken = () => {
  const app = useSelector(st => st.app);
  let { allChains } = useSelector(state => state.chain);
  const { jwtToken } = useSelector((state) => state.user);
  const [contactAddress, setContactAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState({});
  const [detailsFetched, setDetailsFetched] = useState(false);
  const [tokenDecimal, setTokenDecimal] = useState(0);
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [loading, setLoading] = useState(false);

  allChains = allChains?.filter(item => item?.activeStatus === true);

  const onChangeContactAdd = async (txt) => {
    if (detailsFetched) {
      setDetailsFetched(false);
    }
    setContactAddress(txt);
  };

  const handleTokenFetchException = (err) => {
    console.log('err', err);
    setTokenName('');
    setTokenSymbol('');
    setTokenDecimal(0);
    setDetailsFetched(false);
  };

  const fetchTokenDetails = async () => {
    try {
      setLoading(true);
      const providerURL = app[env === 'DEV' ? 'test_net_providers' : 'mainnet_provider_urls'][selectedChain.chainId]?.INFURA;
      const contract = await blockchain.getContractDetails(providerURL, contactAddress);
      setTokenName(contract?.name);
      setTokenSymbol(contract?.symbol);
      const decimal = parseInt(contract?.decimals);
      setTokenDecimal(decimal);
      setDetailsFetched(true);
    } catch (error) {
      handleTokenFetchException(error);
      ToastAndroid.show('Please check contract details', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const addToken = async () => {
    try {
      setLoading(true);
      let res = await _fetch(`${baseUrl2}/addCoinByUser`, {
        method: 'POST',
        body: {
          'name': tokenName,
          'symbol': tokenSymbol,
          'decimals': tokenDecimal,
          'contractAddress': contactAddress,
          'chainId': selectedChain.chainId,
        },
        token: jwtToken,
      });
      res = await res.json();
      if (res.status === 200) {
        ToastAndroid.show('Token added successfully', ToastAndroid.SHORT);
        goBack();
      } else {
        ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log('error', error);
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const refRBSheet = useRef();

  const onItemPress = val => {
    if (detailsFetched) {
      setDetailsFetched(false);
    }
    setSelectedChain(val);
    refRBSheet?.current?.close();
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => onItemPress(item)}
        style={[styles.walletItemContainer]}>
        <View style={styles.leftView}>
          <Image style={styles.iconStyle}

            source={{ uri: item?.imageUrl }}
          />
          <Text style={styles.coinName}>{item?.name}</Text>
        </View>
        <View style={styles.rightView}>
          <View
            style={[
              styles.selectionView,
              {
                borderColor:
                  Object.keys(selectedChain).length !== 0 && selectedChain?.chainId === item?.chainId
                    ? colors.primaryBlue
                    : '#DEE4F4',
              },
            ]}>
            {Object.keys(selectedChain).length !== 0 && selectedChain?.chainId === item?.chainId && (
              <View style={styles.activeRadio} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const chainBottomSheet = () => {
    return (
      <View style={{ marginTop: 15, paddingBottom: 40 }}>
        <Text style={styles.sheetTitle}>{getLocalText('Select Chain')}</Text>
        <FlatList
          style={{ alignSelf: 'center', marginTop: 16 }}
          data={allChains}
          renderItem={renderItem}
        />
      </View>
    );
  };

  const onDropdownPress = () => {
    refRBSheet?.current?.open();
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <MainHeader title={'Add Token'} />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <TouchableOpacity
          onPress={onDropdownPress}
          style={styles.dropdownItemView}>
          <View style={styles.leftIcon}>
            <Image
              source={
                Object.keys(selectedChain).length !== 0 ? { uri: selectedChain?.imageUrl } : null
              }
              style={{ height: 20, width: 20 }}
            />
            <Text style={styles.dropdownText}>{
              Object.keys(selectedChain).length !== 0 ? selectedChain?.name : 'Select Chain'
            }</Text>
          </View>
          <Image
            source={icons.downIndicator}
            style={{ height: 6.5, width: 11, marginRight: 10 }}
          />
        </TouchableOpacity>
        <PrimaryTextInput
          placeholder={'Enter Contract Address'}
          value={contactAddress}
          onChangeText={onChangeContactAdd}
          placeholderColor={colors.textGrayColor}
          containerStyle={{ marginTop: 5 }}
        />
      </View>
      {
        detailsFetched && (
          <View style={styles.tokenDetailView}>
            <Text style={styles.fetchingText}>Fetched Token Details</Text>
            <View style={styles.fetchDetail}>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.titleColor}>Name:</Text>
                <Text style={styles.valueText}>{tokenName}</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.titleColor}>Decimals</Text>
                <Text style={styles.valueText}>{tokenDecimal}</Text>
              </View>
            </View>
          </View>
        )
      }
      <PrimaryButton title={detailsFetched ? 'Add Token' : 'Fetch Token Details'} onPress={() => {
        if (!loading) {
          if (detailsFetched) {
            addToken();
          } else {
            fetchTokenDetails();
          }
        }
        Keyboard.dismiss();
      }}
        isLoader={loading}
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
        {chainBottomSheet()}
      </RBSheet>
    </KeyboardAvoidingView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
  },
  dropdownItemView: {
    marginHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    borderRadius: 43,
    justifyContent: 'space-between',
  },
  leftIcon: {
    flexDirection: 'row',
    paddingVertical: hp(13),
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: fonts.regular,
    marginLeft: 8,
    color: 'rgba(35,31,30,1)',
  },
  titleColor: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: fonts.regular,
    color: '#454545',
  },
  tokenDetailView: {
    backgroundColor: '#F8F9FA',
    marginHorizontal: 30,
    borderRadius: 8,
    marginBottom: 25,
  },
  fetchingText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.activeBlack,
    alignSelf: 'center',
    marginTop: 24,
  },
  fetchDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 21,
    marginBottom: 26,
  },
  valueText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: '#454545',
  },
  //
  walletItemContainer: {
    borderWidth: 1,
    height: hp(64),
    width: 342,
    borderRadius: 12,
    borderColor: colors.borderColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  leftView: {
    flexDirection: 'row',
    marginLeft: wp(22),
    alignItems: 'center',
  },
  iconStyle: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
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
  selectionView: {
    height: 20,
    width: 20,
    borderRadius: 12,
    marginRight: 12,
    marginLeft: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeRadio: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: colors.primaryBlue,
  },
  sheetTitle: {
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.activeBlack,
  },
});

//make this component available to the app
export default AddToken;
