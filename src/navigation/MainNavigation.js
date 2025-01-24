//import liraries
import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";



import BottomTab from './BottomTab';
import SendToken from '../screens/wallet/SendToken';
import { navigate, navigationRef } from '../helper/rootNavigation';
import SetPin from '../screens/Lock/SetPin';
import Unlock from '../screens/Lock/Unlock';
import TokenDetails from '../screens/wallet/TokenDetails';
import WebUserName from '../screens/Web3UserName';
// import AddFunds from '../screens/AddFunds';
// import BuyCrypto from '../screens/BuyCrypto';
import SwapScreen from '../screens/swap';
import AddFunds from '../screens/dashboard/AddFunds';
import BuyCrypto from '../screens/dashboard/BuyCrypto';
import SignInScreen from '../screens/auth/SignInScreen';
import CreateAccount from '../screens/auth/CreateAccount';
import Landing from '../screens/Landing';
import PortfolioList from '../screens/portfolio/PortfolioList';

import { getAllChains } from '../redux/action/chain';
import Markets from '../screens/dashboard/Markets';
import BuyFromOnRamp from '../screens/BuyFromOnRamp';
import RemoveToken from '../screens/settings/RemoveToken';
import Networks from '../screens/settings/Networks';
import RecoveryKey from '../screens/settings/RecoveryKey';
import ConnectedApps from '../screens/settings/ConnectedApps';
import SeedPhrase from '../screens/settings/SeedPhrase';
import ReceiveToken from '../screens/wallet/RecieveToken';
import RecoverWallet from '../screens/auth/RecoveryFlow/RecoverWallet';
import RecoveryInputScreen from '../screens/auth/RecoveryFlow/RecoveryInputScreen';
import AddToken from '../screens/settings/AddToken';
import TransactionHistory from '../screens/dashboard/TransactionHistory';
import NoInternetScreen from '../screens/emptyState/NoInternet';
import UpdateRequiredScreen from '../screens/emptyState/UpdateRequiredScreen';
import UnderMaintenanceScreen from '../screens/emptyState/UnderMaintenance';
import NotificationScreen from '../screens/notification/Notification';
import Quest from '../screens/QuestScreen';
import LanguageScreen from '../screens/settings/LanguageScreen';
import ScanScreen from '../screens/dashboard/ScanScreen';
import OnBoarding from '../screens/onboarding/Onboarding';
import { useDispatch, useSelector } from 'react-redux';
import { getWalletBalance } from '../redux/action/wallet';
import { balanceRefreshTimer, lockTimerInMillis } from '../utils/consts';
import BuyFromTransak from '../screens/BuyFromtransak';
import { AppState, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReferralDetails from '../screens/settings/ReferralDetails';

const Stack = createNativeStackNavigator();

// create a component
const MainNavigation = () => {

  const { address, key } = useSelector(st => st.wallet);
  const { under_maintenance } = useSelector(st => st.app);
  const { jwtToken, is_dapp_saved } = useSelector(st => st.user);
  const [isLocked, setIsLocked] = useState(true);
  const [isPinSet, setIsPinSet] = useState(true);
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  const timer = useRef();




  const checkPINStatus = async () => {
    try {
      console.log('checking again');
      const jsonValue = await AsyncStorage.getItem('@dolf-lock-pin');
      if (jsonValue !== null) {
        setIsPinSet(true);
      } else {
        setIsLocked(false);
        setIsPinSet(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllChains();

    const appStateListener = AppState.addEventListener('change', async state => {
      console.log(state);
      if (state === 'background') {
        console.log(Date.now());
        await AsyncStorage.setItem('@dolf-pin-timer', `${Date.now()}`);
      } else if (state === 'active') {
        let lastLocked = parseInt(await AsyncStorage.getItem('@dolf-pin-timer'), 10);
        console.log(lastLocked);
        console.log(Date.now() - lastLocked);
        if (lastLocked && Date.now() - lastLocked > lockTimerInMillis) {
          console.log("locked now");
          setIsLocked(true);
        }
      }
    });
    checkPINStatus();
    return () => appStateListener.remove();
  }, []);

  useEffect(() => {
    if (address && key && !timer.current) {
      timer.current = setInterval(() => {
        dispatch(getWalletBalance());
      }, balanceRefreshTimer);
      return (() => clearInterval(timer.current));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, key]);

  useEffect(() => {
    if (!netInfo.isInternetReachable) {
      setTimeout(() => {
        if (!netInfo.isInternetReachable) {
          NetInfo.fetch().then(state => {
            if (!state.isInternetReachable) {
              navigate('NoInternetScreen');
            }
          });
        }
      }, 3000);
    }
  }, [netInfo.isInternetReachable]);

  if (under_maintenance) { return (<UnderMaintenanceScreen />); }

  return (
    <>
      {
        (jwtToken && is_dapp_saved) ? (
          isPinSet ?
            <Modal visible={isLocked}>
              <Unlock
                onSuccess={() => {
                  console.log('isPinSet', isPinSet);
                  console.log('isLocked', isLocked);
                  setIsLocked(false);
                }}
              />
            </Modal>
            :
            <Modal>
              <SetPin
                onSuccess={() => {
                  setIsPinSet(true);
                  setIsLocked(false);
                }}
              />
            </Modal>
        )
          : null
      }
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="Landing"
          screenOptions={{ headerShown: false }}>
          <Stack.Screen name="BottomTab" component={BottomTab} />
          <Stack.Screen name="SetPin" component={SetPin} />
          <Stack.Screen name="Unlock" component={Unlock} />
          <Stack.Screen name="Landing" component={Landing} />
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
          <Stack.Screen name="SignInScreen" component={SignInScreen} />
          <Stack.Screen name="SendToken" component={SendToken} />
          <Stack.Screen name="ReceiveToken" component={ReceiveToken} />
          <Stack.Screen name="TokenDetails" component={TokenDetails} />
          <Stack.Screen name="WebUserName" component={WebUserName} />
          <Stack.Screen name="AddFunds" component={AddFunds} />
          <Stack.Screen name="BuyCrypto" component={BuyCrypto} />
          <Stack.Screen name="SwapScreen" component={SwapScreen} />
          <Stack.Screen name="PortfolioList" component={PortfolioList} />
          <Stack.Screen name="Markets" component={Markets} />
          <Stack.Screen name="BuyFromOnRamp" component={BuyFromOnRamp} />
          <Stack.Screen name="BuyFromTransak" component={BuyFromTransak} />
          <Stack.Screen name="RemoveToken" component={RemoveToken} />
          <Stack.Screen name="Networks" component={Networks} />
          <Stack.Screen name="RecoveryKey" component={RecoveryKey} />
          <Stack.Screen name="ReferralDetails" component={ReferralDetails} />
          <Stack.Screen name="ConnectedApps" component={ConnectedApps} />
          <Stack.Screen name="SeedPhrase" component={SeedPhrase} />
          <Stack.Screen name="RecoverWallet" component={RecoverWallet} />
          <Stack.Screen
            name="RecoveryInputScreen"
            component={RecoveryInputScreen}
          />
          <Stack.Screen name="AddToken" component={AddToken} />
          <Stack.Screen
            name="TransactionHistory"
            component={TransactionHistory}
          />
          <Stack.Screen
            name="UpdateRequiredScreen"
            component={UpdateRequiredScreen}
          />
          <Stack.Screen
            name="UnderMaintenanceScreen"
            component={UnderMaintenanceScreen}
          />
          <Stack.Screen
            name="NoInternetScreen"
            component={NoInternetScreen}
          />
          <Stack.Screen
            name="NotificationScreen"
            component={NotificationScreen}
          />
          <Stack.Screen name="Quest" component={Quest} />
          <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
          <Stack.Screen name="ScanScreen" component={ScanScreen} />
          <Stack.Screen name="OnBoarding" component={OnBoarding} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  )
};

//make this component available to the app
export default MainNavigation;
