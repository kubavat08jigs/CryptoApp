//import liraries
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSelector } from 'react-redux';
import { SearchBar } from '../../components';
import CustomImage from '../../components/Common/Image';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { icons } from '../../helper/iconConstant';
import { goBack } from '../../helper/rootNavigation';
import { hp, isIos, statusBarHeight, wp } from '../../helper/utils';
import { env } from '../../utils/consts';

// create a component
const PortfolioList = ({ route }) => {


  const sheetTef = useRef();

  const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };

  const [toggleSwitch, setToggleSwitch] = useState(true);
  const [activeTeb, setActiveTab] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [searchList, setSearchList] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const app = useSelector(st => st.app);

  const sortOptionList = [
    {
      title: 'A-Z',
    },
    {
      title: 'Balance',
    },
  ];

  const onSortPress = () => {
    sheetTef?.current?.open();
  };

  const onSwitchPress = () => {
    setToggleSwitch(!toggleSwitch);
  };

  const onItemPress = i => {
    setSelectedItem(i);
  };

  useEffect(() => {
    let listData = JSON.parse(JSON.stringify(activeTeb === 1 ? route?.params?.data.balancePerCoin : route?.params?.data.balancePerChain));
    if (searchText?.length > 0) {
      listData = listData?.filter(i => {
        return i?.name?.toLowerCase()?.match(searchText?.toLowerCase());
      });
    } else if (selectedItem) {
      if (selectedItem === 'A-Z') {
        listData.sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0));
      } else {
        listData.sort((a, b) => b.total_quote_balance - a.total_quote_balance);
      }
      sheetTef.current?.close();
    }
    setSearchList(listData);
  }, [searchText, route?.params?.data, activeTeb, selectedItem]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.fundItemContainer}>
        <View style={styles.leftView}>
          <CustomImage style={styles.iconStyle} uri={activeTeb === 1 ? item?.logo_url : (app[env === 'DEV' ? 'test_net_providers' : 'mainnet_provider_urls'] ? app[env === 'DEV' ? 'test_net_providers' : 'mainnet_provider_urls'][`${item.chain_id}`]?.image_url : '')} />
          <Text style={styles.coinName}>{item?.name}</Text>
        </View>
        <View onPress={() => { }} style={styles.rightIconView}>
          <Text style={[styles.tabTitleText, { fontWeight: '700' }]}>
            {toggleSwitch ? item?.percentage?.toFixed(1) + '%' : `$${item?.total_quote_balance.toFixed(2)}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const RenderHeader = () => {
    return (
      <View style={styles.headerView}>
        <View style={styles.headerLeftView}>
          <TouchableOpacity onPress={goBack} hitSlop={hitSlop}>
            <Image
              source={icons.back}
              style={styles.backIcon}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <Text style={styles.titleText}>Portfolio</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.switchLEftText}>$</Text>
          <TouchableOpacity onPress={onSwitchPress} style={styles.switchView}>
            <View
              style={[
                styles.switchstyle,
                { alignSelf: toggleSwitch ? 'flex-end' : 'flex-start' },
              ]}></View>
          </TouchableOpacity>
          <Text style={styles.switchLEftText}>%</Text>
        </View>
      </View>
    );
  };

  const renderSortOptionItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        onItemPress(item?.title);
      }}
      style={[styles.walletItemContainer]}>
      <View style={styles.leftView}>
        <Text style={styles.coinName}>{item?.title}</Text>
      </View>
      <View style={styles.rightView}>
        <View
          style={[
            styles.selectionView,
            {
              borderColor:
                selectedItem === item?.title ? colors.primaryBlue : '#DEE4F4',
            },
          ]}>
          {selectedItem === item?.title && <View style={styles.activeRadio} />}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSortBottomSheet = () => (
    <View style={{ marginTop: 15, paddingBottom: 40 }}>
      <Text style={styles.sheetTitle}>Sort</Text>
      <FlatList
        style={{ alignSelf: 'center', marginTop: 16 }}
        data={sortOptionList}
        renderItem={renderSortOptionItem}
        keyExtractor={(item) => item.title}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <RenderHeader />
      <View style={styles.searchView}>
        <SearchBar
          value={searchText}
          onChangeText={txt => setSearchText(txt)}
          placeholder={'Search Asset'}
        />
        <TouchableOpacity onPress={onSortPress} style={styles.sortView}>
          <Image source={icons.sortArrows} style={styles.sortIcon} />
          <Text style={styles.sortText}>{selectedItem ? selectedItem : 'Sort'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.portfoliomainView}>
        <View style={styles.balanveTabView}>
          <TouchableOpacity
            onPress={() => setActiveTab(1)}
            style={[
              styles.tabOuterView,
              {
                borderBottomWidth: activeTeb === 1 ? 2 : 0,
              },
            ]}>
            <Text
              style={[
                styles.tabTitleText,
                { fontWeight: activeTeb === 1 ? '700' : '400' },
              ]}>
              By Asset
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab(2)}
            style={[
              styles.tabOuterView,
              {
                borderBottomWidth: activeTeb === 2 ? 2 : 0,
              },
            ]}>
            <Text
              style={[
                styles.tabTitleText,
                { fontWeight: activeTeb === 2 ? '700' : '400' },
              ]}>
              By Chains
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={searchList}
          extraData={searchList}
          renderItem={renderItem}
          // contentContainerStyle={{ height: 500 }}
          keyExtractor={(item) => item.dolfId}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
        {renderSortBottomSheet()}
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
  headerView: {
    marginHorizontal: wp(24),
    marginTop: isIos ? statusBarHeight : hp(47 - statusBarHeight),
    marginBottom: hp(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backIcon: {
    height: hp(15.5),
    width: wp(8.5),
  },
  headerLeftView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.primaryBlack,
    marginLeft: wp(21),
  },
  switchLEftText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    fontFamily: fonts.medium,
    color: colors.darkest,
  },
  switchView: {
    width: wp(36),
    height: hp(20),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D3D5DA',
    marginHorizontal: wp(6),
    justifyContent: 'center',
    paddingHorizontal: wp(2),
  },
  switchstyle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: colors.primaryBlue,
  },
  searchView: {
    flexDirection: 'row',
    marginTop: hp(32),
    marginHorizontal: wp(24),
    justifyContent: 'space-between',
  },
  sortView: {
    width: 124,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFDFDF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortIcon: {
    height: 16,
    width: 16,
    marginLeft: 20,
    marginRight: 4,
    tintColor: colors.textGrayColor,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fonts.regular,
    color: colors.textGrayColor,
  },
  portfoliomainView: {
    marginHorizontal: wp(24),
    borderWidth: 2,
    borderColor: colors.borderColor,
    borderRadius: 16,
    marginTop: hp(23),
    marginBottom: hp(8),
    paddingBottom: 12,
    height: "75%"
  },
  balanveTabView: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: colors.borderColor,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  tabOuterView: {
    height: 41,
    justifyContent: 'center',
    borderColor: colors.activeBlack,
  },
  tabTitleText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: fonts.regular,
    color: '#000000',
  },
  fundItemContainer: {
    borderWidth: 1,
    height: hp(64),
    borderRadius: 12,
    backgroundColor: '#F8FAFE',
    borderColor: colors.borderColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp(8),
    alignItems: 'center',
    marginTop: hp(8),
  },
  leftView: {
    flexDirection: 'row',
    marginLeft: wp(22),
    alignItems: 'center',
    flex: 1,
  },
  iconStyle: { width: 24, height: 24, marginRight: 8 },
  coinName: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.darkBlack,
    fontWeight: '500',
    width: wp(215),
  },
  rightIconView: {
    // marginRight: wp(30),
    // marginLeft: wp(15),
    height: 20,
    width: 60,
    justifyContent: 'center',
  },
  iconContainer: {
    width: hp(26),
    height: hp(26),
    borderRadius: hp(26) / 2,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(8),
  },
  iconbgStyle: {
    height: hp(18),
    width: hp(18),
  },
  sheetTitle: {
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.activeBlack,
  },
  walletItemContainer: {
    borderWidth: 1,
    height: hp(51),
    width: 342,
    borderRadius: 12,
    // backgroundColor: '#F8FAFE',
    borderColor: colors.borderColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
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
});

//make this component available to the app
export default PortfolioList;
