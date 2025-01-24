//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../../helper/colorConstants';
import {fonts} from '../../helper/fontconstant';

// textColor :
// s for green
// e for red
// g fro grey
// d for darkblabk
// default is activeBlack

// textSize :
// default 14
// sf for 12
// mf for 16
// fontsize for custom fontsize

// fontWeight :
// default '400'
// b for bold
// m for '600',

// create a component
const CText = props => {
  const fontWeight = props.b ? 'bold' : props.m ? '600' : '400';

  const fontFamily = props.b
    ? fonts.bold
    : props.m
    ? fonts.regular
    : fonts.regular;

  const fontColor = props.s
    ? colors.primaryGreen
    : props.e
    ? colors.errorText
    : props.g
    ? colors.textGrayColor
    : props.d
    ? colors.darkest
    : colors.activeBlack;

  const fontSize = props.fontSize
    ? props.fontSize
    : props.sf
    ? 12
    : props.mf
    ? 16
    : 14;

  return (
    <Text
      style={[
        {
          fontWeight: fontWeight,
          color: fontColor,
          fontSize: fontSize,
          fontFamily: fontFamily,
        },
        props.textStyle,
      ]}>
      {props.txt}
    </Text>
  );
};

// define your styles
const styles = StyleSheet.create({});

//make this component available to the app
export default CText;
