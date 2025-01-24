//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput } from 'react-native';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { icons } from '../../helper/iconConstant';
import { hp, wp } from '../../helper/utils';

// create a component
const SearchBar = ({ value, onChangeText, placeholder, inputStyle }) => {
  return (
    <View style={styles.container}>
      <Image source={icons.searchIcon} style={styles.searchIconStyle} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[styles.searchInputStyle, inputStyle]}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    width: 209,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFDFDF',
    backgroundColor: colors.primaryWhite,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIconStyle: {
    height: 16,
    width: 16,
    marginRight: wp(8),
  },
  searchInputStyle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fonts.regular,
    color: colors.activeBlack,
  },
});

//make this component available to the app
export default SearchBar;
