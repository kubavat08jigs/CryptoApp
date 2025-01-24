//import liraries
import React from 'react';
import {View, StyleSheet} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {hp} from '../../helper/utils';

// create a component
const QRCodeGenerate = ({value, size}) => {
  return (
    <View style={styles.container}>
      <QRCode value={value} size={hp(size)} />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({});

//make this component available to the app
export default QRCodeGenerate;
