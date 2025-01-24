//import liraries
import React, {Component, useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {MainHeader} from '../../components';
import {colors} from '../../helper/colorConstants';
import {fonts} from '../../helper/fontconstant';
import {icons} from '../../helper/iconConstant';
import {NoInternet} from '../../helper/svgconstant';
import {baseUrl2} from '../../utils/consts';
import {_fetch} from '../../utils/_fetch';

const ConcentricCircle = require('../../../assets/images/ConcentricCircle.png');

function NoNotification() {
  return (
    <View
      style={{alignSelf: 'center', justifyContent: 'center', marginTop: '40%'}}>
      <View style={{position: 'relative'}}>
        <Image source={ConcentricCircle} />
        <IconMCI
          name="history"
          color="white"
          size={100}
          style={{position: 'absolute', top: '35%', right: '35%'}}
        />
      </View>
      <Text style={styles.emptyStateTitle}>No Notifications Yet</Text>
    </View>
  );
}

// create a component
const NotificationScreen = () => {
  const dummyData = [
    {
      title: 'Swap',
      sent: '0.001 ETH',
      received: '123 USDC',
      changeSent: 0.001,
      changeReceived: 123,
      date: '10:30am',
    },
    {
      title: 'Received',
      received: '123 USDC',
      changeReceived: 123,
      date: '10:30am',
    },
    {
      title: 'Sent',
      sent: '0.001 ETH',
      changeSent: 0.001,
      date: '10:30am',
    },
    {
      title: 'Sent',
      sent: '0.001 ETH',
      changeSent: 0.001,
      date: '02/02/2023',
    },
    {
      title: 'Reward',
      sent: '0.001 ETH',
      changeSent: 0.001,
      date: '02/02/2023',
    },
  ];

  const [noti, setNoti] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    async () => {
      try {
        let res = await _fetch(`${baseUrl2}/get-notifications`);
        res = await res.json();
        if (res.status >= 200 && res.status < 300) {
          setNoti(res.data);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(true);
      }
    };
  }, []);

  const renderItem = ({item}) => (
    <View style={styles.notificationItemContainer}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>{item?.title}</Text>
        <View style={styles.saperatorView} />
        <Text style={styles.titleText}>{item?.date}</Text>
      </View>
      <View
        style={[
          styles.titleView,
          {justifyContent: 'space-between', marginTop: 2},
        ]}>
        <Text>
          You {item?.title} {item?.received || item?.sent}
        </Text>
        <View style={styles.titleView}>
          <Text>{item?.sent || item?.received}</Text>
          <Image
            source={
              item?.title === 'Received' || item?.title === 'Reward'
                ? icons.downArrow
                : icons.upArrow
            }
            style={styles.updownImage}
          />
        </View>
      </View>
      {item?.title === 'Swap' && (
        <View
          style={[
            styles.titleView,
            {justifyContent: 'space-between', marginTop: 0},
          ]}>
          <Text>You received 123 USDC</Text>
          <View style={styles.titleView}>
            <Text>123 USDC </Text>
            <Image source={icons.downArrow} style={styles.updownImage} />
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <MainHeader title={'Notifications'} />
      <View style={styles.separatorStyle} />
      <FlatList
        data={noti}
        keyExtractor={(item, index) => index?.toString()}
        renderItem={renderItem}
        contentContainerStyle={{justifyContent: 'center'}}
        ListEmptyComponent={<NoNotification />}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
  },
  separatorStyle: {
    height: 1.5,
    backgroundColor: '#DFDFDF',
    marginTop: 15,
  },
  notificationItemContainer: {
    marginHorizontal: 24,
    marginVertical: 16,
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.activeBlack,
  },
  saperatorView: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: colors.activeBlack,
    marginHorizontal: 5,
    marginTop: 1,
  },
  emptyStateTitle: {
    fontSize: 24,
    color: colors.darkBlack,
    fontFamily: fonts.regular,
    fontWeight: '600',
    marginTop: 33,
    textAlign: 'center',
  },
  updownImage: {height: 20, width: 20, marginHorizontal: 4},
});

//make this component available to the app
export default NotificationScreen;
