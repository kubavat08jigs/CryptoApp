//import liraries
import React, {Component, useRef, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {MainHeader, PrimaryButton, BottomSheetModal} from '../../components';
import {colors} from '../../helper/colorConstants';
import {fonts} from '../../helper/fontconstant';
import {hp, wp} from '../../helper/utils';

// create a component
const LanguageScreen = () => {
  const bottomSheetRef = useRef();

  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languageData = [
    {
      title: 'English (US)',
      value: 'en',
      country: 'Default',
      flag: '🇺🇸',
    },
    {
      title: 'Français',
      value: 'fr',
      country: 'French',
      flag: '🇫🇷',
    },
    {
      title: 'Deutsch',
      value: 'dt',
      country: 'German',
      flag: '🇩🇪',
    },
    {
      title: 'EItaliano',
      value: 'et',
      country: 'Italian',
      flag: '🇮🇹',
    },
    {
      title: 'Portugues',
      value: 'pt',
      country: 'Portuquese',
      flag: '🇵🇹',
    },
    {
      title: 'EPortuguês (Brasil)',
      value: 'pgb',
      country: 'Portuguese (Brazil)',
      flag: '🇧🇷',
    },
    {
      title: 'Español',
      value: 'sp',
      country: 'Spanish',
      flag: '🇪🇸',
    },
    {
      title: 'Español (México)',
      value: 'mx',
      country: 'Spanish (Mexico)',
      flag: '🇲🇽',
    },
  ];

  const onConfirmPress = () => {
    bottomSheetRef?.current?.close();
  };
  const onCanclePress = () => {
    bottomSheetRef?.current?.close();
  };

  const renerLanguageSheet = () => {
    return (
      <View style={{marginTop: 15, paddingBottom: 35}}>
        <Text style={styles.sheetTitle}>Change Language</Text>
        <View style={{marginHorizontal: 24, marginTop: 52}}>
          <Text style={styles.confirmChange}>Confirm language change from</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <Text style={styles.chnageCountries}>
              🇺🇸 English (US){' '}
              <Text style={styles.confirmChange}>(Default) </Text>{' '}
            </Text>
            <Text style={styles.confirmChange}>{'to  '}</Text>
            <Text style={styles.chnageCountries}>
              🇫🇷 Français <Text style={styles.confirmChange}>(French) </Text>{' '}
            </Text>
          </View>
          <View
            style={{
              marginTop: 30,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <PrimaryButton
              containerStyle={{
                backgroundColor: colors.errorBg,
                width: 167,
                marginBottom: 0,
              }}
              title={'Reject'}
              titleStyle={{
                color: colors.errorText,
              }}
              onPress={onCanclePress}
            />
            <PrimaryButton
              containerStyle={{
                width: 167,
                marginBottom: 0,
              }}
              title={'Approve'}
              onPress={onConfirmPress}
            />
          </View>
        </View>
      </View>
    );
  };

  console.log('selectdeLangugae :: ', selectedLanguage);

  const renderLanguage = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => setSelectedLanguage(item?.value)}
        style={[styles.walletItemContainer]}>
        <View style={styles.leftView}>
          <Text style={styles.flagIcon}>{item?.flag}</Text>
          <View>
            <Text style={styles.languageName}>{item?.title}</Text>
            <Text style={styles.countryName}>{item?.country}</Text>
          </View>
        </View>
        <View style={styles.rightView}>
          <View
            style={[
              styles.selectionView,
              {
                borderColor:
                  item?.value === selectedLanguage
                    ? colors.primaryBlue
                    : '#DEE4F4',
              },
            ]}>
            {item?.value === selectedLanguage && (
              <View style={styles.activeRadio} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <MainHeader title={'Language'} />
      <View style={{flex: 1}}>
        <FlatList
          data={languageData}
          keyExtractor={(item, index) => index?.toString()}
          renderItem={renderLanguage}
        />
      </View>
      <PrimaryButton
        title={'Confirm'}
        onPress={() => {
          bottomSheetRef?.current?.open();
        }}
        containerStyle={styles.confirmBtnStyle}
        titleStyle={{color: colors.primaryBlue}}
      />
      <BottomSheetModal ref1={bottomSheetRef} children={renerLanguageSheet()} />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
  },
  walletItemContainer: {
    borderWidth: 1,
    height: hp(64),
    width: 342,
    borderRadius: 12,
    backgroundColor: colors.primaryWhite,
    borderColor: colors.borderColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignSelf: 'center',
  },
  leftView: {
    flexDirection: 'row',
    marginLeft: wp(22),
    alignItems: 'center',
  },

  rightView: {
    flexDirection: 'row',
    alignItems: 'center',
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
  flagIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  languageName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.activeBlack,
    fontFamily: fonts.regular,
  },
  countryName: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textGrayColor,
    fontFamily: fonts.regular,
  },
  confirmBtnStyle: {
    marginTop: 10,
    backgroundColor: colors.primaryWhite,
    borderWidth: 1,
    borderColor: colors.primaryBlue,
  },
  sheetTitle: {
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.activeBlack,
  },
  confirmChange: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textGrayColor,
    fontFamily: fonts.regular,
    alignSelf: 'center',
  },
  chnageCountries: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.darkest,
    fontFamily: fonts.bold,
    alignSelf: 'center',
  },
});

//make this component available to the app
export default LanguageScreen;
