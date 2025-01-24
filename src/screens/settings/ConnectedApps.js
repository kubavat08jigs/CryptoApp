//import liraries
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {PrimaryButton} from '../../components';
import MainHeader from '../../components/Common/MainHeader';
import {colors} from '../../helper/colorConstants';
import {fonts} from '../../helper/fontconstant';
import {getLocalText} from '../../helper/globalFunctions';
import {icons} from '../../helper/iconConstant';
import {goBack, navigate} from '../../helper/rootNavigation';
import {fontSize, hp, wp} from '../../helper/utils';

// create a component
const ConnectedApps = () => {
  const renderemptyComponenet = () => {
    return (
      <View style={styles.emptyStateContainer}>
        <Image
          source={icons.emptyConnectedApps}
          style={{width: wp(282), height: hp(290)}}
        />
        <Text style={styles.emptyStateHeader}>
          {getLocalText('Connect a Dapp')}
        </Text>
        <Text style={styles.emptyStateSubHeader}>
          {getLocalText('Connect a Dapp with Dolf')}
        </Text>
      </View>
    );
  };

  const renderItem = () => {
    return (
      <View style={styles.connectedAppItemContainer}>
        <View style={styles.leftView}>
          <View style={styles.appIconView}>
            <Image style={styles.appIconStyle} source={icons.dummyAppLogo} />
          </View>
          <Text style={styles.connectedAppName}>Uniswap</Text>
        </View>
        <TouchableOpacity style={styles.logoutAppView}>
          <Text style={styles.logoutText}>{getLocalText('Logout')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const onBackPress = () => {
    goBack();
  };

  return (
    <View style={styles.container}>
      <MainHeader
        onBackPress={onBackPress}
        title={getLocalText('Connected Dapps')}
      />
      <FlatList
        contentContainerStyle={{flex: 1, marginTop: hp(32)}}
        data={[1]}
        renderItem={renderItem}
        ListEmptyComponent={renderemptyComponenet}
      />
      <PrimaryButton iconSrc={icons.addAppIcon} title={'Connect a Dapp'} />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
  },
  emptyStateHeader: {
    fontFamily: fonts.bold,
    fontSize: fontSize(24),
    marginTop: hp(33),
    color: colors.activeBlack,
  },
  emptyStateSubHeader: {
    fontFamily: fonts.medium,
    fontSize: fontSize(16),
    color: colors.textGrayColor,
    lineHeight: 19.2,
  },
  connectedAppItemContainer: {
    width: wp(342),
    height: hp(80),
    backgroundColor: '#F8FAFE',
    borderColor: colors.borderColor,
    borderWidth: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp(4),
  },
  leftView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp(22),
  },
  appIconView: {
    width: wp(32),
    height: hp(32),
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: colors.primaryWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(8),
  },
  appIconStyle: {
    height: hp(24),
    width: wp(24),
  },
  connectedAppName: {
    fontSize: 14,
    color: '#000000',
    fontFamily: fonts.bold,
  },
  logoutAppView: {
    width: wp(48),
    height: hp(33),
    borderRadius: 8,
    marginRight: wp(22),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.borderColor,
    backgroundColor: colors.primaryWhite,
  },
  logoutText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    lineHeight: 16.8,
    color: colors.textGrayColor,
  },
  emptyStateContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

//make this component available to the app
export default ConnectedApps;
