//import liraries
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';

import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { getLocalText } from '../../helper/globalFunctions';
import { fontSize, hp, isIos, statusBarHeight, wp } from '../../helper/utils';
import { navigate } from '../../helper/rootNavigation';
import { Book, NotificationBell, NotificationBellPlain } from '../../helper/svgconstant';
import Clipboard from '@react-native-clipboard/clipboard';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';

// create a component
const DetailedHeader = () => {

  const { address } = useSelector(st => st.wallet);

  const userName =
    address === ''
      ? 'Dolf'
      : address.substring(0, 4) +
      '...' +
      address.substring(address.length - 4);

  return (
    <View style={styles.headerView}>
      <View>
        <Text style={styles.headerGreetingText}>{getLocalText('Hello')}</Text>
        <Text
          onPress={() => { Clipboard.setString(address); ToastAndroid.show('Copied!!', ToastAndroid.SHORT) }}
          style={styles.headertitleText}
        >{userName}</Text>
      </View>
      <View style={styles.headerIconView}>
        <TouchableOpacity onPress={() => navigate('NotificationScreen')}>
          <NotificationBellPlain />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate('TransactionHistory')} style={{ marginLeft: 10 }}>
          <IconMCI name="history" size={30} color={colors.darkBlack} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  headerView: {
    marginTop: isIos ? statusBarHeight : hp(47) - statusBarHeight,
    flexDirection: 'row',
    marginHorizontal: wp(25),
    justifyContent: 'space-between',
  },
  headerGreetingText: {
    fontSize: fontSize(16),
    color: colors.primaryText,
    fontFamily: fonts.regular,
  },
  headertitleText: {
    fontSize: fontSize(20),
    color: colors.darkBlack,
    fontFamily: fonts.medium,
  },
  headerIconView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

//make this component available to the app
export default DetailedHeader;
