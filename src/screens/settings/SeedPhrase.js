//import liraries
import React, {Component, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {CText, MainHeader, PrimaryButton} from '../../components';
import {colors} from '../../helper/colorConstants';
import {fonts} from '../../helper/fontconstant';
import {icons} from '../../helper/iconConstant';
import {hp, wp} from '../../helper/utils';
import { useSelector } from 'react-redux';

// create a component
const SeedPhrase = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [toggleSwitch, setToggleSwitch] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState(false);
  const user = useSelector(state => state.user);
  const { key } = useSelector(state => state.wallet);
  const seedPhrase = [user.userInfo?.dappShare];

  const onSwitchPress = () => {
    if (!isChecked && !toggleSwitch){
      setError(true);
    } else {
      setToggleSwitch(!toggleSwitch);
    }
  };

  const Item = ({ item, index }) => (
    <View style={styles.listItemView}>
      <Text style={toggleSwitch ? styles.listItemTitle : {
        fontSize: 16,
        fontWeight: '500',
        color: 'transparent',
        textShadowRadius: 16,
        textShadowColor: 'black200',
      }}>{
        `${item}`
      }</Text>
    </View>
  );

  const renderItem = ({item, index}) => <Item item={item} index={index} />;

  return (
    <View style={styles.container}>
      <MainHeader title={'Revealing Private Key'} />
      <View style={styles.consentView}>
        <CText
          txt={
            'Your private key must never be shared\nwith anyone. Keep it private'
          }
          d
          mf
          m
          textStyle={{textAlign: 'center'}}
        />
        <TouchableOpacity
          onPress={() => {
            if (!isChecked){
              setError(false);
            }
            setIsChecked(!isChecked);
          }}
          activeOpacity={0.9}
          style={[styles.concentCheckView, {
            borderColor: error ? 'red' : colors.borderColor,
          }]}>
          <Image
            source={isChecked ? icons.checkbox : icons.inActiveCheck}
            style={{
              height: 17,
              width: 17,
            }}
          />
          <CText
            txt={'I UNDERSTAND'}
            d
            mf
            m
            textStyle={{textAlign: 'center', marginLeft: wp(8), color: error ? 'red' : 'black'}}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.viewSeedPhrase}>
        <Text style={styles.viewSeedText}>View Private Key</Text>
        <TouchableOpacity onPress={onSwitchPress} style={styles.switchView}>
          {toggleSwitch ? (
            <View
              style={[
                styles.switchstyle,
                {
                  alignSelf: 'flex-end',
                  backgroundColor: colors.primaryBlue,
                },
              ]}
            />
          ) : (
            <View
              style={[
                styles.switchstyle,
                {
                  alignSelf: 'flex-start',
                  backgroundColor: colors.textGrayColor,
                },
              ]}>
              <Image source={icons.close} style={styles.closeIcon} />
            </View>
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.seedAlert}>
        Important: Never share your private key with anyone
      </Text>

      <View style={styles.seedPhraseView}>
        <Text style={toggleSwitch ? styles.listItemTitle : {
        fontSize: 16,
        fontWeight: '500',
        color: 'transparent',
        textShadowRadius: 16,
        textShadowColor: 'black200',
      }}>{key}</Text>
      </View>
      <PrimaryButton
        title={isCopied ? 'Copied to clipboard' : 'Copy to clipboard'}
        iconSrc={isCopied ? icons.success : icons.fi_copy}
        rightIconStyle={{tintColor: '#F5F5F5'}}
        containerStyle={{marginTop: hp(23)}}
        onPress={()=>{
          if (isChecked){
            Clipboard.setString(key);
            setIsCopied(true);
            setTimeout(() => {
              setIsCopied(false);
            }, 5000);
          } else {
            setError(true);
          }
        }}
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
  consentView: {
    borderWidth: 1,
    marginTop: hp(26),
    borderRadius: 12,
    marginHorizontal: wp(24),
    backgroundColor: '#F8FAFE',
    borderColor: colors.borderColor,
    alignItems: 'center',
    paddingVertical: hp(24),
  },
  concentCheckView: {
    width: wp(193),
    height: hp(38),
    borderRadius: 24,
    backgroundColor: colors.primaryWhite,
    borderWidth: 1,
    marginTop: hp(13),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  checkBox: {
    height: 15,
    width: 15,
    borderRadius: 3,
    borderColor: colors.darkest,
    borderWidth: 1,
  },
  viewSeedPhrase: {
    borderWidth: 1,
    marginTop: hp(26),
    borderRadius: 12,
    marginHorizontal: wp(24),
    backgroundColor: colors.primaryWhite,
    borderColor: colors.borderColor,
    alignItems: 'center',
    height: hp(50),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(22),
  },
  viewSeedText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.primaryBlack,
    fontWeight: '500',
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
  closeIcon: {
    height: 16,
    width: 16,
  },
  seedAlert: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fonts.regular,
    alignSelf: 'center',
    color: colors.darkBlack,
    marginTop: hp(54),
  },
  seedPhraseView: {
    borderWidth: 1,
    marginTop: hp(26),
    borderRadius: 12,
    marginHorizontal: wp(24),
    backgroundColor: '#F8FAFE',
    borderColor: colors.borderColor,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    paddingVertical: hp(18),
  },
  listItemView: {
    paddingHorizontal: wp(12),
    height: hp(35),
    backgroundColor: colors.primaryWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    margin: wp(6.5),
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.darkest,
  },
  blurSandView: {
    height: 227,
    width: 342,
  },
});

//make this component available to the app
export default SeedPhrase;
