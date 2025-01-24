//import liraries
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useSelector } from 'react-redux';
import { colors } from '../../../helper/colorConstants';
import { fonts } from '../../../helper/fontconstant';
import { getLocalText } from '../../../helper/globalFunctions';
import { icons } from '../../../helper/iconConstant';
import { env } from '../../../utils/consts';
import CustomImage from '../../Common/Image';
import { styles } from './styles';


function RenderItem({ item, selectedAsset, selectedChain, isAsset, sheetRef, setSelectedAsset, setSelectedChain }) {

  const [selected, setSelected] = useState(false);
  const app = useSelector(st => st.app);
  const [obj, setObj] = useState({
    title: '',
    imageUrl: '',
    coinMainAmount: 0,
    coinSubAmount: 0,
    unit: '',
  });

  useEffect(() => {

    let _selected = isAsset ?
      (selectedAsset?.symbol === item?.symbol) :
      (selectedChain?.chain_id === item?.chain_id);
    setSelected(_selected);

    let _obj;
    if (isAsset) {
      _obj = {
        title: item.name,
        imageUrl: item.logo_url,
        coinMainAmount: item.total_balance,
        coinSubAmount: item.total_quote_balance,
        unit: item.symbol,
      };
    } else {
      let title = item.chain_name;
      let unit = item.contract_ticker_symbol;
      let imageUrl = app[env === 'DEV' ? 'test_net_providers' : 'mainnet_provider_urls'][`${item.chain_id}`]?.image_url;
      _obj = {
        title: title,
        imageUrl: imageUrl,
        coinMainAmount: 0,
        coinSubAmount: 0,
        unit,
      };
    }

    setObj(_obj);
  }, [isAsset, selectedAsset, selectedChain, item, app]);

  return (
    <TouchableOpacity
      onPress={() => {
        if (isAsset) {
          setSelectedAsset(item);
          setSelectedChain(item.chains[0]);
        } else {
          setSelectedChain(item);
        }
        sheetRef?.current?.close();
      }}
      style={[styles.walletItemContainer]}>
      <View style={styles.leftView}>
        <CustomImage style={styles.iconStyle} uri={obj.imageUrl} />
        <Text style={styles.coinName}>{obj?.title}</Text>
      </View>
      <View style={styles.rightView}>
        {
          isAsset && (
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.coinAmountText}>
                {obj?.coinMainAmount > 1
                  ? obj?.coinMainAmount?.toLocaleString()
                  : obj?.coinMainAmount}{' '}
                {obj?.unit}
              </Text>
              <Text style={styles.coinInDollar}>
                ~${obj.coinSubAmount?.toFixed(2).toLocaleString()}
              </Text>
            </View>
          )
        }
        <View
          style={[
            styles.selectionView,
            {
              borderColor: selected ? colors.primaryBlue : '#DEE4F4',
            },
          ]}>
          {
            selected && (
              <View style={styles.activeRadio} />
            )
          }
        </View>
      </View>
    </TouchableOpacity>
  );
}

// create a component
const DropDownSheet = ({ isAsset, setSelectedAsset, setSelectedChain, selectedAsset, selectedChain, sheetRef, showOnlyWithChain }) => {

  const { balancePerCoin } = useSelector(st => st.wallet);
  const [searchText, setSearchText] = useState('');

  const data = useMemo(() => {
    if (isAsset) {
      let list = balancePerCoin;

      if (showOnlyWithChain) {
        list = list.filter(e => e.chains.length > 0);
      }

      if (searchText) {
        let searchTerm = searchText.toLowerCase();
        let _data = list.filter(e => e.name.toLowerCase().includes(searchTerm));
        return _data;
      } else {
        return list;
      }

    } else {
      let list = selectedAsset?.chains ?? [];
      if (searchText) {
        let searchTerm = searchText.toLowerCase();
        let _data = list.filter(e => e.name.toLowerCase().includes(searchTerm));
        return _data;
      } else {
        return list;
      }
    }
  }, [searchText, balancePerCoin, showOnlyWithChain, isAsset, selectedAsset?.chains]);

  return (
    <View style={{ marginTop: 15, paddingBottom: 40 }}>
      <Text style={styles.sheetTitle}>{isAsset ? getLocalText('Select Asset') : getLocalText('Select Chain')}</Text>
      <FlatList
        style={{ alignSelf: 'center', marginTop: 16 }}
        data={data}
        renderItem={({ item, index }) => (
          <RenderItem
            item={item}
            index={index}
            selectedAsset={selectedAsset}
            selectedChain={selectedChain}
            setSelectedAsset={setSelectedAsset}
            setSelectedChain={setSelectedChain}
            isAsset={isAsset}
            sheetRef={sheetRef}
          />
        )}
        ListHeaderComponent={
          <View style={searchStyles.container}>
            <Image source={icons.searchIcon} style={searchStyles.searchIconStyle} />
            <TextInput
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
              style={[searchStyles.searchInputStyle]}
              placeholder={isAsset ? 'Search Asset' : 'Search Chain'}
            />
          </View>
        }
      />
    </View>
  );
};


const searchStyles = StyleSheet.create({
  container: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFDFDF',
    backgroundColor: colors.primaryWhite,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('screen').width - 40,
    marginBottom: 10,
  },
  searchIconStyle: {
    height: 16,
    width: 16,
    marginRight: 8,
  },
  searchInputStyle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fonts.regular,
    color: colors.activeBlack,
    flex: 1
  },
});

//make this component available to the app
export default DropDownSheet;
