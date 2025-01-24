//import liraries
import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { getLocalText } from '../../helper/globalFunctions';
import { icons } from '../../helper/iconConstant';
import { hp, wp } from '../../helper/utils';
import PrimaryButton from '../Common/PrimaryButton';

// create a component
const ApproveFailSheet = ({ onOkayPress, reason = 'some error occured, please try again in some time' }) => {
  return (
    <View style={{ marginTop: 15, alignItems: 'center' }}>
      <Image source={icons.transactionFail} style={styles.successIconStyle} />
      <Text style={[styles.approvalText, { marginTop: 24 }]}>
        Transaction Failed
      </Text>
      <Pressable style={styles.failAlertView} onPress={() => Clipboard.setString(reason)}>
        <Image source={icons.filled_info} style={styles.alertIcon} />
        <Text
          ellipsizeMode="tail"
          numberOfLines={2}
          style={styles.alertText} >Transaction failed: Reason - {reason}
        </Text>
        <Image source={icons.copy} style={{ width: 14.2, height: 18 }} />
      </Pressable>
      <PrimaryButton
        onPress={onOkayPress}
        title={getLocalText('Okay')}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  successIconStyle: {
    height: wp(83),
    width: wp(83),
    marginTop: hp(5),
  },
  approvalText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.activeBlack,
  },
  alertView: {
    width: 342,
    height: 77,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    alignSelf: 'center',
    marginTop: 13,
    flexDirection: 'row',
  },
  alertIconstyle: {
    width: 20,
    height: 20,
    marginLeft: 17,
    marginRight: 11,
    tintColor: '#0052FE',
  },
  successAlertText: {
    fontSize: 12,
    color: '#747474',
  },
  failAlertView: {
    marginHorizontal: wp(39),
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(36),
  },
  alertIcon: {
    height: 24,
    width: 24,
  },
  alertText: { fontSize: 12, fontWeight: '400', color: "#747474", fontFamily: fonts.regular, marginHorizontal: 5, maxWidth: '90%' },
});

//make this component available to the app
export default ApproveFailSheet;
