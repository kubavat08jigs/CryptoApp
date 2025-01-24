//import liraries
import React, { Component, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getDeviceName } from 'react-native-device-info';
import { CText, MainHeader } from '../../components';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { icons } from '../../helper/iconConstant';
import { navigate } from '../../helper/rootNavigation';
import { hp, wp } from '../../helper/utils';
import { baseUrl2 } from '../../utils/consts';
import { _fetch } from '../../utils/_fetch';
import { useSelector } from 'react-redux';

// create a component
const RecoveryKey = () => {
  const [deviceName, setDeviceName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const { jwtToken } = useSelector((state) => state.user);

  const init = async () => {
    try {
      getDeviceName().then((name) => {
        setDeviceName(name);
      });
      let res = await _fetch(`${baseUrl2}/user_profile_details`, {
        method: 'POST',
        body: {},
        token: jwtToken,
      });
      res = await res.json();
      // console.log(res);
      if (res.status === 200) {
        setEmail(res.payload?.email);
        setPhone(res.payload?.mobile);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const onShowPhrasePress = () => {
    navigate('SeedPhrase');
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <View style={styles.container}>
      <MainHeader title={'Recovery Key'} />
      <View style={styles.topView}>
        <Text style={styles.firstVieText}>
          {'If you switch devices, you can easily restore your wallet'}
        </Text>
        {/* <TouchableOpacity style={styles.learnMoreView}>
          <Text style={styles.firstVieText}>Learn More</Text>
        </TouchableOpacity> */}
      </View>
      <Text style={styles.secondViewTitle}>
        Multifactor Authenticated Accounts
      </Text>
      <View style={styles.secondView}>
        <View style={styles.accItem}>
          <View style={styles.iconContainer}>
            <Image source={icons.phone} style={styles.secondViewItemIcon} />
          </View>
          <Text style={styles.secondViewItemText}>{
            `Phone: ${phone}`
          }</Text>
        </View>
        <View style={styles.accItem}>
          <View style={styles.iconContainer}>
            <Image source={icons.mail} style={styles.secondViewItemIcon} />
          </View>
          <Text style={styles.secondViewItemText}>
            {
              `Email: ${email}`
            }
          </Text>
        </View>
        <View style={styles.accItem}>
          <View style={styles.iconContainer}>
            <Image source={icons.device} style={styles.secondViewItemIcon} />
          </View>
          <Text style={styles.secondViewItemText}>{
            `Device: ${deviceName}`
          }</Text>
        </View>
      </View>
      <Text style={styles.secondViewTitle}>Backup Private Key</Text>
      <TouchableOpacity onPress={onShowPhrasePress} style={styles.thirdView}>
        <Text style={styles.thirdViewText}>Show Private Key</Text>
        <Image source={icons.rightArrow} style={styles.rightArrowStyle} />
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
  },
  topView: {
    borderWidth: 1,
    marginTop: hp(26),
    height: hp(80),
    borderRadius: 12,
    marginHorizontal: wp(24),
    backgroundColor: '#F8FAFE',
    borderColor: colors.borderColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstVieText: {
    color: colors.primaryText,
    fontWeight: '600',
    fontFamily: fonts.bold,
  },
  learnMoreView: {
    width: wp(104),
    height: hp(36),
    borderRadius: 24,
    backgroundColor: colors.primaryWhite,
    borderWidth: 1,
    borderColor: colors.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  secondView: {
    borderWidth: 1,
    marginTop: hp(8),
    borderRadius: 12,
    marginHorizontal: wp(24),
    backgroundColor: '#F8FAFE',
    borderColor: colors.borderColor,
    paddingVertical: hp(18),
    paddingLeft: wp(20),
  },
  accItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(6.5),
  },
  iconContainer: {
    height: hp(36),
    width: hp(36),
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: colors.primaryWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondViewItemIcon: {
    height: 16,
    width: 16,
  },
  secondViewItemText: {
    color: colors.activeBlack,
    fontWeight: '500',
    fontFamily: fonts.regular,
    fontSize: 14,
    marginLeft: 8,
  },
  secondViewTitle: {
    color: colors.activeBlack,
    fontWeight: '700',
    fontFamily: fonts.bold,
    fontSize: 14,
    marginTop: hp(28),
    marginLeft: wp(25),
  },
  thirdView: {
    borderWidth: 1,
    marginTop: hp(26),
    height: hp(68),
    borderRadius: 12,
    marginHorizontal: wp(24),
    backgroundColor: '#F8FAFE',
    borderColor: colors.borderColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(20),
  },
  thirdViewText: {
    color: colors.darkBlack,
    fontWeight: '600',
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  rightArrowStyle: {
    width: 6.3,
    height: 11.48,
  },
});

//make this component available to the app
export default RecoveryKey;
