import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  AppState,
  Modal,
  Dimensions,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useRoute } from '@react-navigation/native';
import { parseUnits } from 'ethers/lib/utils';
import { useDispatch, useSelector } from 'react-redux';

import {
  ApproveSuccessSheet,
  ApproveTransaction,
  DropDownSheet,
  MainHeader,
  PrimaryButton,
  PrimaryTextInput,
} from '../../../components';
import { colors } from '../../../helper/colorConstants';
import { getLocalText } from '../../../helper/globalFunctions';
import { icons } from '../../../helper/iconConstant';
import { hp } from '../../../helper/utils';
import { styles } from './styles';
import blockchain from '../../../utils/blockchain';
import { checkNaN, env } from '../../../utils/consts';
import CustomImage from '../../../components/Common/Image';
import Passcode from '../../Lock/Passcode';
import { ethers } from 'ethers';
import { TotalAmount } from '../../../components/Common/totalAmount';
import ApproveFailSheet from '../../../components/Wallet/ApproveFailSheet';
import { getWalletBalance } from '../../../redux/action/wallet';
import { debounce } from '../../../utils/throttle';

// create a component
const SendToken = () => {

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [sheetAciveIndex, setSheetActiveIndex] = useState(null);
  const [estimating, setEstimating] = useState(false);

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedChain, setSelectedChain] = useState(null);
  const [openPasscode, setOpenPasscode] = useState(false);
  const [txURL, setTxURL] = useState({});
  const [error, setError] = useState('');
  const [addressError, setAddressError] = useState('');
  const debounceTimer = useRef(null);
  const [disableAmountInput, setDisableAmountInput] = useState(false);

  const [disableSend, setDisableSend] = useState(0);
  const [gas, setGas] = useState(0);
  const [hasEnoughBalance, setHasEnoughBalance] = useState(null);
  const [nativeTokenBalance, setNativeTokenBalance] = useState(null);
  const [selectedTokenBalance, setSelectedTokenBalance] = useState('0');

  const _amount = useRef('0');

  const dispatch = useDispatch();
  const walletData = useSelector(st => st.wallet);
  const { allChains } = useSelector(st => st.chain);
  const { mainnet_provider_urls, test_net_providers } = useSelector(st => st.app);

  const provider_url = env === 'DEV' ? test_net_providers : mainnet_provider_urls;

  const route = useRoute();

  const refRBSheet = useRef();

  const onAddChangeText = txt => {
    setAddress(txt);
  };

  const onAmountChange = txt => {
    if (checkNaN(txt)) {setAmount(0); return; }

    let parsedTxt = parseFloat(txt);

    setAmount(txt);
    _amount.current = txt;

    if (!(parsedTxt === 0) && (parsedTxt <= parseFloat(selectedTokenBalance ?? 0))) {
      setEstimating(true);
      debounce(() => calculateGas(), 1000, debounceTimer);
    }

  };

  const onFocus = () => {
    setIsKeyboardOpen(true);
  };

  const onBlur = () => {
    setIsKeyboardOpen(false);
  };

  const onSendPress = () => {
    setSheetActiveIndex(1);
    refRBSheet?.current?.open();
  };

  const onAssetPress = () => {
    setSheetActiveIndex(4);
    refRBSheet?.current?.open();
  };

  const onChainAssetPress = () => {
    setSheetActiveIndex(5);
    refRBSheet?.current?.open();
  };

  const onRejectPress = () => {
    refRBSheet?.current?.close();
  };

  async function setMax() {
    try {

      if (!selectedChain?.native_token) {
        onAmountChange(selectedTokenBalance);
        return;
      }

      setEstimating(true);
      setDisableAmountInput(true);
      _amount.current = selectedTokenBalance;
      const gas = await estimateGas();
      console.log(gas);
      if (gas) {
        let fromAmount = ethers.utils.parseUnits(selectedTokenBalance, selectedChain.contract_decimals);
        let newAmount = ethers.utils.formatUnits(fromAmount.sub(blockchain.increaseByPercent(gas, 30)), selectedChain.contract_decimals).toString();
        newAmount = newAmount.split('.');
        newAmount[1] = newAmount[1].substring(0, 5);
        newAmount = newAmount.join('.');
        onAmountChange(newAmount);
      } else {
        ToastAndroid.show('Failed while calculating gas please try again in some time', ToastAndroid.SHORT);
      }
    } catch (err) {
      console.log(err);
      ToastAndroid.show('Some error occurred please try again in some time', ToastAndroid.SHORT);
    } finally {
      setDisableAmountInput(false);
    }
  }

  const estimateGas = useCallback(async function () {
    try {

      if (!selectedChain?.chain_id || checkNaN(_amount.current) || parseFloat(_amount.current) === 0) {
        return 0;
      }

      let estGas;
      const sendAmount = parseUnits(`${_amount.current ?? 0}`, selectedChain.contract_decimals ?? 18);
      let _address =  walletData.address;
      
      if (address){
        _address = address;
      }

      if (selectedChain.native_token) {
        estGas = await blockchain.estimateGasForNativeTokenTransfer(
          _address,
          sendAmount,
          walletData.key,
          provider_url[`${selectedChain.chain_id}`].INFURA,
          walletData.address
        );
      } else {
        estGas = await blockchain.estimateGasForERC20Transfer(
          _address,
          sendAmount.toString(),
          walletData.key,
          provider_url[`${selectedChain.chain_id}`].INFURA,
          walletData.address,
          selectedChain.contract_address
        );
      }

      return estGas;

    } catch (err) {
      //setOpenMessageModal("fail");
      // crashlytics().log(err.message);
      console.log('error here');
      console.log(err);

      // Toast.show({ text2: err.message, type: 'error' });
      refRBSheet?.current?.close();
      return err.message;
    }
  }, [address, walletData.key, walletData.address, selectedChain?.contract_address, selectedChain?.chain_id, selectedChain?.contract_decimals, provider_url, selectedChain?.native_token]);

  const calculateGas = useCallback(async () => {
    try {
      setEstimating(true);
      console.log('calculating gas');
      const gas = await estimateGas();

      if (gas === 0) {
        return;
      }

      if (typeof gas === 'string') {
        ToastAndroid.show(gas || 'Some error occurred while calculating gas, please try again in some time', ToastAndroid.LONG);
        setLoading(false);
        return;
      }

      console.log(gas);
      setGas(ethers.utils.formatUnits(gas));
    } catch (err) {
      console.log(err);
    } finally {
      setEstimating(false);
    }
  }, [estimateGas]);

  const getTokenBalance = useCallback(async () => {
    if (selectedChain?.chain_id) {
      let wb = await blockchain.getNativeBalance(walletData.key, provider_url[`${selectedChain.chain_id}`].INFURA);
      wb = ethers.utils.formatUnits(wb).toString();
      setNativeTokenBalance(wb);
      if (selectedChain.native_token) {
        setSelectedTokenBalance(wb);
      } else {
        console.log('provider url', walletData.key, provider_url[`${selectedChain.chain_id}`].INFURA);
        let wb = await blockchain.getERC20TokenBalance(walletData.key, provider_url[`${selectedChain.chain_id}`].INFURA, walletData.address, selectedChain.contract_address);
        console.log('wallet balance', wb);
        wb = ethers.utils.formatUnits(wb, selectedChain.contract_decimals).toString();
        setSelectedTokenBalance(wb);
      }
    }
  }, [selectedChain?.chain_id, selectedChain?.contract_address, selectedChain?.contract_decimals, selectedChain?.native_token, walletData.key, provider_url, walletData.address]);

  // assumption 1: chains -> chainId is same as asset -> chains -> chain_id
  // assumption 2: asset will contain contract address

  async function withdraw() {
    try {
      setLoading(true);
      const _amount = parseUnits(`${amount}`, selectedChain.contract_decimals ?? 18).toString();

      let tx;

      if (selectedChain?.native_token) {
        tx = await blockchain.transferNativeToken(
          address,
          _amount,
          walletData.key,
          provider_url[`${selectedChain.chain_id}`].INFURA,
          walletData.address
        );
      } else {
        tx = await blockchain.transferERC20Token(
          address,
          _amount,
          walletData.key,
          provider_url[`${selectedChain?.chain_id}`].INFURA,
          walletData.address,
          selectedChain.contract_address
        );
      }
      let { explorerLink } = allChains.find(e => e.chainId === selectedChain.chain_id);
      let txHash = tx.transactionHash;
      if (txHash === undefined) {
        txHash = tx.hash;
      }

      dispatch(getWalletBalance());
      getTokenBalance();
      setTxURL(explorerLink + txHash);
      setSheetActiveIndex(2);

    } catch (err) {
      //setOpenMessageModal("fail");
      // crashlytics().log(err.message);
      setSheetActiveIndex(3);
      setError(err.message);
      console.log(err);
    } finally {
      setLoading(false);
    }

  }

  const percentageData = [
    {
      id: 1,
      percentage: 25,
    },
    {
      id: 2,
      percentage: 50,
    },
    {
      id: 3,
      percentage: 75,
    },
    {
      id: 4,
      percentage: 100,
    },
  ];

  useEffect(() => {
    if (walletData.balancePerCoin) {
      if (route.params?.contract_address && route.params?.symbol && route.params?.chain_id) {
        let chain, token;
        for (let i = 0; i < walletData.balancePerCoin.length; i++) {
          let e = walletData.balancePerCoin[i];
          if (e.symbol === route.params.symbol) {
            chain = e.chains.find(c => (c.contract_address === route.params.contract_address && c.chain_id === route.params.chain_id));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params]);

  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', state => {
      if (state === 'background') {
        setOpenPasscode(false);
      }
    });
    return () => appStateListener.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    calculateGas();
  }, [calculateGas]);

  // calculate if wallet has enough balance to make the transaction
  useEffect(() => {

    console.log('quote', gas);

    if (!gas || !selectedChain?.contract_decimals) {
      setHasEnoughBalance(false);
      return;
    }

    if (checkNaN(amount) || parseFloat(amount) > parseFloat(selectedTokenBalance)) {
      setHasEnoughBalance(false);
      return;
    }

    console.log(gas);

    let gasCost = ethers.utils.parseUnits(gas, 18);
    const _nativeTokenBalance = ethers.utils.parseUnits(nativeTokenBalance);
    const fromAmount = ethers.utils.parseUnits(`${_amount.current ?? '0'}`, selectedChain.contract_decimals);
    if (selectedChain.native_token) {
      console.log(fromAmount.toString(), gasCost.toString(), fromAmount.add(blockchain.increaseByPercent(gasCost, 30)).toString(), _nativeTokenBalance.toString());
      setHasEnoughBalance(fromAmount.add(blockchain.increaseByPercent(gasCost, 30)).lte(_nativeTokenBalance ?? ethers.BigNumber.from('0')));
    } else {
      setHasEnoughBalance(blockchain.increaseByPercent(gasCost, 30).lte(_nativeTokenBalance ?? ethers.BigNumber.from('0')));
    }
  }, [gas, nativeTokenBalance, selectedChain?.native_token, selectedChain?.contract_decimals, amount, selectedTokenBalance]);

  // disable send button
  useEffect(() => {

    console.log('swap button disable', hasEnoughBalance, amount, selectedTokenBalance);

    let disable = false;

    if (estimating) {
      disable = true;
    }
    if (!hasEnoughBalance) {
      disable = true;
    }
    if (checkNaN(amount) || parseFloat(amount) > parseFloat(selectedTokenBalance)) {
      disable = true;
    }
    if (address.length === 0 || !ethers.utils.isAddress(address)) {
      disable = true;
    }

    setDisableSend(disable);
  }, [hasEnoughBalance, amount, selectedTokenBalance, address, estimating, loading]);

  // get from token balance, using blockchain
  useEffect(() => {
    getTokenBalance();
  }, [getTokenBalance]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardDismissMode={'interactive'}
      style={styles.container}>
      <MainHeader title={getLocalText('Send Tokens')} />
      <View
        style={[
          styles.topCoinDropView,
          { marginTop: isKeyboardOpen ? hp(8) : hp(105) },
        ]}>
        <TouchableOpacity
          onPress={onAssetPress}
          style={styles.dropbtnContainer}>
          <CustomImage uri={selectedAsset?.logo_url} style={styles.dropbtnIcon} />
          <Text style={styles.dropBtnName} numberOfLines={1} ellipsizeMode='tail'>{selectedAsset?.name}</Text>
          <Image source={icons.downIndicator} style={styles.dropBtnRightIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onChainAssetPress}
          style={[styles.dropbtnContainer, { marginLeft: 8 }]}>
          <Image
            source={{ uri: provider_url && selectedChain?.chain_id ? provider_url[selectedChain?.chain_id]?.image_url : undefined }}
            style={styles.dropbtnIcon}
          />
          <Text style={styles.dropBtnName}>{selectedChain?.chain_name}</Text>
          <Image source={icons.downIndicator} style={styles.dropBtnRightIcon} />
        </TouchableOpacity>
      </View>
      <View>
        <PrimaryTextInput
          title={'Enter Address'}
          titleStyle={styles.textInputTitle}
          value={address}
          onChangeText={onAddChangeText}
          placeholder={'Enter wallet address'}
          errorText={addressError}
          containerStyle={{ marginTop: hp(21) }}
          onFocus={onFocus}
          onBlur={() => {
            onBlur();
            setAddressError(ethers.utils.isAddress(address) ? '' : 'Please enter a valid wallet address');
          }}
        />
        <PrimaryTextInput
          title={'Enter Amount'}
          titleStyle={styles.textInputTitle}
          value={amount}
          onChangeText={onAmountChange}
          placeholder={'Enter Amount'}
          containerStyle={{ marginTop: hp(37) }}
          isAmount
          amount={parseFloat(amount?.length === 0 ? 0 : amount) * parseFloat(checkNaN(selectedChain?.quote_rate) ? 0 : selectedChain?.quote_rate)}
          onFocus={onFocus}
          keyboardType="numeric"
          onBlur={onBlur}
          disabled={disableAmountInput}
        />
        <View style={styles.amountView}>
          <Text
            style={
              styles.availableAmountText
            }>{`${'Available'}: ${parseFloat(selectedTokenBalance).toFixed(4)} ${selectedChain?.contract_ticker_symbol}`}</Text>
          <Text style={styles.availableAmountText}>{`=$${(selectedChain?.quote ?? 0)?.toFixed(
            2,
          )}`}</Text>
        </View>
        <View style={styles.percentageContainer}>
          {
            percentageData?.map(i => {
              return (
                <TouchableOpacity style={styles.percentageItem}
                  onPress={() => {
                    if (parseFloat(selectedTokenBalance) === 0) {
                      return;
                    }
                    if (i.percentage !== 100) {
                      let val = parseFloat(selectedTokenBalance) * i.percentage / 100;
                      val = `${val}`.split('.');
                      val[1] = val[1].substring(0, 5);
                      val = val.join('.');
                      onAmountChange(val);
                    } else {
                      setMax();
                    }
                  }}>
                  <Text style={styles.percentageText}>{i?.percentage !== 100 ? `${i?.percentage}%` : 'max'}</Text>
                </TouchableOpacity>
              );
            })
          }
        </View>

        <TotalAmount
          amount={checkNaN(amount) ? '0' : parseFloat(amount).toFixed(5)}
          gas={parseFloat(gas).toFixed(5)}
          gasSymbol={selectedChain?.chain_id ? walletData.chainwiseNativeToken[selectedChain.chain_id]?.symbol : ''}
          symbol={selectedAsset?.symbol} style={{ marginTop: isKeyboardOpen ? 15 : 30, }}
          hasEnougnETH={hasEnoughBalance}
          estimating={estimating}
        />

        <PrimaryButton
          onPress={async () => {
            setOpenPasscode(true);
          }}
          containerStyle={{
            marginBottom: 0,
          }}
          title={!hasEnoughBalance && amount && !estimating ? 'Insufficient balance' : 'Send'}
          disable={disableSend}
          isLoader={loading || estimating}
        />
      </View>
      <View style={styles.alertView}>
        <Image source={icons.info} style={styles.alertIconstyle} />
        <Text
          style={styles.alertText}>
          {getLocalText('tokenAlertSend')}
        </Text>
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
        {sheetAciveIndex === 1 && (
          <ApproveTransaction
            selectedAsset={selectedAsset}
            selectedChain={selectedChain}
            onApprovePress={withdraw}
            onRejectPress={onRejectPress}
            address={address}
            amount={amount}
            loading={loading}
            gas={gas}
            gasSymbol={selectedChain.chain_id ? walletData.chainwiseNativeToken[selectedChain.chain_id]?.symbol : ''}
          />
        )}
        {sheetAciveIndex === 2 && (
          <ApproveSuccessSheet onOkayPress={onRejectPress} url={txURL} />
        )}
        {
          sheetAciveIndex === 3 && (
            <ApproveFailSheet onOkayPress={() => { refRBSheet.current?.close() }} reason={error} />
          )
        }
        {sheetAciveIndex > 3 && (
          <DropDownSheet
            setSelectedAsset={setSelectedAsset}
            setSelectedChain={setSelectedChain}
            isAsset={sheetAciveIndex === 4 ? true : false}
            selectedAsset={selectedAsset}
            selectedChain={selectedChain}
            sheetRef={refRBSheet}
            showOnlyWithChain={true}
          />
        )}
      </RBSheet>
      {
        openPasscode &&
        <Modal visible={openPasscode} animationType="slide" onRequestClose={() => setOpenPasscode(false)}>
          <View style={styles.container}>
            <Passcode
              type="unlock"
              onSuccess={() => {
                onSendPress();
                setOpenPasscode(false);
              }} />
          </View>
        </Modal>
      }
    </ScrollView>
  );
};

//make this component available to the app
export default SendToken;
