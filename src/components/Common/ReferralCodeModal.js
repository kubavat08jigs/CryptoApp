import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSelector } from 'react-redux';
import { colors } from '../../helper/colorConstants';
import { fonts } from '../../helper/fontconstant';
import { hp, wp } from '../../helper/utils';
import { baseUrl2 } from '../../utils/consts';
import { _fetch } from '../../utils/_fetch';
import PrimaryButton from './PrimaryButton';

export default function ReferalCodeModal({ visible, setVisible, result }) {
	const [referral, setReferral] = useState('');
	const { jwtToken, email } = useSelector(st => st.user);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const onApply = async () => {
		setLoading(true);
		try {
			console.log(jwtToken, email);
			let res = await _fetch(`${baseUrl2}/add-referral-code`, {
				method: 'POST',
				token: jwtToken,
				body: {
					referralCode: referral,
				},
			});
			res = await res.json();
			console.log(res);
			if (res.status >= 200 && res.status < 300) {
				result({ success: true, code: referral });
				setVisible(false);
				setReferral(false);
			} else {
				setError(res.message);
				result({ success: false });
			}
		} catch (e) {
			console.log(e);
			result({ success: false });
		} finally { setLoading(false); }
	};

	const onRequestClose = () => {
		setVisible(false);
		setReferral(false);
		setError(false);
	}

	return (
		<Modal visible={visible} onRequestClose={onRequestClose}>
			<Text style={styles.skipTest} onPress={onRequestClose}>SKIP</Text>
			<View style={{ justifyContent: 'space-between', flexDirection: 'column', height: '95%' }}>

				<View style={{ marginTop: hp(80) }}>
					<Text style={styles.enternumText}>Enter Referral Code</Text>
					<TextInput
						placeholder="DOLFREF"
						onChangeText={(e) => { setReferral(e); setError(''); }}
						style={styles.textInputStyle}
						maxLength={10}
					/>
					{error && <Text style={styles.errorText}>{error}</Text>}
				</View>
				<PrimaryButton
					isLoader={loading}
					disable={!referral}
					title={'Apply'}
					onPress={onApply}
				/>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	enternumText: {
		fontSize: 24,
		fontFamily: fonts.bold,
		fontWeight: '600',
		color: colors.darkest,
		alignSelf: 'center',
	},
	errorText: {
		fontSize: 14,
		marginTop: 15,
		fontFamily: fonts.medium,
		textAlign: 'center',
		color: colors.errorText
	},
	skipTest: {
		fontSize: 16,
		fontFamily: fonts.medium,
		fontWeight: '500',
		textAlign: 'right',
		marginRight: 20,
		color: colors.primaryBlue,
	},
	textInputStyle: {
		alignSelf: 'center',
		width: wp(336),
		backgroundColor: '#ECECEC',
		height: hp(64),
		borderRadius: 12,
		marginTop: hp(48),
		flexDirection: 'row',
		alignItems: 'center',
		fontSize: 24,
		fontWeight: '800',
		fontFamily: fonts.bold,
		textAlign: 'center',
	},
})