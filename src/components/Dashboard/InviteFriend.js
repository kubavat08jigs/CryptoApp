//import liraries
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {colors} from '../../helper/colorConstants';
import {fonts} from '../../helper/fontconstant';
import {getLocalText} from '../../helper/globalFunctions';
import {icons} from '../../helper/iconConstant';
import {fontSize, hp, wp} from '../../helper/utils';
import {navigate} from '../../helper/rootNavigation';

// create a component
const InviteFriend = () => {
  const navigateToReferralDetails = () => {
    navigate('ReferralDetails');
  };
  return (
    <TouchableOpacity
      style={styles.referalView}
      onPress={navigateToReferralDetails}>
      <View style={styles.inviteTextView}>
        <Image source={icons.giftBox} style={styles.giftBoxStyle} />
        <View style={styles.inviteView}>
          <Text style={styles.inviteHeaderText}>
            {getLocalText('Invite and Earn')}
          </Text>
          <Text style={styles.inviteFriendNormal}>
            {getLocalText('get_upto') }
            <Text style={styles.inviteFriendBold}>
              {'25% '}
            </Text>
            {getLocalText('commission_for_lifetime')}
          </Text>
        </View>
        <Image
          resizeMode="center"
          source={icons.rightArrow}
          style={styles.rightArrowIcon}
        />
      </View>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  referalView: {
    borderWidth: 1,
    // height: hp(120),
    borderRadius: 12,
    marginHorizontal: wp(24),
    borderColor: colors.borderColor,
  },
  inviteTextView: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inviteFriendNormal: {
    lineHeight: 15.4,
    fontFamily: fonts.regular,
    fontSize: fontSize(11),
    color: colors.primaryBlack,
  },
  inviteFriendBold: {
    lineHeight: 15.4,
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.primaryBlack,
  },
  referalCodeView: {
    width: wp(253),
    height: hp(37),
    borderWidth: 1,
    borderRadius: 7,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    justifyContent: 'space-between',
    borderColor: colors.borderColor,
    paddingHorizontal: wp(12),
  },
  referalCodeText: {
    fontSize: 12,
    color: '#6C6C6C',
    fontFamily: fonts.regular,
  },
  copyIcon: {
    width: 14.2,
    height: 18,
  },
  giftBoxStyle: {
    height: hp(32),
    width: wp(32),
    marginRight: wp(12),
  },
  inviteView: {
    flex: 1,
  },
  inviteHeaderText: {
    color: colors.primaryText,
    fontSize: fontSize(14),
    fontFamily: fonts.bold,
  },
  fileShareIcon: {
    width: 45,
    height: 37,
    marginLeft: wp(10),
  },
  referalCodeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  rightArrowIcon: {
    height: 20,
    width: 20,
  },
});

//make this component available to the app
export default InviteFriend;
