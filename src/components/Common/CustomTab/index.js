import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

const CustomTab = ({ tabData, defaultActiveTab, setTabActive }) => {
  const [activeTeb, setActiveTab] = useState(defaultActiveTab || 0);

  return (
    <View style={styles.balanveTabView}>
      {tabData?.map((item, index) => {
        return (
          <TouchableOpacity
            onPress={() => {
              setActiveTab(index);
              setTabActive(index);
            }}
            style={[
              styles.tabOuterView,
              {
                borderBottomWidth: activeTeb === index ? 2 : 0,
              },
            ]}>
            <Text
              style={[
                styles.tabTitleText,
                { fontWeight: activeTeb === index ? '700' : '400' },
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTab;
