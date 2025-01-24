//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {PrimaryButton} from '../../components';
import {colors} from '../../helper/colorConstants';
import {fonts} from '../../helper/fontconstant';
import {UnderMaintenance} from '../../helper/svgconstant';

// create a component
const UpdateRequiredScreen = () => {
  return (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateView}>
        <UnderMaintenance />
        <Text style={styles.emptyStateTitle}>Update Required</Text>
        <Text style={styles.emptyStateDesc}>
          A newer version of Dolf is available. Please update the app to
          continue
        </Text>
      </View>
      <PrimaryButton onPress={() => {}} title="Update Required" />
    </View>
  );
};

// define your styles

const styles = StyleSheet.create({
  emptyStateView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 24,
    color: colors.darkBlack,
    fontFamily: fonts.regular,
    fontWeight: '600',
    marginTop: 33,
  },
  emptyStateDesc: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: fonts.regular,
    color: colors.textGrayColor,
    width: 233,
    textAlign: 'center',
    marginTop: 4,
  },
});

//make this component available to the app
export default UpdateRequiredScreen;
