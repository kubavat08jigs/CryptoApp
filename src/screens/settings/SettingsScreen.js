//import liraries
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Modal,
  Dimensions,
  Linking,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';

import { CText, DetailedHeader, Switch } from '../../components';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { icons } from '../../helper/iconConstant';
import { navigate, resetNavigationStack } from '../../helper/rootNavigation';
import { appVersion, linkedin, telegram, twitter } from '../../utils/consts';
import PrimaryButton from '../../components/Common/PrimaryButton';
import { clearAsyncStorage } from '../../helper/globalFunctions';
import { logout } from '../../redux/action/user';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import Unlock from '../Lock/Unlock';
import SetPin from '../Lock/SetPin';
import { showZeroBalance } from '../../redux/action/app';
import { getWalletBalance } from '../../redux/action/wallet';
import Passcode from '../Lock/Passcode';

const rnBiometrics = new ReactNativeBiometrics();
// create a component
const SettingsScreen = () => {

  const [toggleSwitch, setToggleSwitch] = useState(true);
  const [isBioEnabled, setIsBioEnabled] = useState(false);
  const [isPinSet, setIsPinSet] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const { zeroBalanceVisible } = useSelector(st => st.app);
  const [openUnlock, setOpenUnlock] = useState(false);
  const [opneSetPin, setOpenSetPin] = useState(false);
  const [openPasscode, setOpenPasscode] = useState(false);

  const onSwitchPress = () => {
    setToggleSwitch(!toggleSwitch);
  };

  const setBioOption = async val => {
    try {
      if (val === 'true') {
        const { biometryType } = await rnBiometrics.isSensorAvailable();
        console.log(biometryType)
        if (biometryType.available === false) {
          const jsonValue = JSON.stringify('false');
          await AsyncStorage.setItem('@dolf-isBioEnabled', jsonValue);
          return;
        }
        const { success } = await rnBiometrics.simplePrompt({ promptMessage: 'Authenticate using Biometrics' });
        if (success) {
          await AsyncStorage.setItem('@dolf-isBioEnabled', 'true');
        } else {
          console.log('Biometrics authentication failed');
        }
      }
      const jsonValue = JSON.stringify(val);
      await AsyncStorage.setItem('@dolf-isBioEnabled', jsonValue);
      setIsBioEnabled(val);
    } catch (e) {
      // Toast.show({
      //   type: 'error',
      //   text1: 'Some error occurred while enabling biometrics',
      // });
      ToastAndroid.show('Some error occurred while enabling biometrics', ToastAndroid.SHORT);
      console.log('Error Saving the Option');
    }
  };

  const getBioOption = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@dolf-isBioEnabled');
      const value = jsonValue != null ? JSON.parse(jsonValue) : 'false';
      setIsBioEnabled(value);
    } catch (e) {
      console.log('Error getting the Option');
    }
  };

  const checkPINStatus = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@dolf-lock-pin');
      if (jsonValue !== null) {
        setIsPinSet(true);
      } else {
        setIsPinSet(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const securityData = [
    {
      id: 1,
      title: 'Recovery Key',
      isSwitch: false,
      onPress: () => {
        console.log('Open pass code');
        setOpenPasscode(true);
      },
    },
    {
      id: 2,
      title: 'Biometrics',
      isSwitch: true,
      toggleSwitch: isBioEnabled === 'true',
      onPress: () => {
        setBioOption(isBioEnabled === 'true' ? 'false' : 'true');
      },
    },
    {
      id: 3,
      title: isPinSet ? 'Change PIN' : 'Set PIN',
      isSwitch: false,
      onPress: () => {
        isPinSet
          ? setOpenUnlock(true)
          : setOpenSetPin(true)
      },
    },
  ];

  const networkData = [
    {
      id: 1,
      title: 'Add Token',
      isSwitch: false,
      onPress: () => {
        navigate('AddToken');
      },
    },
    {
      id: 2,
      title: 'Remove Token',
      isSwitch: false,
      onPress: () => {
        navigate('RemoveToken');
      },
    },
    // {
    //   id: 3,
    //   title: 'Networks',
    //   isSwitch: false,
    //   onPress: () => {
    //     navigate('Networks');
    //   },
    // },
    {
      id: 4,
      title: 'Hide Zero Balance',
      isSwitch: true,
      toggleSwitch: zeroBalanceVisible === '0',
      onPress: async () => {
        dispatch(showZeroBalance(zeroBalanceVisible === '1' ? '0' : '1'));
        if (zeroBalanceVisible === '0') {
          await AsyncStorage.setItem('show_balance', '1');
          dispatch(getWalletBalance());
        } else {
          await AsyncStorage.setItem('show_balance', '0');
          dispatch(getWalletBalance());
        }
      },
    },
    // {
    //   id: 5,
    //   title: 'Connected Dapps',
    //   isSwitch: false,
    //   onPress: () => {
    //     navigate('ConnectedApps');
    //   },
    // },
  ];

  const OptionsMainView = ({ data, title }) => {
    return (
      <View style={styles.optionViewCcontainer}>
        <CText txt={title} b />
        <View style={styles.listStyle}>
          {
            data.map((item, i) => (
              <View key={item?.title}>
                <TouchableOpacity onPress={item?.onPress} style={styles.itemContainer}>
                  <CText txt={item?.title} m textStyle={{ color: '#565454' }} />
                  {item?.isSwitch ? (
                    <Switch
                      toggleSwitch={item?.toggleSwitch}
                      onSwitchPress={item?.onPress}
                      switchContainer={{ marginHorizontal: 0 }}
                      isGray
                    />
                  ) : (
                    <Image source={icons.downIndicator} style={styles.rightIconStyle} />

                  )}
                </TouchableOpacity>
                {i < data.length - 1 ?
                  <View style={{ borderBottomColor: colors.lightgrey, borderBottomWidth: 1, marginHorizontal: 15 }}></View> : null
                }
              </View>
            ))
          }
        </View>
      </View>
    );
  };

  useEffect(() => {
    getBioOption();
    checkPINStatus();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <DetailedHeader />
        {/* <OptionsMainView data={generalData} title={'General'} /> */}
        <OptionsMainView data={securityData} title={'Security'} />
        <OptionsMainView data={networkData} title={'Network'} />
      </View>
      <View>
        <PrimaryButton
          title="Get Support"
          containerStyle={styles.logout} titleStyle={[styles.logoutText, { color: colors.primaryBlue }]}
          onPress={() => {
            setModalVisible(true);
          }}
        />
        <PrimaryButton
          title="Logout"
          containerStyle={styles.logout} titleStyle={styles.logoutText}
          onPress={() => {
            console.log('logging out');
            clearAsyncStorage('privateKey');
            clearAsyncStorage('dappShare');
            dispatch(logout());
            resetNavigationStack('Landing');
          }}
        />
        <View style={styles.versionView}>
          <CText txt={`App Version  ${appVersion}`} textStyle={styles.appVersionText} />
          <View style={styles.linkView}>
            <TouchableOpacity onPress={() => { Linking.openURL(telegram); }}>
              <Image source={icons.telegram} style={styles.socialIconStyle} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { Linking.openURL(twitter); }}>
              <Image source={icons.twitter} style={styles.socialIconStyle} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { Linking.openURL(linkedin); }}>
              <Image source={icons.linkedin} style={styles.socialIconStyle} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal visible={modalVisible} transparent>
        <Pressable
          onPress={() => setModalVisible(false)}
          style={{
            backgroundColor: '#00000050',
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').height,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: Dimensions.get('screen').width * 0.9,
              padding: 15,
              backgroundColor: 'white',
              borderRadius: 10,
            }}>
            <Text style={{ marginBottom: 5, color: '#000', textAlign: 'center' }}>
              For any queries or questions please reach out to us on
            </Text>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString("support@dolf.finance");
                Linking.openURL('mailto:support@dolf.finance')
              }}
            >
              <Text
                style={{
                  marginBottom: 5,
                  color: '#000',
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: '600',
                  textDecorationLine: "underline"
                }}>
                support@dolf.finance
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      {
        (openUnlock || opneSetPin) &&
        <Modal
          animationType='slide'
          visible={openUnlock || opneSetPin} onRequestClose={() => {
            setOpenUnlock(false); setOpenUnlock(false);
          }}>
          {
            openUnlock ?
              <Unlock
                onSuccess={() => {
                  setOpenSetPin(true);
                  setOpenUnlock(false);
                }}
              />
              : opneSetPin &&
              <SetPin
                onSuccess={() => {
                  setOpenSetPin(false);
                }}
              />
          }

        </Modal>
      }

      {
        openPasscode &&
        <Modal visible={openPasscode} animationType="slide" onRequestClose={() => setOpenPasscode(false)}>
          <View style={styles.container}>
            <Passcode type="unlock"
              onSuccess={async () => {
                setOpenPasscode(false);
                navigate('RecoveryKey');
              }}
            />
          </View>
        </Modal>
      }

    </ScrollView >
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: colors.primaryWhite,
    height: '100%',
    justifyContent: "space-between"
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 9.5,
  },
  rightIconStyle: {
    width: 9,
    height: 5,
    tintColor: '#565454',
    transform: [{ rotate: '-90deg' }],
  },
  optionViewCcontainer: {
    marginHorizontal: 24,
    marginTop: 21,
  },
  listStyle: {
    marginTop: 8,
    backgroundColor: '#F8FAFE',
    paddingVertical: 8,
    borderRadius: 8,
  },
  versionView: {
    width: "100%",
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: "space-around",
    marginTop: 30,
  },
  linkView: {
    flexDirection: 'row',
    marginTop: 10
  },
  appVersionText: {
    fontSize: 10,
    color: '#515151',
    fontFamily: fonts.regular,
  },
  socialIconStyle: {
    height: 16,
    width: 16,
    marginHorizontal: 13
  },
  logout: {
    marginBottom: 0,
    marginVertical: 15,
    backgroundColor: colors.grey
  },
  logoutText: {
    color: colors.errorText,
    fontSize: 16
  }
});

//make this component available to the app
export default SettingsScreen;