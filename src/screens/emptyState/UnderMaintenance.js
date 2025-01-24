//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { PrimaryButton } from '../../components';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { UnderMaintenance } from '../../helper/svgconstant';
import { getAppConfig } from '../../redux/action/app';

// create a component
const UnderMaintenanceScreen = () => {
  const dispatch = useDispatch();
  return (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateView}>
        <UnderMaintenance />
        <Text style={styles.emptyStateTitle}>Under Maintenance</Text>
        <Text style={styles.emptyStateDesc}>
          We are currently unavailable due to routine maintenance. We’ll be back
          soon
        </Text>
      </View>
      <PrimaryButton onPress={() => { dispatch(getAppConfig()); }} title="Try Again" />
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
export default UnderMaintenanceScreen;
