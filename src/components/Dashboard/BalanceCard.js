//import liraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import crashlytics from '@react-native-firebase/crashlytics';

import {colors} from '../../helper/colorConstants';
import {fonts} from '../../helper/fontconstant';
import {getLocalText} from '../../helper/globalFunctions';
import {icons} from '../../helper/iconConstant';
import {navigate} from '../../helper/rootNavigation';
import {AddCircle} from '../../helper/svgconstant';
import {fontSize, hp, wp} from '../../helper/utils';
import {setBalanceVisible} from '../../redux/action/app';

// create a component
const BalanceCard = ({amount, changeAmount}) => {
  const {balanceVisible} = useSelector(st => st.app);
  const dispatch = useDispatch();

  async function toggle() {
    console.log('crashhhhhinng');
    crashlytics().log('crashhhhhhhhhhhhhhhh');
    dispatch(setBalanceVisible(!balanceVisible));
    if (!balanceVisible) {
      await AsyncStorage.setItem('show_balance', '1');
    } else {
      await AsyncStorage.setItem('show_balance', '0');
    }
  }

  useEffect(() => {
    async function init() {
      const show_balance = await AsyncStorage.getItem('show_balance');
      console.log(show_balance);
      dispatch(
        setBalanceVisible(show_balance === '1' || show_balance === null),
      );
    }
    init();
  }, []);

  const getDecimal = val => {
    return parseInt(Math.abs(val ?? 0), 10)?.toLocaleString();
  };

  const getFraction = val => {
    let _val = parseFloat(val ?? 0).toFixed(2);
    return `${_val}`.split('.')[1];
  };

  const isAmount = amount > 0 ? true : false;
  // const isAmount = false;

  const onAddBalanceBtnPress = () => {
    navigate('AddFunds');
  };

  return (
    <View style={styles.balanceCardView}>
      <View style={styles.totalBalanceView}>
        <Text style={styles.totalBalanceText}>
          {getLocalText('Total Balance')}
        </Text>
        <Pressable onPress={toggle}>
          <Image
            source={!balanceVisible ? icons.eye : icons.eyeClosed}
            style={styles.eyeStyle}
          />
        </Pressable>
      </View>
      <View style={styles.amountView}>
        <Text style={styles.mainAmountText}>
          {balanceVisible ? (
            <>
              ${getDecimal(amount)}.
              <Text style={styles.pointamountStyle}>
                {amount > 0 ? getFraction(amount) : '00'}
              </Text>
            </>
          ) : (
            '****'
          )}
        </Text>
        {isAmount ? (
          <View>
            <Text style={styles.changeTextStyle}>
              {getLocalText('24H Change')}
            </Text>
            {balanceVisible ? (
              <View style={[styles.changeAmountView]}>
                <Text
                  style={[
                    styles.changeMainAmount,
                    {
                      color:
                        changeAmount >= 0
                          ? colors.primaryGreen
                          : colors.errorText,
                    },
                  ]}>
                  ${getDecimal(changeAmount)}.
                  <Text
                    style={[
                      styles.changeAmountSub,
                      {
                        color:
                          changeAmount >= 0
                            ? colors.primaryGreen
                            : colors.errorText,
                      },
                    ]}>
                    {getFraction(changeAmount)}
                  </Text>
                </Text>
                <Image
                  source={
                    changeAmount >= 0 ? icons.upTriangle : icons.downTriangle
                  }
                  style={styles.upArrowStyle}
                />
              </View>
            ) : (
              <View>
                <Text style={{fontSize: fontSize(16)}}>****</Text>
              </View>
            )}
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onAddBalanceBtnPress}
            style={styles.addButtonConotainer}>
            <Text style={styles.addBtnTitle}>Add balance</Text>
            <AddCircle />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  balanceCardView: {
    borderWidth: 1,
    marginTop: hp(26),
    borderRadius: 12,
    marginHorizontal: wp(24),
    backgroundColor: '#F8FAFE',
    borderColor: colors.borderColor,
    paddingVertical: hp(35),
    flexGrow: 1,
  },
  totalBalanceView: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: wp(21),
  },
  totalBalanceText: {
    color: '#808588',
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  eyeStyle: {
    height: hp(16),
    width: wp(16),
    marginLeft: wp(3),
    padding: 5,
  },
  amountView: {
    marginTop: hp(17),
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginHorizontal: wp(21),
    justifyContent: 'space-between',
  },
  upArrowStyle: {
    height: hp(6),
    width: wp(10.39),
    marginHorizontal: wp(6.8),
  },
  mainAmountText: {
    fontSize: fontSize(40),
    fontFamily: fonts.regular,
    color: colors.primaryBlack,
  },
  pointamountStyle: {
    fontSize: fontSize(20),
    color: colors.primaryBlack,
    fontFamily: fonts.regular,
  },
  changeTextStyle: {
    fontFamily: fonts.regular,
    fontSize: fontSize(10),
    color: colors.textGrayColor,
    lineHeight: 14,
  },
  changeAmountView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeMainAmount: {
    fontSize: fontSize(30),
    fontFamily: fonts.regular,
    // lineHeight: 16.8,
  },
  changeAmountSub: {
    fontSize: fontSize(20),
    fontFamily: fonts.regular,
  },
  addButtonConotainer: {
    width: wp(130),
    height: hp(36),
    borderRadius: 22,
    backgroundColor: colors.primaryBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnTitle: {
    fontSize: fontSize(14),
    color: colors.primaryWhite,
    fontFamily: fonts.medium,
    marginRight: wp(2),
  },
  addBalanceIcon: {
    height: hp(16),
    width: hp(16),
  },
});

//make this component available to the app
export default BalanceCard;
