//import liraries
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {PermissionsAndroid, Platform} from 'react-native';
import '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';

import {icons} from '../../helper/iconConstant';
import {fontSize, hp, wp} from '../../helper/utils';
import {fonts} from '../../helper/fontconstant';
import {navigate} from '../../helper/rootNavigation';
import {colors} from '../../helper/colorConstants';
import {
  BalanceCard,
  DetailedHeader,
  HomeCard,
  InviteFriend,
} from '../../components';
import {useDispatch, useSelector} from 'react-redux';
import {getWalletBalance} from '../../redux/action/wallet';
import {updateUser} from '../../redux/action/user';
import {_fetch} from '../../utils/_fetch';
import {baseUrl2} from '../../utils/consts';
import { Star } from '../../helper/svgconstant';
import { getLocalText } from '../../helper/globalFunctions';

// create a component
const HomeScreen = () => {
  const walletData = useSelector(st => st.wallet);
  const allChain = useSelector(st => st.chain);
  const user = useSelector(st => st.user);
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(true);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    let token = '';
    if (enabled) {
      console.log('Authorization status:', authStatus);
      await messaging().registerDeviceForRemoteMessages();
      token = await messaging().getToken();
      console.log('Token #################');
      console.log(token);
    } else {
      if (Platform.OS === 'android') {
        let result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (result === 'granted') {
          await messaging().registerDeviceForRemoteMessages();
          token = await messaging().getToken();
        }
      }
    }
    //publish the token to the server
    saveFcmToken(token);
    console.log('Token Saved', token);
  }

  async function saveFcmToken(fcmToken) {
    try {
      const obj = {
        fcm_token: fcmToken,
      };
      await _fetch(`${baseUrl2}/save_firebase_token`, {
        method: 'POST',
        body: obj,
        token: user.jwtToken,
      });
    } catch (err) {
      console.log(err);
    }
  }
  // async function connect(url) {

  //   const core = new Core({
  //     // @notice: If you want the debugger / logs
  //     logger: 'debug',
  //     projectId: 'ad0e11073efc174541ea39a40129ebb4',
  //     relayUrl: 'wss://relay.walletconnect.com',
  //   });

  //   const web3wallet = await Web3Wallet.init({
  //     core,
  //     metadata: {
  //       name: 'React Native Web3Wallet',
  //       description: 'ReactNative Web3Wallet',
  //       url: 'https://walletconnect.com/',
  //       icons: ['https://avatars.githubusercontent.com/u/37784886'],
  //     },
  //   });

  //   await core.pairing.pair({ uri: 'wc:ade1cb9a7a20527d2bc44134000932c518d51887774a8471885644045559d4ce@2?relay-protocol=irn&symKey=1a5b967720e68e482fb432d412f96f8e6a6fc9c339964e07469eead50d8509e1' });

  // }

  useEffect(
    () => {
      if (walletData.address?.length > 0 && allChain.allChains?.length > 0) {
        dispatch(getWalletBalance());
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletData.address, allChain.allChains],
  );

  async function saveAddress() {
    try {
      const obj = {
        address: walletData.address,
      };
      await _fetch(`${baseUrl2}/saveUserWalletAddress`, {
        method: 'POST',
        body: obj,
        token: user.jwtToken,
      });
    } catch (err) {
      console.log(err);
    }
  }
  async function fetchUserProfile() {
    try {
      let res = await _fetch(`${baseUrl2}/user_profile_details`, {
        method: 'POST',
        token: user.jwtToken,
      });
      res = await res.json();
      console.log(res);
      if (res.status === 200) {
        dispatch(updateUser(res.payload));
        if (!res.payload.is_wallet_addrresss_saved) {
          saveAddress();
        }
      } else {
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function init() {
      const show_balance = await AsyncStorage.getItem('show_balance');
      console.log(show_balance);
      setIsVisible(show_balance === '1' || show_balance === null);
    }
    if (!user.is_wallet_addrresss_saved) {
      fetchUserProfile();
    }
    requestUserPermission();
    init();
    // connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const amount = walletData.totalIdleDollarBalance;

  return (
    <View style={styles.container}>
      <DetailedHeader />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View
          style={styles.verticalPartition}>
          <BalanceCard
            amount={amount}
            changeAmount={walletData.change24H}
            isVisible={isVisible}
          />
        </View>
        <View style={styles.userNAmeView}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Star style={{ marginLeft: 16 }} />
          <Text style={styles.usernameText}>
            <Text style={styles.usernameStyle}>200 </Text>
            {getLocalText('lucky user to win upto')}{' '}
            <Text style={styles.usernameStyle}>
              {getLocalText('$20 rewards')}
            </Text>
          </Text>
        </View>
        {/* <ChevronRight style={{ marginRight: 16 }} /> */}
      </View>
        <View
          style={styles.verticalPartition}>
          <View style={styles.homeCardContainer}>
            <HomeCard
              onPress={() => navigate('BuyCrypto')}
              imageSource={icons.dollar}
              title={'Buy Crypto'}
              bgColor={'#E7FFF9'}
              contentColor={'#19A684'}
            />
            <HomeCard
              // key={index?.toString()}
              onPress={() => navigate('SwapScreen')}
              imageSource={icons.swap}
              title={'Swap Crypto'}
              bgColor={'#FFF4E6'}
              contentColor={'#FF8A00'}
            />
          </View>
          <View style={styles.homeCardContainer}>
            <HomeCard
              onPress={() => navigate('TransactionHistory')}
              Icon={
                <IconMCI
                  name="history"
                  size={25}
                  color="#0052FE"
                  style={styles.transactionIcon}
                />
              }
              title={'Transactions'}
              bgColor={'#F0F6FF'}
              contentColor={'#0052FE'}
            />
            <HomeCard
              onPress={() => navigate('Markets')}
              imageSource={icons.zigzag}
              title={'Markets'}
              bgColor="#F8F8F8"
              contentColor="#697E97"
            />
          </View>
        </View>
        <View
          style={styles.verticalPartition}>
          <InviteFriend />
        </View>
      </ScrollView>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: colors.primaryWhite,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: hp(20),
  },
  verticalPartition: {
    marginTop: hp(22),
    flex: 1,
    flexGrow: 1,
  },
  homeCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: wp(35),
    flex: 1,
    flexGrow: 1,
  },
  transactionIcon: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    marginBottom: 12,
  },
  userNAmeView: {
    height: hp(36),
    borderWidth: 1,
    marginTop: hp(16),
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp(24),
    justifyContent: 'space-between',
    borderColor: colors.borderColor,
  },
  starStyle: {
    width: 14,
    height: 20,
    marginLeft: wp(16),
  },
  usernameText: {
    fontSize: fontSize(14),
    fontFamily: fonts.interRegular,
    marginLeft: wp(8),
    color: colors.primaryText,
  },
  usernameStyle: {
    fontSize: fontSize(14),
    fontFamily: fonts.interBold,
    fontWeight: '600',
  },
  rightArrowStyle: {
    width: 6.3,
    height: 11.48,
    marginRight: wp(23.59),
  },
  cardFirstRow: {
    marginTop: 28,
    flexDirection: 'row',
    marginHorizontal: wp(10),
    justifyContent: 'space-between',
  },
  cardSecondRow: {
    marginTop: 12,
    flexDirection: 'row',
    marginHorizontal: wp(10),
    justifyContent: 'space-between',
  },
  successMessage: {
    marginTop: hp(5),
    alignSelf: 'center',
    color: colors.primaryBlack,
  },
});

//make this component available to the app
export default HomeScreen;
