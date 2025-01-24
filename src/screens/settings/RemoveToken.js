//import liraries
import React, {Component, useEffect, useRef, useState} from 'react';
import {useSSR} from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import {CText, MainHeader, PrimaryButton} from '../../components';
import {colors} from '../../helper/colorConstants';
import {fonts} from '../../helper/fontconstant';
import {getLocalText} from '../../helper/globalFunctions';
import {icons} from '../../helper/iconConstant';
import {hp, wp} from '../../helper/utils';
import { baseUrl2 } from '../../utils/consts';
import { _fetch } from '../../utils/_fetch';
import RemoveTokenBottomSheet from './RemoveTokenBottomSheet';
import { navigate } from '../../helper/rootNavigation';
import Loader from '../../components/Loader';

// create a component
const RemoveToken = () => {
  const sheetTef = useRef();
  const {jwtToken} = useSelector((state) => state.user);

  const [currentItem, setCurrentItem] = useState({});
  const [coinData, setCoinData] = useState([]);
  const [loading, setLoading] = useState(false);

  const init = async () => {
    try {
      setLoading(true);
      let res = await _fetch(`${baseUrl2}/userAddedAssets`,{
        method: 'GET',
        token: jwtToken,
      });
      res = await res.json();
      console.log(res);
      if (res.status === 200){
        setCoinData(res.payload);
      } else {
        setCoinData([]);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onItemPress = item => {
    setCurrentItem(item);
    sheetTef?.current?.open();
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => onItemPress(item)}
      style={[styles.walletItemContainer]}>
      <View style={styles.leftView}>
        <Image style={styles.iconStyle} source={{
          uri: item?.imageUrl,
        }} />
        <View>
          <Text style={styles.coinName}>{item?.name}</Text>
          <Text style={styles.chainName}>{item?.network_asset_info[0]?.name}</Text>
        </View>
      </View>
      <View style={styles.rightView}>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={styles.coinAmountText}>
            {item?.coinMainAmount > 1
              ? item?.coinMainAmount?.toLocaleString()
              : item?.coinMainAmount}{' '}
            {item?.symbol}
          </Text>
          {/* <Text style={styles.coinInDollar}>
            ~${item.coinSubAmount?.toLocaleString()}
          </Text> */}
        </View>
        <TouchableOpacity style={{}}>
          <Image
            source={icons.rightArrow}
            style={{width: 6.3, height: 11.48, marginHorizontal: wp(23.59)}}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const onCancelPress = () => {
    sheetTef?.current?.close();
    setCurrentItem({});
  };

  const onRemovePress = async () => {
    try {
      let res = await _fetch(`${baseUrl2}/removeCoinByUser`,{
        method: 'POST',
        body: {
          chainId: currentItem?.network_asset_info[0].chainId,
          contractAddress: currentItem?.network_asset_info[0].contract_address,
        },
        token: jwtToken,
      });
      res = await res.json();
      // console.log('Res is:', res);
      if (res.status === 200){
        sheetTef?.current?.close();
        setCurrentItem({});
        init();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const renderEmptyList = () => (
    <View style={styles.emptyStateMaincontainer}>
      <View style={styles.emptyStateIconContainer}>
        <Image style={styles.emptyStateIcon} source={icons.emptyRemoveToken} />
        <CText txt="No tokens to remove" g />
      </View>
      <PrimaryButton
        containerStyle={styles.primaryBtnAddTokenStyle}
        title={'Add Token'}
        titleStyle={{color: colors.primaryBlue}}
        onPress={() => {
          navigate('AddToken');
        }}
      />
    </View>
  );

  useEffect(()=>{
    init();
  }, []);

  useFocusEffect(
    React.useCallback(()=>{
      init();
    },[])
  );

  return (
    loading ? <Loader /> :
    <View style={styles.container}>
      <MainHeader title={'Remove Token'} />
      <FlatList
        style={styles.listStyle}
        data={coinData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index?.toString()}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={{flex: 1}}
      />
      <RBSheet
        ref={sheetTef}
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
          {
            Object.keys(currentItem).length > 0 && (
              <RemoveTokenBottomSheet
                currentItem={currentItem}
                onCancelPress={onCancelPress}
                onRemovePress={onRemovePress}
              />
            )
          }
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
  walletItemContainer: {
    borderWidth: 1,
    height: hp(80),
    width: 342,
    borderRadius: 12,
    backgroundColor: colors.primaryWhite,
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
  iconStyle: {width: 24, height: 24, marginRight: 8},
  coinName: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.darkBlack,
    fontWeight: '500',
  },
  chainName: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textGrayColor,
    fontWeight: '400',
    marginTop: 2,
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
  listStyle: {
    alignSelf: 'center',
  },
  emptyStateMaincontainer: {flex: 1, justifyContent: 'center'},
  emptyStateIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateIcon: {width: 281, height: 281, marginBottom: hp(24)},
  primaryBtnAddTokenStyle: {
    backgroundColor: colors.primaryWhite,
    borderWidth: 1,
    borderColor: colors.primaryBlue,
  },
});

//make this component available to the app
export default RemoveToken;
