//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, FlatList} from 'react-native';
import {MainHeader} from '../components';
import {colors} from '../helper/colorConstants';
import {fonts} from '../helper/fontconstant';
import {icons} from '../helper/iconConstant';
import {DollarCoin, PrizeReward} from '../helper/svgconstant';

// create a component
const Quest = () => {
  const dummyData = [
    {
      type: 'Swap',
      title: 'Swap crypto worth $1000\nand win $10 in rewards',
      outOfTotle: 500,
      icon: icons.swap,
    },
    {
      type: 'Buy',
      title: 'Buy crypto worth $1000\nusing Fiat and win $25',
      outOfTotle: 0,
      icon: icons.dollarPlusGreen,
    },
    {
      type: 'Swap',
      title: 'Swap crypto worth $10,00\nand win $100 in rewards',
      outOfTotle: 0,
      icon: icons.swap,
    },
  ];

  const renderItem = ({item}) => (
    <View style={styles.rewardItemContainer}>
      <View style={styles.itemUpperView}>
        <View style={styles.innerHorizontalView}>
          <Image
            source={item?.icon}
            style={[
              styles.rewardItemIcon,
              {tintColor: item?.type === 'Swap' ? '#FF8A00' : '#19A684'},
            ]}
          />
          <Text style={styles.rewardItemText}>{item?.title}</Text>
        </View>
      </View>
      <View style={[styles.saperatorLine, {marginVertical: 18}]} />
      <View style={styles.itemBottomView}>
        <View
          style={[
            styles.innerHorizontalView,
            {justifyContent: 'space-between'},
          ]}>
          <Text style={styles.totalTitle}>
            Total {item?.type === 'Swap' ? 'Swapped' : 'Bought'}
          </Text>
          <Text style={styles.totlaDollar}>${item?.outOfTotle}/$1000</Text>
        </View>
        <View style={styles.progressView}>
          <View
            style={[
              styles.progressActive,
              {
                width:
                  item?.outOfTotle === 0
                    ? '5%'
                    : `${(item?.outOfTotle * 100) / 1000}%`,
              },
            ]}
          />
        </View>
        {item?.outOfTotle === 500 && (
          <Text style={styles.appreciationText}>
            You’re doing great. Keep Going
          </Text>
        )}
        {item?.outOfTotle === 1000 && (
          <Text style={[styles.appreciationText, {tintColor: '#19A684'}]}>
            🥳 Congratulations, Quest Complete.
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <MainHeader />
      <View style={styles.rewardMain}>
        <View style={styles.rewardMainInnerView}>
          <PrizeReward />
          <Text style={styles.prizeText}>
            Win $1000 in Prizes by Completing Simple Tasks
          </Text>
        </View>
        <View style={styles.saperatorLine} />
        <View style={styles.earnedRewardView}>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <DollarCoin />
            <Text style={[styles.prizeText, {marginLeft: 8}]}>
              Rewards earned
            </Text>
          </View>
          <Text style={styles.earnedRewardText}>$0</Text>
        </View>
      </View>
      <FlatList
        data={dummyData}
        keyExtractor={(item, index) => index?.toString()}
        renderItem={renderItem}
        style={{marginTop: 12}}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
  },
  rewardMain: {
    backgroundColor: '#F8FAFE',
    borderRadius: 12,
    borderColor: colors.borderColor,
    borderWidth: 1,
    marginHorizontal: 24,
  },
  rewardMainInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginHorizontal: 19.75,
  },
  prizeText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: fonts.regular,
    color: colors.primaryBlack,
    width: 215,
    marginLeft: 13,
    lineHeight: 22,
  },
  saperatorLine: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    marginVertical: 13,
  },
  earnedRewardText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: fonts.regular,
    color: colors.primaryBlack,
  },
  earnedRewardView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    justifyContent: 'space-between',
    marginHorizontal: 19.75,
  },
  rewardItemContainer: {
    borderColor: colors.borderColor,
    borderWidth: 1,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 24,
    // paddingBottom: 15,
  },
  itemUpperView: {
    marginHorizontal: 21,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  innerHorizontalView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemBottomView: {
    marginHorizontal: 25,
    marginBottom: 22,
  },
  totalTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textGrayColor,
    fontFamily: fonts.regular,
  },
  totlaDollar: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textGrayColor,
    fontFamily: fonts.regular,
  },
  appreciationText: {
    alignSelf: 'center',
    marginTop: 12,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textGrayColor,
    fontFamily: fonts.regular,
  },
  rewardItemIcon: {
    height: 24,
    width: 24,

    marginRight: 12,
  },
  rewardItemText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    fontWeight: '600',
    color: colors.primaryText,
    lineHeight: 19,
  },
  progressView: {
    height: 4,
    borderRadius: 50,
    backgroundColor: '#DEDEDE',
    marginTop: 12,
  },
  progressActive: {
    height: 4,
    borderRadius: 50,
    width: '10%',
    backgroundColor: colors.primaryBlue,
  },
});

//make this component available to the app
export default Quest;
