import React from 'react';
import { View } from 'react-native';
import Passcode from './Passcode';
import styles from './styles';

export default function Unlock({ onSuccess = () => { } }) {
  return (
    <View style={styles.container}>
      <Passcode type="unlock" onSuccess={() => {
        onSuccess();
      }} />
    </View>
  );
}