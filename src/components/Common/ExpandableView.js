import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import RoundedView from './RoundedView';
import {icons} from '../../helper/iconConstant';
import {colors} from '../../helper/colorConstants';

const ExpandableView = ({children, childView, style}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggle = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <RoundedView
      style={[styles.expandableView, style]}
      isTouchable={true}
      onPress={toggle}>
      <View style={styles.header}>
        {children}
        <Image
          resizeMode="stretch"
          source={isExpanded ? icons.upIndicator : icons.fiDownIndicator}
          style={styles.icon}
        />
      </View>
      {isExpanded ? childView : null}
    </RoundedView>
  );
};

const styles = StyleSheet.create({
  expandableView: {
    backgroundColor: colors.primaryWhite,
  },
  header: {
    marginTop: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    height: 24,
    width: 24,
    marginEnd: 20,
  },
});

export default ExpandableView;
