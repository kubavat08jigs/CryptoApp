//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {colors} from '../../helper/colorConstants';
import Swiper from 'react-native-swiper';
import {
  Logo,
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
  Slide6,
} from '../../helper/svgconstant';
import {getLocalText} from '../../helper/globalFunctions';
import {PrimaryButton} from '../../components';
import {fonts} from '../../helper/fontconstant';
import {hp, wp} from '../../helper/utils';

// create a component
const OnBoarding = () => {
  const onCreatAccountPress = () => {};
  const onLoginPress = () => {};
  const onRecoverPress = () => {};

  const SliderItem = ({iconSource, titleText}) => {
    return (
      <View style={styles.slideContainer}>
        {iconSource}
        <Text style={styles.slideText}>{titleText}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center', marginTop: 23}}>
        <Logo />
      </View>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Swiper
          loop={false}
          autoplay
          activeDotStyle={styles.activeDotStyle}
          dotStyle={styles.inActiveDotStyle}
          style={styles.wrapper}>
          <SliderItem
            titleText={'Next-gen, self-custodial,\nmultichain keyless wallet'}
            iconSource={<Slide1 />}
          />
          <SliderItem
            titleText={
              'Buy/sell/trade cryptos at the\nbest rates & lowest fee.'
            }
            iconSource={<Slide2 />}
          />
          <SliderItem
            titleText={
              ' Borrow from best DeFi protocols\nfor as low as 0% interest'
            }
            iconSource={<Slide3 />}
          />
          <SliderItem
            titleText={
              'Spend via crypto backed card\nand earn cashback on every spend'
            }
            iconSource={<Slide4 />}
          />
          <SliderItem
            titleText={'Get your free, unique\nWeb3 username'}
            iconSource={<Slide5 />}
          />
          <SliderItem
            titleText={'Track your Portfolio\nand get real-time alerts'}
            iconSource={<Slide6 />}
          />
        </Swiper>
      </View>
      <PrimaryButton
        onPress={onCreatAccountPress}
        title={getLocalText('Create an account')}
        // iconSrc={icons.fi_arrow_right}
        containerStyle={{marginTop: 10, marginBottom: 12}}
      />
      <PrimaryButton
        onPress={onLoginPress}
        title={getLocalText('Login')}
        containerStyle={{backgroundColor: '#F1F4FA', marginBottom: 20}}
        titleStyle={{
          color: '#0052FE',
          fontSize: 14,
          fontWeight: '700',
          marginBottom: 0,
        }}
      />
      <TouchableOpacity onPress={onRecoverPress} style={{marginBottom: 28}}>
        <Text style={styles.recoverText}>Recover wallet</Text>
      </TouchableOpacity>
      <Text style={styles.privacyAlert}>
        By continuing, you agree to Dolf’s
      </Text>
      <View style={styles.privacyPolicyView}>
        <Text
          onPress={() => {}}
          style={[
            styles.privacyPolicy,
            {
              textDecorationLine: 'underline',
            },
          ]}>
          Terms of Service
        </Text>
        <Text style={styles.privacyPolicy}> and </Text>
        <Text
          onPress={() => {}}
          style={[styles.privacyPolicy, {textDecorationLine: 'underline'}]}>
          Privacy Policy
        </Text>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
  },
  recoverText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.primaryBlue,
    alignSelf: 'center',
  },
  privacyAlert: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: fonts.regular,
    color: colors.textGrayColor,
    alignSelf: 'center',
  },
  privacyPolicy: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: fonts.regular,
    color: colors.activeBlack,
    alignSelf: 'center',
  },
  privacyPolicyView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 1,
    marginBottom: 16,
  },
  wrapper: {},
  // activeDotStyle: {
  //   height: hp(0.24),
  //   width: wp(9),
  //   borderRadius: hp(0.5),
  //   marginHorizontal: 5,
  // },
  inActiveDotStyle: {
    backgroundColor: '#C9D7FF',
  },
  slideText: {
    fontSize: 20,
    fontWeight: '400',
    color: colors.darkest,
    fontFamily: fonts.regular,
    marginBottom: 80,
    marginTop: 35,
    textAlign: 'center',
  },
  slideContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    flex: 1,
  },
});

//make this component available to the app
export default OnBoarding;
