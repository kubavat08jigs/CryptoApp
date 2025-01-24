/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import { Image, View, Pressable, Dimensions, Text, FlatList, TouchableOpacity, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';
import RBSheet from 'react-native-raw-bottom-sheet';
import { PrimaryButton } from '../../components';
import { colors } from '../../helper/colorConstants';
import { icons } from '../../helper/iconConstant';
import { hp, wp, isIos } from '../../helper/utils';
import styles from './styles';

const rnBiometrics = new ReactNativeBiometrics();

export default function Passcode({ type = 'unlock', onSuccess = () => { } }) {
  const [_error, setError] = useState('');
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [storedPasscode, setStoredPasscode] = useState('');
  const [isBioEnabled, setIsBioEnabled] = useState(false);
  const [activeBottomSheet, setActiveBottomSheet] = useState(0);
  const sheetRef = useRef();

  useEffect(() => {
    if (type === 'unlock') {
      getKey();
      getBioOption();
    }
    const appStateListener = AppState.addEventListener('change', state => {
      console.log(state);
      if (state === 'active') {
        // console.log("skjfsgdj")
        getBioOption();
      }
      if (state === 'background') {
        setError('');
        setPasscode('');
        setConfirmPasscode('');
      }
    });
    return () => appStateListener.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const storeKey = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@dolf-lock-pin', jsonValue);
    } catch (e) {
      setError('Error saving passcode');
      setPasscode('');
      setConfirmPasscode('');
    }
  };
  const getKey = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@dolf-lock-pin');
      const value = jsonValue != null ? JSON.parse(jsonValue) : null;
      setStoredPasscode(value);
    } catch (e) {
      setError('Error getting passcode');
      setPasscode('');
      setConfirmPasscode('');
    }
  };

  const getBioOption = async () => {
    try {
      const jsonValue = JSON.parse(await AsyncStorage.getItem('@dolf-isBioEnabled'));
      setIsBioEnabled(JSON.parse(jsonValue));
      console.log(jsonValue);
      if (jsonValue) { handleBiometrics(); }
    } catch (e) {
      console.log('Error getting the Option');
    }
  };

  const setBioOption = async val => {
    try {
      if (val === 'true') {
        const { biometryType } = await rnBiometrics.isSensorAvailable();
        if (biometryType.available === false) {
          setError('Biometrics not available');
          const jsonValue = JSON.stringify('false');
          await AsyncStorage.setItem('@dolf-isBioEnabled', jsonValue);
          return;
        }
        const { success } = await rnBiometrics.simplePrompt({ promptMessage: 'Authenticate using Biometrics' });
        if (success) {
          setError('');
          console.log("skufhsfjusd")
        } else {
          setError('Biometrics authentication failed');
        }
      }
      const jsonValue = JSON.stringify(val);
      await AsyncStorage.setItem('@dolf-isBioEnabled', jsonValue);
      setIsBioEnabled(val === 'true');
    } catch (e) {
      console.log('Error Saving the Option');
    }
  };

  const handleBiometrics = async () => {
    const { biometryType } = await rnBiometrics.isSensorAvailable();

    // console.log('biometryType', biometryType);

    if (biometryType.available === false) {
      setError('Biometrics not available');
    } else {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate using Biometrics',
      });

      if (success) {
        onSuccess();
        setError('');
        console.log('Biometrics authentication successful');
        return;
      } else {
        setError('Biometrics authentication failed');
      }
    }
  };

  const emptyDot = () => (
    <View
      style={{
        height: 15,
        width: 15,
        borderRadius: 8,
        backgroundColor: 'transparent',
        marginHorizontal: 8,
        borderWidth: 2,
        borderColor: _error.length > 0 ? 'red' : '#808588',
      }}
    />
  );

  const filledDot = () => (
    <View
      style={{
        height: 15,
        width: 15,
        borderRadius: 8,
        backgroundColor: colors.primaryBlue,
        marginHorizontal: 8,
        borderWidth: 2,
        borderColor: colors.primaryBlue,
      }}
    />
  );

  const renderResetSheetContent = () => (
    <View style={{ alignItems: 'center' }}>
      <Image
        source={icons.unlockIcon}
        style={{ height: 120, width: 120, marginTop: 22, alignSelf: 'center' }}
      />
      <Text style={styles.btmsheetTitle}>Reset PIN</Text>
      <Text style={styles.btmsheetDesc}>Do you want to reset your PIN?</Text>
      <View style={styles.btnView}>
        <PrimaryButton
          title={'No'}
          onPress={() => sheetRef.current.close()}
          containerStyle={styles.cancelBtnStyle}
          titleStyle={{ color: colors.primaryBlue }}
        />
        <PrimaryButton
          onPress={() => {
            setPasscode('');
            setConfirmPasscode('');
            setError('');
            sheetRef.current.close();
          }}
          title={'Yes'}
          containerStyle={styles.approveBtnStyle}
        />
      </View>
    </View>
  );

  const renderFingerPrintSheetContent = () => (
    <View style={{ alignItems: 'center' }}>
      <Image
        source={icons.fingerPrint}
        style={{ height: 120, width: 120, marginTop: 22, alignSelf: 'center' }}
      />
      <Text style={styles.btmsheetTitle}>Biometric Authentication</Text>
      <Text style={styles.btmsheetDesc}>
        {'Enable biometric authentication for\nfaster access'}
      </Text>
      <View style={styles.btnView}>
        <PrimaryButton
          title={'No'}
          onPress={() => {
            sheetRef.current.close();
          }}
          containerStyle={styles.cancelBtnStyle}
          titleStyle={{ color: colors.primaryBlue }}
        />
        <PrimaryButton
          onPress={() => {
            setBioOption('true');
            sheetRef.current.close();
          }}
          title={'Yes'}
          containerStyle={styles.approveBtnStyle}
        />
      </View>
    </View>
  );

  const renderFaceSheetContent = () => (
    <View style={{ alignItems: 'center' }}>
      <Image
        source={icons.faceIDIcon}
        style={{ height: 120, width: 120, marginTop: 22, alignSelf: 'center' }}
      />
      <Text style={styles.btmsheetTitle}>Face ID Authentication</Text>
      <Text style={styles.btmsheetDesc}>
        {'Do you want to enable Face ID for faster\naccess'}
      </Text>
      <View style={styles.btnView}>
        <PrimaryButton
          title={'No'}
          onPress={() => sheetRef.current.close()}
          containerStyle={styles.cancelBtnStyle}
          titleStyle={{ color: colors.primaryBlue }}
        />
        <PrimaryButton
          onPress={() => {
            setBioOption('true');
            sheetRef.current.close();
          }}
          title={'Yes'}
          containerStyle={styles.approveBtnStyle}
        />
      </View>
    </View>
  );

  const renderPinSuccessSheet = () => (
    <View style={{ alignItems: 'center' }}>
      <Image
        source={icons.rightPINIcon}
        style={{ height: 120, width: 120, marginTop: 22, alignSelf: 'center' }}
      />
      <Text style={styles.btmsheetTitle}>PIN set successfully</Text>
      <PrimaryButton
        title={'Continue'}
        onPress={() => {
          onSuccess();
          sheetRef.current.close();
        }}
        iconSrc={icons.fi_arrow_right}
        containerStyle={[styles.approveBtnStyle, { width: 340, marginTop: 32 }]}
      />
    </View>
  );

  return (
    <View
      style={styles}>
      <Image
        source={icons.lockIcon}
        style={{
          marginTop: 28,
          alignSelf: 'center',
          height: hp(144),
          width: hp(144),
        }}
      />
      <Text
        style={styles.enternumText}>
        {type === 'set' ? 'Set PIN' : 'Enter PIN'}
      </Text>
      <Text
        style={styles.addnumberDesc}>
        {type === 'set'
          ? passcode.length === 4
            ? 'Re-enter your new PIN'
            : 'Enter your new PIN'
          : 'Enter your PIN code'}
      </Text>
      <Text
        style={styles.incorrectText}>
        {_error.length > 0 ? _error : ''}
      </Text>
      <View style={{
        marginTop: 15,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {passcode.length !== 4
            ? passcode.length > 0
              ? filledDot()
              : emptyDot()
            : confirmPasscode.length > 0
              ? filledDot()
              : emptyDot()}
          {passcode.length !== 4
            ? passcode.length > 1
              ? filledDot()
              : emptyDot()
            : confirmPasscode.length > 1
              ? filledDot()
              : emptyDot()}
          {passcode.length !== 4
            ? passcode.length > 2
              ? filledDot()
              : emptyDot()
            : confirmPasscode.length > 2
              ? filledDot()
              : emptyDot()}
          {passcode.length !== 4
            ? passcode.length > 3
              ? filledDot()
              : emptyDot()
            : confirmPasscode.length > 3
              ? filledDot()
              : emptyDot()}
        </View>
      </View>
      <View style={styles.numpadContainer}>
        <FlatList
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          style={{
            maxHeight: 370,
          }}
          numColumns={3}
          keyExtractor={(item, index) => index?.toString()}
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 12]}
          renderItem={({ item, index }) => {
            return (
              <Pressable
                android_ripple={{
                  color: colors.primaryBlue
                }}
                style={[
                  styles.numpadItem
                ]}
                onPress={() => {
                  setError('');
                  if (item !== 10 && item !== 12) {
                    if (type === 'set') {
                      if (passcode.length < 4) {
                        setPasscode(passcode + item);
                      } else if (confirmPasscode.length < 4) {
                        setConfirmPasscode(confirmPasscode + item);
                        if (confirmPasscode.length === 3) {
                          if (passcode === confirmPasscode + item) {
                            storeKey(passcode);
                            setActiveBottomSheet(4);
                            sheetRef.current.open();
                            setError('');
                          } else {
                            setError('PIN does not match');
                          }
                          setConfirmPasscode('');
                        }
                      }
                    } else if (type === 'unlock') {
                      if (passcode.length < 4) {
                        setPasscode(passcode + item);
                      }
                      if (passcode.length === 3) {
                        if (passcode + item === storedPasscode) {
                          onSuccess();
                          setError('');
                        } else {
                          setError('Incorrect PIN');
                        }
                        setPasscode('');
                        setConfirmPasscode('');
                      }
                    }
                  } else if (item === 10) {
                    if (type === 'set' && passcode.length > 0) {
                      setActiveBottomSheet(1);
                      sheetRef.current.open();

                    } else if (type === 'unlock') {
                      if (isBioEnabled) {
                        handleBiometrics();
                      } else {
                        if (isIos) {
                          setActiveBottomSheet(3);
                          sheetRef.current.open();
                        } else {
                          setActiveBottomSheet(2);
                          sheetRef.current.open();
                        }
                      }
                    }
                  } else if (item === 12) {
                    if (type === 'unlock') {
                      setPasscode(passcode.slice(0, -1));
                    } else {
                      passcode.length === 4
                        ? setConfirmPasscode(confirmPasscode.slice(0, -1))
                        : setPasscode(passcode.slice(0, -1));
                    }
                  }
                }}>
                {item !== 10 && item !== 12 && (
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: '600',
                      color: colors.activeBlack
                    }}>
                    {item}
                  </Text>
                )}
                {item === 12 && (
                  <Image
                    source={icons.backspace}
                    style={{ width: 24, height: 24 }}
                  />
                )}
                {item === 10 && type === 'set' && passcode.length > 0 && (
                  <Text style={styles.resetText}>Reset</Text>
                )}
                {item === 10 && type === 'unlock' && !isIos && isBioEnabled && (
                  <Image
                    source={icons.fingerPrint}
                    style={{ width: 70, height: 70 }}
                  />
                )}
                {item === 10 && type === 'unlock' && isIos && isBioEnabled && (
                  <Image
                    source={icons.faceIDIcon}
                    style={{ width: 70, height: 70 }}
                  />
                )}
              </Pressable>
            );
          }}
        />
      </View>
      <RBSheet
        ref={sheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        onClose={() => {
          if (activeBottomSheet === 4) {
            onSuccess();
          }
          setActiveBottomSheet(0);
        }}
        animationType="slide"
        customStyles={{
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 'auto',
            borderWidth: 1,
          },
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: '#EDF0F8',
          },
        }}>
        {activeBottomSheet === 1 && renderResetSheetContent()}
        {activeBottomSheet === 2 && renderFingerPrintSheetContent()}
        {activeBottomSheet === 3 && renderFaceSheetContent()}
        {activeBottomSheet === 4 && renderPinSuccessSheet()}
      </RBSheet>
    </View>
  );
}
