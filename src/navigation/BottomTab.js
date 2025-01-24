//import liraries
import React from 'react';
import { Image, Text} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { icons } from '../helper/iconConstant';
import { colors } from '../helper/colorConstants';
import { hp, isIos } from '../helper/utils';
import Portfolio from '../screens/portfolio/Portfolio';
import Wallet from '../screens/wallet/Wallet';
import { fonts } from '../helper/fontconstant';
import HomeScreen from '../screens/dashboard/HomeScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import {
  ActiveHome,
  ActivePie,
  ActiveSettings,
  InactiveHome,
  InactivePie,
  InactiveSettings,
} from '../helper/svgconstant';

const Tab = createBottomTabNavigator();

// create a component
const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: hp(1),
          paddingVertical: hp(8),
          height: isIos ? hp(80) : hp(60),
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => {
            return <>{focused ? <ActiveHome /> : <InactiveHome />}</>;
          },
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: focused ? colors.primaryBlue : colors.activeBlack,
                fontSize: 12,
                marginBottom: isIos ? -5 : hp(5),
                fontFamily: focused ? fonts.interBold : fonts.interRegular,
              }}>
              Home
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Portfolio"
        component={Portfolio}
        options={{
          tabBarIcon: ({ focused, color }) => {
            return <>{focused ? <ActivePie /> : <InactivePie />}</>;
          },
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: focused ? colors.primaryBlue : colors.activeBlack,
                fontSize: 12,
                marginBottom: isIos ? -5 : hp(5),
                fontFamily: focused ? fonts.interBold : fonts.interRegular,
              }}>
              Portfolio
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={Wallet}
        options={{
          tabBarIcon: ({ focused, color }) => {
            return (
              <Image
                source={focused ? icons.activeWallet : icons.wallet}
                style={{
                  height: 16.5,
                  width: 18.75,
                  tintColor: focused
                    ? colors.primaryBlue
                    : colors.primaryBlack,
                }}
              />
            );
          },
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: focused ? colors.primaryBlue : colors.activeBlack,
                fontSize: 12,
                marginBottom: isIos ? -5 : hp(5),
                fontFamily: focused ? fonts.interBold : fonts.interRegular,
              }}>
              Wallet
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => {
            return <>{focused ? <ActiveSettings /> : <InactiveSettings />}</>;
          },
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: focused ? colors.primaryBlue : colors.activeBlack,
                fontSize: 12,
                marginBottom: isIos ? -5 : hp(5),
                fontFamily: focused ? fonts.interBold : fonts.interRegular,
              }}>
              Settings
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

//make this component available to the app
export default BottomTab;
