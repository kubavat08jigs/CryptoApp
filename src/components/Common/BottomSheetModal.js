//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

// create a component
const BottomSheetModal = ({ref1, children}) => {
  return (
    <RBSheet
      ref={ref1}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        container: {
          borderTopRightRadius: 32,
          borderTopLeftRadius: 32,
          height: 'auto',
          maxHeight: Dimensions.get('screen').height * 0.7,
        },

        wrapper: {
          backgroundColor: 'rgba(0,0,0,0.5)',
        },
        draggableIcon: {
          backgroundColor: '#EDF0F8',
        },
      }}>
      {children}
    </RBSheet>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default BottomSheetModal;
