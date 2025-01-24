import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../../helper/colorConstants';
import {hp, wp} from '../../helper/utils';

const RoundedView = props => {
  const {style, isTouchable, ...restOfProps} = props ? props : {style: {}};
  return isTouchable ? (
    <TouchableOpacity style={[styles.roundedView, style]} {...restOfProps}/>
  ) : (
    <View style={[styles.roundedView, style]} {...restOfProps} />
  );
};

const styles = StyleSheet.create({
  roundedView: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grey,
    borderColor: colors.borderColor,
    marginTop: hp(26),
    borderRadius: 12,
    marginHorizontal: wp(24),
    paddingHorizontal: hp(21),
    paddingVertical: wp(10),
  },
});

export default RoundedView;
