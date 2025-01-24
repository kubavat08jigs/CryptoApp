import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import {MainHeader} from '../../components';
import {colors} from '../../helper/colorConstants';
import {fonts} from '../../helper/fontconstant';
import RoundedView from '../../components/Common/RoundedView';
import {icons} from '../../helper/iconConstant';
import {useSelector} from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';
import {_fetch} from '../../utils/_fetch';
import {baseUrl2} from '../../utils/consts';
import {hp, wp} from '../../helper/utils';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getLocalText} from '../../helper/globalFunctions';

const ReferralDetails = () => {
  const {referral_code, jwtToken} = useSelector(st => st.user);
  const [referralCount, setReferralCount] = useState('');
  const [referralCommission, setReferralCommission] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      let res = await _fetch(`${baseUrl2}/rewards`, {
        method: 'GET',
        token: jwtToken,
      });
      res = await res.json();
      if (res.status === 200) {
        setReferralCount(res.data?.successful ?? 0);
        setReferralCommission(`${res.data?.commission ?? 10}%`);
        setIsLoading(false);
        AsyncStorage.setItem(
          'referralCount',
          JSON.stringify({
            count: res.data.successful,
            commission: res.data.commission,
          }),
        );
      } else {
        const data = JSON.parse(await AsyncStorage.getItem('referralCount'));
        setReferralCount(data?.successful ?? 0);
        setReferralCommission(`${data?.commission ?? 10}%`);
        setIsLoading(false);
      }
    } catch (e) {
      console.log('error', e);
      const data = JSON.parse(await AsyncStorage.getItem('referralCount'));
      setReferralCount(data?.successful ?? 0);
      setReferralCommission(`${data?.commission ?? 10}%`);
      setIsLoading(false);
    }
  };

  const init = useCallback(fetchData, [jwtToken]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <View style={styles.container}>
      <MainHeader title={getLocalText('Referral Rewards')} />
      {isLoading ? (
        <Loader size={75} height="60%" />
      ) : (
        <ScrollView>
          <Earnings />
          <View style={styles.referralCountRow}>
            <ReferralCount
              firstLine={'Your'}
              secondLine={'Referrals'}
              count={referralCount}
              isLoading={isLoading}
            />
            <ReferralCount
              firstLine={'Lifetime'}
              secondLine={'Commissions'}
              count={referralCommission}
            />
          </View>
          <Referral referral_code={referral_code} />
        </ScrollView>
      )}
    </View>
  );
};

const Earnings = () => {
  return (
    <RoundedView style={styles.earnings}>
      <View style={[styles.row]}>
        <View style={styles.unClaimedView}>
          <View style={styles.textWithInfo}>
            <Text style={styles.earningsLabel}>
              {getLocalText('Total Rewards')}
            </Text>
            <Image source={icons.infoFill} style={styles.infoIcon} />
          </View>
          <Text style={styles.earningsText}>****</Text>
        </View>
        <View style={styles.withdrawView}>
          <Text style={[styles.earningsLabel, styles.withDrawLabel]}></Text>
          <RoundedView style={styles.claimButton}>
            <Text style={styles.claimButtonText}>
              {getLocalText('Coming Soon')}
            </Text>
          </RoundedView>
        </View>
      </View>
    </RoundedView>
  );
};

const ReferralCount = ({firstLine, secondLine, count}) => {
  return (
    <RoundedView style={styles.referralCountView}>
      <Text style={styles.earningsLabel}>{firstLine}</Text>
      <View style={styles.textWithInfo}>
        <Text style={styles.earningsLabel}>{secondLine}</Text>
        <Image source={icons.infoFill} style={styles.infoIcon} />
      </View>
      <Text style={styles.referralCountText}>{count}</Text>
    </RoundedView>
  );
};

const Referral = ({referral_code}) => {
  const copyReferralCode = () => {
    Clipboard.setString(referral_code);
    ToastAndroid.show('Copied!!', ToastAndroid.SHORT);
  };

  const share = async () => {
    Share.open({
      message: `
Hey there,
Get your free web3 domain worth upto $20.
Just download Dolf app and use my referral code ${referral_code}.
https://play.google.com/store/apps/details?id=dolf.app
Dolf is a truly-multichain & self-custodial crypto wallet - the only wallet you'll ever need!
Hurry up, it's limited to early users only!
      `,
    }).catch(e => {
      console.log('ShareError', e);
    });
  };

  return (
    <RoundedView style={styles.referral}>
      <Text style={styles.inviteHeaderText}>
        {getLocalText('Invite and Earn')}
      </Text>
      <Text style={[styles.earningsLabel, styles.commissionLabel]}>
        {getLocalText('Get upto 25% commission for lifetime')}
      </Text>
      <View style={styles.referralCodeContainer}>
        <TouchableOpacity
          onPress={copyReferralCode}
          style={[styles.referralCodeView, styles.flexGrow]}>
          <Text style={styles.referralCodeText}>{referral_code}</Text>
          <Image
            source={icons.copy}
            style={styles.copyIcon}
            resizeMode="stretch"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.referralCodeView, styles.inviteNowView]}
          onPress={share}>
          <Image
            source={icons.fi_share}
            style={styles.fileShareIcon}
            resizeMode="stretch"
          />
          <Text style={styles.referralCodeText}>
            {getLocalText('Invite Now')}
          </Text>
        </TouchableOpacity>
      </View>
      <LearnHow />
    </RoundedView>
  );
};

const LearnHow = () => {
  return (
    <TouchableOpacity style={styles.learnHowView}>
      <Text style={styles.linkText}>
        {getLocalText('Learn how this works')}
      </Text>
      <Image
        source={icons.arrowCircleRight}
        style={styles.arrowIcon}
        resizeMode="center"
      />
    </TouchableOpacity>
  );
};
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
  },
  row: {
    flexDirection: 'row',
  },
  earnings: {
    paddingHorizontal: 21,
    paddingVertical: 35,
    marginTop: 18,
    alignItems: 'baseline',
  },
  earningsLabel: {
    fontFamily: fonts.regular,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 17,
    color: colors.textGrayColor,
  },
  earningsText: {
    fontFamily: fonts.bold,
    fontWeight: '500',
    fontSize: 40,
    lineHeight: 48,
    color: colors.primaryBlack,
  },
  referralCountRow: {
    flexDirection: 'row',
    marginHorizontal: wp(21),
  },
  unClaimedView: {
    alignItems: 'flex-start',
    marginEnd: 10,
    flex: 1,
  },
  withdrawView: {
    alignItems: 'flex-end',
    marginStart: 10,
    flex: 1,
  },
  withDrawLabel: {
    width: '100%',
    textAlign: 'center',
  },
  claimButton: {
    marginTop: 10,
    borderColor: colors.primaryBlue,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginHorizontal: 0,
  },
  claimButtonText: {
    fontFamily: fonts.regular,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 17,
    color: colors.primaryBlue,
  },
  referralCountView: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
    marginHorizontal: 5,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginTop: 20,
  },
  referralCountText: {
    fontFamily: fonts.bold,
    fontWeight: '500',
    fontSize: 32,
    lineHeight: 38,
    color: colors.primaryBlack,
    marginTop: 8,
  },
  loader: {
    margin: 8,
  },
  textWithInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: 13,
    height: 13,
    marginStart: 2,
  },
  arrowIcon: {
    width: 16,
    height: 16,
    marginStart: 2,
  },
  referral: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 20,
    padding: 24,
    paddingVertical: 20,
    backgroundColor: colors.grey,
    borderColor: colors.borderColor,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  inviteNowView: {
    marginStart: 5,
  },
  referralCodeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  referralCodeView: {
    borderWidth: 1,
    borderRadius: 7,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    justifyContent: 'space-between',
    borderColor: colors.borderColor,
    paddingHorizontal: wp(12),
    paddingVertical: wp(12),
  },
  flexGrow: {
    flexGrow: 1,
  },
  referralCodeText: {
    fontSize: 14,
    color: colors.primaryBlack,
    fontFamily: fonts.bold,
  },
  copyIcon: {
    width: 20,
    height: 20,
  },
  fileShareIcon: {
    width: 20,
    height: 20,
    marginHorizontal: wp(10),
  },
  inviteHeaderText: {
    color: colors.primaryText,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  referralCode: {
    fontFamily: fonts.bold,
    fontWeight: '500',
    fontSize: 40,
    lineHeight: 48,
    color: colors.primaryBlack,
  },
  referralIconView: {
    borderRadius: 6,
    backgroundColor: colors.primaryBlue,
    marginTop: 0,
    paddingHorizontal: 16,
    paddingVertical: 11,
    marginHorizontal: 0,
  },
  referralIcon: {
    height: 15,
    width: 15,
  },
  commissionLabel: {
    marginTop: 5,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.primaryBlue,
    alignSelf: 'center',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: colors.primaryBlue,
  },
  learnHowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

//make this component available to the app
export default ReferralDetails;
