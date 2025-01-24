//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {colors} from '../../helper/colorConstants';
import {fonts} from '../../helper/fontconstant';
import {icons} from '../../helper/iconConstant';
import {goBack} from '../../helper/rootNavigation';
import {fontSize, hp, isIos, statusBarHeight, wp} from '../../helper/utils';

// create a component
const MainHeader = ({title, containerStyle, hideBack, onBackPress}) => {
  const hitSlop = {top: 10, bottom: 10, left: 10, right: 10};
  return (
    <View style={[styles.mainContainer, containerStyle]}>
      {hideBack ? (
        <View style={styles.emptyBackView} />
      ) : (
        <TouchableOpacity onPress={onBackPress || goBack} hitSlop={hitSlop}>
          <Image
            source={icons.back}
            style={styles.backIcon}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.titleText}>{title}</Text>
      <View style={styles.emptyBackView} />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: wp(24),
    marginTop: isIos ? statusBarHeight : hp(47 - statusBarHeight),
    marginBottom: hp(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor:'black',
  },
  emptyBackView: {
    height: wp(15),
  },
  backIcon: {
    height: hp(15.5),
    width: wp(8.5),
  },
  titleText: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.primaryBlack,
  },
  rightIconStyle: {
    // height: wp(7),
    // width: wp(6),
    // marginRight: wp(2),
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

//make this component available to the app
export default MainHeader;
