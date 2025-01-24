import React from 'react';
import { View } from 'react-native';
import Passcode from './Passcode';
import styles from './styles';
import { navigate, resetNavigationStack } from '../../helper/rootNavigation';

export default function SetPin({ onSuccess = () => { } }) {
  let paramOnSuccess = () => {
    resetNavigationStack();
    navigate('BottomTab');
  };
  return (
    <View style={styles.container}>
      <Passcode type="set" onSuccess={() => {
        paramOnSuccess();
        onSuccess();
      }} />
    </View>
  );
}
