//import liraries
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import { SearchBar } from '../../components';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { getLocalText } from '../../helper/globalFunctions';
import { icons } from '../../helper/iconConstant';
import { hp } from '../../helper/utils';
import { styles } from './styles';

function RenderItem({ item, selectedAsset, selectedChain, isAsset, sheetRef, onItemPress }) {

  const [selected, setSelected] = useState(false);
  const [obj, setObj] = useState({
    title: '',
    imageUrl: '',
    coinMainAmount: 0,
    coinSubAmount: 0,
    unit: '',
  });

  useEffect(() => {

    let _selected = isAsset ?
      (selectedAsset?.address === item?.address) :
      (selectedChain?.chainId === item?.chainId);
    setSelected(_selected);

    let _obj;
    if (isAsset) {
      _obj = {
        title: item.name,
        imageUrl: item.logoURI,
        coinMainAmount: item.balance,
        coinSubAmount: item.quote,
        unit: item.symbol,
      };
    } else {
      let title = item.name;
      let unit = item.name;
      let imageUrl = item.imageUrl;
      _obj = {
        title: title,
        imageUrl: imageUrl,
        coinMainAmount: 0,
        coinSubAmount: 0,
        unit,
      };
    }

    setObj(_obj);
  }, [isAsset, selectedAsset, selectedChain, item]);

  return (
    <TouchableOpacity
      onPress={() => {
        onItemPress(item);
        sheetRef?.current?.close();
      }}
      style={[styles.walletItemContainer]}>
      <View style={[styles.leftView, { marginVertical: isAsset ? hp(23) : hp(13.5) }]}>
        {(obj.imageUrl || obj?.icon) && <Image style={styles.iconStyle} source={obj?.icon ?? { uri: obj.imageUrl }} />}
        <Text style={styles.coinName} numberOfLines={1} ellipsizeMode='tail'>{obj?.title}</Text>
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
                ~${obj.coinSubAmount?.toLocaleString()}
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
const SwapDropDownSheet = ({ isAsset, onItemPress, selectedAsset, selectedChain, sheetRef, assets }) => {

  console.log('ok');
  console.log(selectedChain);
  const [searchText, setSearchText] = useState('');

  const list = useMemo(() => {
    let _data;
    if (isAsset) {
      _data = (selectedChain ? (assets?.find(e => e.chain.chainId === selectedChain.chainId)?.tokens ?? []) : []).map(e => ({ ...e, search: e.name.toLowerCase() }));
    } else {
      _data = (assets?.map(e => e.chain) ?? []).map(e => ({ ...e, search: e.name.toLowerCase() }));
    }
    return _data;
  }, [assets, isAsset, selectedChain]);
  const data = useMemo(() => {
    if (searchText) {
      let searchTerm = searchText.toLowerCase();
      let _data = list.filter(e => e.search.includes(searchTerm));
      return _data;
    } else {
      return list;
    }
  }, [searchText, list]);

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
            onItemPress={onItemPress}
            isAsset={isAsset}
            sheetRef={sheetRef}
          />
        )}
        keyExtractor={(item, index) => `${item?.name}-${index}`}
        ListHeaderComponent={
          <View style={searchStyles.container}>
            <Image source={icons.searchIcon} style={searchStyles.searchIconStyle} />
            <TextInput
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
              style={[searchStyles.searchInputStyle]}
              placeholder='Search Asset'
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
export default SwapDropDownSheet;
