//import liraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { CText, CustomTab, MainHeader } from '../../components';
import CustomImage from '../../components/Common/Image';
import { colors } from '../../helper/colorConstants';
import { icons } from '../../helper/iconConstant';
import { navigate } from '../../helper/rootNavigation';
import { baseUrl2, dolfLocale } from '../../utils/consts';
import useFetch from '../../utils/_fetch';
import Loader from '../../components/Loader';

// create a component
const Markets = () => {

  const [activeTeb, setActiveTab] = useState(1);
  const [marketData, setMarketData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [stared, setStared] = useState([]);
  const [loading, setLoading] = useState(false);
  const _fetch = useFetch();

  const allowBuy = [1, 1027, 825, 1839, 3408, 52];

  console.log(dolfLocale());

  async function init() {
    try {
      setLoading(true);
      let res = await _fetch(`${baseUrl2}/getRankVolumeMarketData`);
      console.log('Market data response ->',res);
      if (res.status === 200) {
        res = await res.json();
        console.log('res.payload.market_cap_data->',res.payload.market_cap_data);
        setMarketData(res.payload.market_cap_data ?? []);
        setVolumeData(res.payload.volume_24h_data ?? []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function getStared() {
    let _stared = JSON.parse(await AsyncStorage.getItem('stared'));
    if (Array.isArray(_stared)) {
      console.log(_stared);
      setStared(_stared);
    }
  }

  async function star(id) {
    let _stared = JSON.parse(await AsyncStorage.getItem('stared'));
    if (Array.isArray(_stared) && _stared.length) {
      _stared.push(id);
    } else {
      _stared = [id];
    }
    setStared(_stared);
    await AsyncStorage.setItem('stared', JSON.stringify(_stared));
  }

  async function unStar(id) {
    console.log(id);
    let _stared = JSON.parse(await AsyncStorage.getItem('stared'));
    console.log(_stared);
    if (Array.isArray(_stared)) {
      let ind = _stared.findIndex(e => e === id);
      if (ind === undefined || ind < 0) return;
      _stared.splice(ind, 1);
      setStared(_stared);
      await AsyncStorage.setItem('stared', JSON.stringify(_stared));
    }
  }

  useEffect(() => {
    init();
    getStared();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={styles.marketItem}>
      <TouchableOpacity
        onPress={() => stared.includes(item.id) ? unStar(item.id) : star(item.id)}
        style={styles.itemLeftView}>
        <Image
          source={stared.includes(item.id) ? icons.activeStar : icons.inactiveStar}
          style={styles.itemStarStyle}
        />
        <CustomImage uri={item?.logo_url} style={styles.itemIconStyle} />
        <View>
          <CText txt={item?.name} m />
          <CText txt={item?.symbol} m g />
        </View>
      </TouchableOpacity>
      <View style={styles.itemRightView}>
        <View>
          <CText txt={`$${item.quote.price.toLocaleString(dolfLocale(), { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`} m />
          <View style={styles.upDownnView}>
            <Image
              source={
                item.quote.percent_change_24h >= 0 ? icons.upArrow : icons.downArrow
              }
              style={[
                styles.updownArrowIcon,
                {
                  tintColor: item?.quote.percent_change_24h >= 0
                    ? colors.primaryGreen
                    : colors.errorText,
                },
              ]}
            />
            {item.quote.percent_change_24h >= 0 ? (
              <CText txt={`${(item.quote.percent_change_24h).toFixed(2)}%`} m s />
            ) : (
              <CText txt={`${(item.quote.percent_change_24h).toFixed(2)}%`} m e />
            )}
          </View>
        </View>
        {
          allowBuy.includes(item.id) &&
          <TouchableOpacity style={styles.buybtnView} onPress={() => navigate('BuyCrypto')}>
            <CText txt={'Buy'} sf g />
          </TouchableOpacity>
        }
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <MainHeader title={'Markets'} />
      <CustomTab
        tabData={['Watchlist', 'Market Cap', 'Volume']}
        defaultActiveTab={1}
        setTabActive={setActiveTab}
      />
      <View style={styles.subHeaderMain}>
        <CText txt={'Assets'} sf />
        <CText txt={'Price/24H Change'} sf />
      </View>
      {
        loading ? <Loader size={75} height="60%" /> :

          <FlatList
            contentContainerStyle={{ paddingBottom: 10 }}
            data={
              activeTeb === 1 ? marketData : (activeTeb === 2 ? volumeData : marketData?.filter(i => stared.includes(i?.id)))
            }
            keyExtractor={(item, index) => index?.toString()}
            renderItem={renderItem}
            ListFooterComponent={<View style={{ height: 20 }} />}
          />
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
  subHeaderMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 19,
  },
  // assetsText: {
  //   marginLeft: 77,
  // },
  marketItem: {
    height: 60,
    marginHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: '#F8FAFE',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  itemLeftView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemStarStyle: {
    width: 12,
    height: 12,
  },
  itemIconStyle: {
    width: 32,
    height: 32,
    marginHorizontal: 8,
  },
  itemRightView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buybtnView: {
    width: 48,
    height: 33,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: colors.primaryWhite,
    marginLeft: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upDownnView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  updownArrowIcon: {
    width: 6,
    height: 15,
    tintColor: colors.primaryGreen,
    marginRight: 4,
  },
});

//make this component available to the app
export default Markets;
