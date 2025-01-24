//import liraries
import { useRoute } from '@react-navigation/native';
import { ethers } from 'ethers';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ToastAndroid, Modal, AppState, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSelector } from 'react-redux';
import {
  ApproveSuccessSheet,
  ApproveSwapSheet,
  MainHeader,
  PrimaryButton,
  PrimaryTextInput,
} from '../../components';
import CustomImage from '../../components/Common/Image';
import Loader from '../../components/Loader';
import ApproveFailSheet from '../../components/Wallet/ApproveFailSheet';
import { icons } from '../../helper/iconConstant';
import { hp, wp } from '../../helper/utils';
import { checkNaN, env } from '../../utils/consts';
import { getFromAndToTokens, getQuote, swap } from './integration';
import { styles } from './styles';
import SwapDropDownSheet from './SwapDropDownSheet';
import Passcode from '../Lock/Passcode';
import { debounce } from '../../utils/throttle';
import blockchain from '../../utils/blockchain';


// create a component
export default function SwapScreen() {

  const [toAssets, setToAssets] = useState([]);
  const [fromAssets, setFromAssets] = useState([]);
  const [amount1, setAmount1] = useState(0);
  const [amount2, setAmount2] = useState(0);
  const [selectedAsset1, setSelectedAsset1] = useState('');
  const [selectedAsset2, setSelectedAsset2] = useState('');
  const [selectedChain1, setSelectedChain1] = useState('');
  const [selectedChain2, setSelectedChain2] = useState('');
  const [quote, setQuote] = useState(null);
  const [txURL, setTxURL] = useState('');

  const [initLoading, setInitloading] = useState(false);
  const [sheetAciveIndex, setSheetActiveIndex] = useState(2);
  const [updatingTo, setUpdatingTo] = useState(false);
  const [openPasscode, setOpenPasscode] = useState(false);
  const [swapDisabled, setSwapDisabled] = useState(true);

  const [disableAmountInput, setDisableAmountInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const [hasEnoughBalance, setHasEnoughBalance] = useState(false);
  const [nativeTokenBalance, setNativeTokenBalance] = useState(0);
  const [fromTokenBalance, setFromTokenBalance] = useState('0');
  const [error, setError] = useState('');

  const app = useSelector(st => st.app);
  const { balancePerCoin, address, key } = useSelector(st => st.wallet);
  const { allChains } = useSelector(st => st.chain);
  const { mainnet_provider_urls, test_net_providers } = useSelector(st => st.app);
  const provider_url = env === 'DEV' ? test_net_providers : mainnet_provider_urls;

  const refRBSheet = useRef();

  const debounceTimer = useRef(null);
  const _amount = useRef('0');

  const route = useRoute();

  function updateAmount1(amt) {
    setAmount1(amt);
    _amount.current = amt;
  }

  const onAmount1Change = txt => {
    let am = 0;
    if (checkNaN(txt) || !txt) {
      am = 0;
    }
    else { am = txt; }

    updateAmount1(am);
    if (txt !== '0') {
      console.log('Called debounce->' ,txt);
      debounce(() => calculateQuote(), 1000, debounceTimer);
    }
  };

  useEffect(() => {
    setInitloading(true);
    init();
  }, [init]);

  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', state => {
      console.log(state);
      if (state === 'background') {
        // console.log("skjfsgdj")
        setOpenPasscode(false);
      }
    });
    return () => appStateListener.remove();
  }, []);

  const onRejectPress = () => {
    refRBSheet?.current?.close();
  };

  const selectAsset = (item) => {
    console.log('asset');
    console.log(item);
    if (updatingTo) {
      setSelectedAsset2(item);
    } else {
      setSelectedAsset1(item);
    }
  };

  const selectChain = (item) => {
    console.log(item);
    if (updatingTo) {
      let selectedTo = toAssets.find(e => e.chain.chainId === item.chainId)?.tokens;
      if (Array.isArray(selectedTo) && selectedTo.length) {
        setSelectedChain2(item);
        setSelectedAsset2(selectedTo[0]);
      }
    } else {
      let selectedTo = fromAssets.find(e => e.chain.chainId === item.chainId)?.tokens;
      if (Array.isArray(selectedTo) && selectedTo.length) {
        setSelectedChain1(item);
        setSelectedAsset1(selectedTo[0]);
      }
    }
  };

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

  const init = useCallback(async () => {
    try {
      let { to, from } = await getFromAndToTokens(balancePerCoin, allChains);

      console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$', from);

      setToAssets(to);
      setFromAssets(from);

      if (to.length > 0) {
        setSelectedAsset2(to[0].tokens[0]);
        setSelectedChain2(to[0].chain);
      }
      console.log('After to.length check', to);

      if (from.length > 0) {
        if (route.params?.contract_address && route.params?.symbol && route.params?.chain_id) {
          let chain, token;
          for (let i = 0; i < from.length; i++) {
            let e = from[i];
            if (e.chain.chainId === route.params.chain_id) {
              chain = e.chain;
              //token = e.tokens.find(c => (c.address === route.params.contract_address));
              console.log('######################->', route.params.contract_address, e.tokens);
              token = e.tokens.find(c => ((route.params.native_token && c.address === '0x0000000000000000000000000000000000000000') || (c.address.toLowerCase() === route.params.contract_address.toLowerCase())));
              if (chain && token) {
                setSelectedChain1(chain);
                setSelectedAsset1(token);
                console.log('Retunrng fom the chain and token', chain, token);
                setInitloading(false);
                return;
              }
            }
          }
        }
        console.log('######################');
        console.log(from[0]);
        setSelectedAsset1(from[0].tokens[0]);
        setSelectedChain1(from[0].chain);
      }
    } catch (error1) {
      console.log(error1);
    }
    setInitloading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allChains, route.params]);

  // set maximum value
  async function setMax() {
    try {

      if (!selectedAsset1.native) {
        onAmount1Change(fromTokenBalance);
        return;
      }

      setLoading(true);
      setDisableAmountInput(true);
      _amount.current = fromTokenBalance;
      const totalQuote = await _getQuote();
      console.log(totalQuote);
      if (totalQuote.toAmount) {
        let fromAmount = ethers.utils.parseUnits(fromTokenBalance, selectedAsset1.decimals);
        let newAmount = ethers.utils.formatUnits(fromAmount.sub(blockchain.increaseByPercent(totalQuote.gasCostInToken, 30)), selectedAsset1.decimals).toString();
        newAmount = newAmount.split('.');
        newAmount[1] = newAmount[1].substring(0, 5);
        newAmount = newAmount.join('.');
        onAmount1Change(newAmount);
      } else {
        ToastAndroid.show(`${totalQuote ?? 'Failed while calculating gas please try again in some time'}`, ToastAndroid.SHORT);
      }
    } catch (err) {
      console.log(err);
      ToastAndroid.show('Some error occurred please try again in some time', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
      setDisableAmountInput(false);
    }
  }

  const _getQuote = useCallback(async () => {
    try {

      if (checkNaN(_amount.current) || parseFloat(_amount.current) === 0) {
        return ({
          fromAmount: '0',
          toAmount: '0',
          fromAmountUSD: 0,
          toAmountUSD: 0,
          gasCostUSD: 0,
          gasCostInToken: 0,
          executionDuration: 0,
        });
      }

      let fromAmount = ethers.utils.parseUnits(`${_amount.current ?? '0'}`, selectedAsset1.decimals);

      if (fromAmount.eq(ethers.BigNumber.from('0')) || !selectedChain1?.chainId || !selectedAsset1) {
        return ({
          fromAmount: '0',
          toAmount: '0',
          fromAmountUSD: 0,
          toAmountUSD: 0,
          gasCostUSD: 0,
          gasCostInToken: 0,
          executionDuration: 0,
        });
      }
      console.log('Called getQuote With->' , fromAmount);
      let result = await getQuote({
        fromChainId: selectedChain1.chainId,
        fromAmount: fromAmount.toString(),
        fromTokenAddress: selectedAsset1.address,
        toChainId: selectedChain2.chainId,
        toTokenAddress: selectedAsset2.address,
        fromAddress: address,
      });

      if (result.estimate) {
        let gasCostDetails = result.estimate.gasCosts[0];
        let gasCostUSD = 0;
        let gasCost = 0;

        if (gasCostDetails) {
          try {
            let gasPrice = ethers.BigNumber.from(gasCostDetails.price);
            let estimate = ethers.BigNumber.from(gasCostDetails.estimate);
            gasCost = gasPrice.mul(estimate);
            let cost = Number(ethers.utils.formatEther(gasCost));
            let priceUSD = (cost * Number(gasCostDetails.token.priceUSD)).toFixed(2);
            gasCostUSD = priceUSD;
          } catch (e) {
            console.log(e);
            gasCostUSD = gasCostDetails.priceUSD;
          }
        }

        const quote = {
          fromAmount: ethers.utils.formatUnits(result.estimate.fromAmount, selectedAsset1.decimals).toString(),
          toAmount: ethers.utils.formatUnits(result.estimate.toAmount, selectedAsset2.decimals).toString(),
          fromAmountUSD: result.estimate.fromAmountUSD,
          toAmountUSD: result.estimate.toAmountUSD,
          gasCostUSD,
          gasCostInToken: gasCost,
          executionDuration: result.estimate.executionDuration,
        };

        console.log('calculated quot ->', quote);

        return quote;
      } else {
        return result.message;
      }

    } catch (err) {
      console.log(err);
      return 'Some error occurred while swapping';
    }
  }, [selectedAsset1, selectedAsset2.address, selectedAsset2.decimals, selectedChain1.chainId, selectedChain2.chainId, address]);

  const calculateQuote = useCallback(async () => {
    setLoading(true);
    console.log('calculating quote');
    const _quote = await _getQuote();
    if (!_quote.toAmount) {
      ToastAndroid.show(`${_quote}`, ToastAndroid.LONG);
      setLoading(false);
      return;
    }

    console.log(_quote);

    setAmount2(_quote.toAmount);
    setQuote(_quote);
    setLoading(false);
  }, [_getQuote]);

  // calculate if wallet has enough balance to make the transaction
  useEffect(() => {

    console.log('quote', quote);

    if (!quote?.gasCostInToken) {
      setHasEnoughBalance(false);
      return;
    }

    let gasCost = quote.gasCostInToken;
    const fromAmount = ethers.utils.parseUnits(_amount.current, selectedAsset1.decimals);
    const _nativeTokenBalance = ethers.utils.parseUnits(nativeTokenBalance, selectedChain1.contract_decimals);
    if (selectedAsset1?.native) {
      setHasEnoughBalance(fromAmount.add(blockchain.increaseByPercent(gasCost, 5)).lte(_nativeTokenBalance ?? ethers.BigNumber.from('0')));
    } else {
      setHasEnoughBalance(blockchain.increaseByPercent(gasCost, 5).lte(_nativeTokenBalance ?? ethers.BigNumber.from('0')));
    }
  }, [quote, nativeTokenBalance, selectedAsset1, selectedChain1.contract_decimals]);

  // calculate quote
  useEffect(() => {
    calculateQuote();
  }, [calculateQuote]);

  // disable swap button
  useEffect(() => {

    console.log('swap button disable', hasEnoughBalance, amount1, fromTokenBalance);

    if (!hasEnoughBalance) {
      setSwapDisabled(true);
      return;
    }
    if (checkNaN(amount1) || parseFloat(amount1) > parseFloat(fromTokenBalance)) {
      setSwapDisabled(true);
      return;
    }
    setSwapDisabled(false);
  }, [hasEnoughBalance, amount1, fromTokenBalance]);

  // get native token balance using blockchain
  useEffect(() => {
    async function getNativeBalance() {
      if (key && provider_url[`${selectedChain1.chainId}`].INFURA) {
        let wb = await blockchain.getNativeBalance(key, provider_url[`${selectedChain1.chainId}`].INFURA);
        wb = ethers.utils.formatUnits(wb, selectedChain1.contract_decimals).toString();
        setNativeTokenBalance(wb);
      }
    }
    getNativeBalance();
  }, [selectedChain1.chainId, provider_url, key, selectedChain1.contract_decimals]);

  // get from token balance, using blockchain
  useEffect(() => {
    async function getTokenBalance() {
      if (selectedAsset1) {
        if (selectedAsset1.native) {
          setFromTokenBalance(nativeTokenBalance);
        } else {
          let wb = await blockchain.getERC20TokenBalance(key, provider_url[`${selectedChain1.chainId}`].INFURA, address, selectedAsset1.address);
          wb = ethers.utils.formatUnits(wb, selectedAsset1.decimals).toString();
          setFromTokenBalance(wb);
        }
      }
    }
    getTokenBalance();
  }, [selectedAsset1, nativeTokenBalance, key, provider_url, address, selectedChain1.chainId]);

  const _swap = async () => {
    setLoading(true);
    try {

      let fromAmount = ethers.utils.parseUnits(amount1, selectedAsset1.decimals);

      let res = await swap({
        fromChainId: selectedChain1.chainId,
        fromAmount: fromAmount,
        fromTokenAddress: selectedAsset1.address,
        toChainId: selectedChain2.chainId,
        toTokenAddress: selectedAsset2.address,
        key,
        fromAddress: address,
        provider_url: app[env === 'DEV' ? 'test_net_providers' : 'mainnet_provider_urls'],
      });

      if (res.success) {
        console.log('Result->', res);
        console.log('allChains', allChains);
        console.log('selectedAsset1.chain_id', selectedAsset1);
        let netwrok_obj = allChains.find(e => { console.log(e); return e.chainId === selectedAsset1.chainId; });
        console.log(netwrok_obj);
        console.log(res.data.transactionHash);
        console.log(netwrok_obj.explorerLink + res.data.hash);
        let txHash = res.data.transactionHash;
        if (txHash === undefined) {
          txHash = res.data.hash;
        }
        console.log(netwrok_obj.explorerLink + txHash);
        setTxURL(netwrok_obj.explorerLink + txHash);
        setSheetActiveIndex(2);
        onAmount1Change('0');
      } else {
        setError(res.message);
        setSheetActiveIndex(3);
      }
    } catch (e) {
      console.log(e);
      setError(e.message);
      setSheetActiveIndex(3);
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <MainHeader title={'Swap Assets'} />
      <KeyboardAwareScrollView extraScrollHeight={50}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: hp(64),
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            disabled={loading}
            onPress={loading ? null : () => {
              refRBSheet?.current?.open();
              setSheetActiveIndex(5);
              setUpdatingTo(false);
            }}
            style={styles.dropbtnContainer}>
            {
              initLoading ? <Loader size={20} width={15} height={15} /> :
                <>
                  <CustomImage uri={selectedChain1.imageUrl} style={styles.dropbtnIcon} />
                  <Text style={styles.dropBtnName} numberOfLines={2} ellipsizeMode='tail'>{selectedChain1.name}</Text>
                  <Image
                    source={icons.downIndicator}
                    style={styles.dropBtnRightIcon}
                  />
                </>
            }
          </TouchableOpacity>
          <TouchableOpacity
            disabled={loading}
            onPress={loading ? null : () => {
              refRBSheet?.current?.open();
              setSheetActiveIndex(4);
              setUpdatingTo(false);
            }}
            style={[styles.dropbtnContainer, { marginLeft: wp(8) }]}>
            {
              initLoading ? <Loader size={20} width={15} height={15} />
                :
                <>
                  <CustomImage uri={selectedAsset1.logoURI} style={styles.dropbtnIcon} />
                  <Text style={styles.dropBtnName} numberOfLines={1} ellipsizeMode='tail'>{selectedAsset1.name}</Text>

                  <Image
                    source={icons.downIndicator}
                    style={[styles.dropBtnRightIcon]}
                  />
                </>
            }
          </TouchableOpacity>
        </View>
        <PrimaryTextInput
          value={amount1}
          onChangeText={onAmount1Change}
          placeholder={'Enter Amount'}
          containerStyle={{ marginTop: hp(8) }}
          isAmount
          amount={(parseFloat(amount1 ? amount1 : 0) * selectedAsset1.priceUSD)}
          keyboardType="numeric"
          inputContainer={{ color: '#000' }}
          disabled={disableAmountInput || loading}
        />
        <View style={[styles.amountView, { flexWrap: "wrap" }]}>
          <Text style={styles.availableAmountText}>{`${'Available'}: ${parseFloat(fromTokenBalance).toFixed(4)} ${selectedAsset1?.symbol ?? ''}`}</Text>
          <Text style={styles.availableAmountText}>{`=$${checkNaN(parseFloat(fromTokenBalance) * selectedAsset1?.priceUSD) ? '0' : (parseFloat(fromTokenBalance) * selectedAsset1?.priceUSD).toFixed(2)}`}</Text>
        </View>
        <View style={styles.percentageContainer}>
          {
            percentageData?.map(i => (
              <TouchableOpacity
                disabled={loading}
                style={styles.percentageItem}
                onPress={loading ? null : () => {
                    if (parseFloat(fromTokenBalance) === 0) {
                      return;
                    }
                    if (i.percentage === 100) {
                    setMax();
                  } else {
                    let val = parseFloat(fromTokenBalance) * i.percentage / 100;
                    val = `${val}`.split('.');
                    val[1] = val[1].substring(0, 5);
                    val = val.join('.');
                    onAmount1Change(val);
                  }
                }}
                key={`perc-${i.percentage}`}>
                <Text style={styles.percentageText}>{i?.percentage !== 100 ? `${i?.percentage}%` : 'max'}</Text>
              </TouchableOpacity>
            ))
          }
        </View>

        <TouchableOpacity
          disabled={loading}
          style={{
            alignSelf: 'center',
            marginVertical: hp(31),
            padding: 2
          }}
          onPress={loading ? null : () => {
            let chain1 = selectedChain1;
            let chain2 = selectedChain2;

            let asset1 = selectedAsset1;
            let asset2 = selectedAsset2;

            console.log(fromAssets);

            let fromTokens = fromAssets.find(e => e.chain.chainId === chain2.chainId)?.tokens ?? [];

            console.log(fromTokens);
            console.log(asset2);

            let updatedFromToken = fromTokens.find(e => e.address.toLowerCase() === asset2.address.toLowerCase());

            console.log(updatedFromToken);

            if (!updatedFromToken) {
              console.log('Cannot swap');
              // return Toast.show({ text1: `You do not have sufficient ${asset2.name} balance to swap from`, type: 'error' });
              ToastAndroid.show(`You do not have sufficient ${asset2.name} balance to swap from`, ToastAndroid.SHORT);
              return;
            }

            console.log('Can swap');

            setSelectedChain1(chain2);
            setSelectedChain2(chain1);

            setSelectedAsset1(asset2);
            setSelectedAsset2(asset1);

            if (asset2.balance < asset1.balance) {
              setAmount1(`${asset2.balance}`);
            }

          }}
        >
          <Image
            source={icons.swapLargeCircle}
            style={{
              height: 57,
              width: 57,
              aspectRatio: 1 / 1
            }}
          />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
          <TouchableOpacity
            disabled={loading}
            onPress={loading ? null : () => {
              refRBSheet?.current?.open();
              setSheetActiveIndex(5);
              setUpdatingTo(true);
            }}
            style={styles.dropbtnContainer}>
            {
              initLoading ? <Loader size={20} width={15} height={15} /> :
                <>
                  <CustomImage uri={selectedChain2.imageUrl} style={styles.dropbtnIcon} />
                  <Text style={styles.dropBtnName} numberOfLines={2} ellipsizeMode='tail'>{selectedChain2.name}</Text>
                  <Image
                    source={icons.downIndicator}
                    style={styles.dropBtnRightIcon}
                  />
                </>
            }
          </TouchableOpacity>
          <TouchableOpacity
            disabled={loading}
            onPress={loading ? null : () => {
              refRBSheet?.current?.open();
              setSheetActiveIndex(4);
              setUpdatingTo(true);
            }}
            style={[styles.dropbtnContainer, { marginLeft: wp(8) }]}>
            {
              initLoading ? <Loader size={20} width={15} height={15} /> :
                <>
                  <CustomImage uri={selectedAsset2.logoURI} style={styles.dropbtnIcon} />
                  <Text style={styles.dropBtnName} numberOfLines={1} ellipsizeMode='tail'>{selectedAsset2.name}</Text>
                  <Image
                    source={icons.downIndicator}
                    style={[styles.dropBtnRightIcon]}
                  />
                </>
            }
          </TouchableOpacity>
        </View>
        <PrimaryTextInput
          value={parseFloat(amount2).toFixed(parseFloat(amount2) ? 5 : 2)}
          placeholder={'Enter Amount'}
          containerStyle={{ marginTop: hp(8) }}
          isAmount
          inputContainer={{ color: '#000' }}
          amount={(parseFloat(amount2 ? amount2 : 0) * selectedAsset2.priceUSD)}
          disabled={true}
        />
        <View style={styles.converterView}>
          <Text style={styles.converterText}>1 {selectedAsset1.symbol} = {selectedAsset2?.priceUSD ? (selectedAsset1?.priceUSD / selectedAsset2?.priceUSD).toFixed(3) : 0} {selectedAsset2.symbol}</Text>
          <View style={styles.converterInnerView}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.convertertitle}>Transaction cost</Text>
              <Text style={styles.converterVal}>~${quote?.gasCostUSD || (0).toFixed(2)}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.convertertitle}>Estimated time</Text>
              <Text style={styles.converterVal}>~{quote?.executionDuration || (0).toFixed(2)} sec</Text>
            </View>
          </View>
        </View>
        <PrimaryButton
          onPress={() => {
            // refRBSheet?.current?.open();
            setOpenPasscode(true);
            // setSheetActiveIndex(1);
          }}
          title={!hasEnoughBalance && amount1 ? 'Insufficient Balance' : 'Swap'}
          containerStyle={{ marginBottom: hp(0), marginTop: hp(10) }}
          disable={swapDisabled || loading}
          isLoader={loading}
        />
      </KeyboardAwareScrollView>
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
          <ApproveSwapSheet
            onApprovePress={_swap}
            onRejectPress={onRejectPress}
            quote={quote}
            asset1={selectedAsset1}
            asset2={selectedAsset2}
            loading={loading}
          />
        )}
        {sheetAciveIndex === 2 && (
          <ApproveSuccessSheet onOkayPress={onRejectPress} url={txURL} />
        )}
        {sheetAciveIndex === 3 && (
          <ApproveFailSheet onOkayPress={onRejectPress} reason={error} />
        )}
        {sheetAciveIndex > 3 && (
          <SwapDropDownSheet
            onItemPress={res =>
              sheetAciveIndex === 4
                ? selectAsset(res)
                : selectChain(res)
            }
            isAsset={sheetAciveIndex === 4 ? true : false}
            assets={updatingTo ? toAssets : fromAssets}
            selectedAsset={updatingTo ? selectedAsset2 : selectedAsset1}
            selectedChain={updatingTo ? selectedChain2 : selectedChain1}
            sheetRef={refRBSheet}
          />
        )}
      </RBSheet>
      {
        openPasscode &&
        <Modal visible={openPasscode} animationType="slide" onRequestClose={() => setOpenPasscode(false)}>
          <View style={styles.container}>
            <Passcode type="unlock"
              onSuccess={async () => {
                setOpenPasscode(false);
                await calculateQuote();
                setSheetActiveIndex(1);
                refRBSheet.current?.open();
              }}
            />
          </View>
        </Modal>
      }
    </View>
  );
}
