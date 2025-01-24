//import liraries
import React from 'react';
import { StatusBar } from 'react-native';
import { colors } from './src/helper/colorConstants';
import MainNavigation from './src/navigation/MainNavigation';
import { Provider } from 'react-redux';
import store from './src/redux/index';
import Toast from 'react-native-toast-message';


// create a component
const App = () => {

  return (
    <Provider store={store}>
      <StatusBar
        backgroundColor={colors.primaryWhite}
        barStyle={'dark-content'}
      />
      <MainNavigation />
      <Toast />
    </Provider>
  );
};

//make this component available to the app
export default App;
