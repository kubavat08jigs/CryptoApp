//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../../helper/colorConstants';
import {hp, wp} from '../../helper/utils';

// create a component
const Switch = ({toggleSwitch, onSwitchPress, switchContainer, isGray}) => {
  return (
    <TouchableOpacity
      onPress={onSwitchPress}
      style={[styles.switchView, switchContainer]}>
      <View
        style={[
          styles.switchstyle,
          {
            alignSelf: toggleSwitch ? 'flex-end' : 'flex-start',
            backgroundColor: isGray
              ? toggleSwitch
                ? colors.primaryBlue
                : colors.textGrayColor
              : colors.primaryBlue,
          },
        ]}
      />
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
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
});

//make this component available to the app
export default Switch;
