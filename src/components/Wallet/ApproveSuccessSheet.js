//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { getLocalText } from '../../helper/globalFunctions';
import { icons } from '../../helper/iconConstant';
import { navigate } from '../../helper/rootNavigation';
import { hp, wp } from '../../helper/utils';
import { inAppBrowserConfig } from '../../utils/consts';
import PrimaryButton from '../Common/PrimaryButton';

// create a component
const ApproveSuccessSheet = ({ onOkayPress, url }) => {
  const successAlertMessage =
    'You will be notified when the transaction is\nsuccessfully completed. Meanwhile, you can\ntrack the status in ';
  return (
    <View style={{ marginTop: 15, alignItems: 'center' }}>
      <Image source={icons.success} style={styles.successIconStyle} />
      <Text style={[styles.approvalText, { marginTop: 24 }]}>
        Transaction submitted
      </Text>
      <TouchableOpacity
        onPress={async () => {
          if (await InAppBrowser?.isAvailable()) {
            InAppBrowser.open(url, inAppBrowserConfig).then((response) => {
              // console.log(response)
            });
          } else Linking.openURL(url);
        }}
        style={{ marginTop: 10, marginBottom: 24 }}
      >
        <Text style={{ color: colors.primaryBlue, fontFamily: fonts.medium, fontSize: 14 }}>
          View on Explorer <Image source={icons.viewOnExplorer} style={{ height: 12, width: 12 }} />
        </Text>
      </TouchableOpacity>
      <View style={styles.alertView}>
        <Image source={icons.helperIcon} style={styles.alertIconstyle} />
        <Text style={styles.successAlertText}>
          {successAlertMessage}
          <Text style={[styles.successAlertText, { color: '#0052FE' }]} onPress={() => navigate('TransactionHistory')}>
            Transaction History.
          </Text>
        </Text>
      </View>
      <PrimaryButton
        onPress={onOkayPress}
        containerStyle={{ marginTop: 36 }}
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
    fontFamily: fonts.medium,
    color: colors.activeBlack,
  },
  alertView: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    alignSelf: 'center',
    marginTop: 13,
    flexDirection: 'row',
    backgroundColor: colors.infoBackGround,
    paddingHorizontal: 16,
  },
  alertIconstyle: {
    width: 20,
    height: 20,
    marginRight: 15,
    tintColor: '#0052FE',
  },
  successAlertText: {
    fontSize: 12,
    color: '#747474',
    lineHeight: 16,
  },
});

//make this component available to the app
export default ApproveSuccessSheet;
