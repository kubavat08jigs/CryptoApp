//import liraries
import React, { useMemo, useRef, useState } from 'react';
import {
	View,
	Text,
	Image,
	FlatList,
	Pressable,
	Dimensions,
	StyleSheet,
	TextInput,
} from 'react-native';
import { useSelector } from 'react-redux';
import { BottomSheetModal, CText } from '../../../components';
import CustomImage from '../../../components/Common/Image';
import { colors } from '../../../helper/colorConstants';
import { fonts } from '../../../helper/fontconstant';
import { icons } from '../../../helper/iconConstant';
import { styles } from './TransactionsStyles';


function AssetBottomSheet({ setSelectedAsset, selectedAsset, sheetRef }) {

	const { balancePerCoin } = useSelector(st => st.wallet);
	const [searchText, setSearchText] = useState('');

	const data = useMemo(() => {
		if (searchText) {
			let searchTerm = searchText.toLowerCase();
			let _data = balancePerCoin.filter(e => e.name.toLowerCase().includes(searchTerm));
			return _data;
		} else {
			return balancePerCoin;
		}
	}, [searchText, balancePerCoin]);

	return (
		<View style={{ marginTop: 15, paddingBottom: 40 }}>
			<Text style={styles.sheetTitle}>Select Asset</Text>
			<FlatList
				style={{ alignSelf: 'center', marginTop: 16 }}
				data={data}
				renderItem={({ item }) => (
					<Pressable
						onPress={() => {
							setSelectedAsset(item);
							sheetRef?.current?.close();
						}}
						style={[
							styles.chainItemContainer, {
								backgroundColor: colors.primaryWhite,
							},
						]}
					>
						<View style={[styles.leftView, { marginLeft: 12 }]}>
							<CustomImage
								style={{ height: 24, width: 24, marginRight: 10 }}
								uri={item?.logo_url}
							/>
							<CText txt={item?.name} m />
						</View>
						<View style={styles.itemRightView}>
							<View
								style={[
									styles.selectionView,
									{
										borderColor:
											selectedAsset?.dolfId === item?.dolfId
												? colors.primaryBlue
												: '#DEE4F4',
									},
								]}>
								{selectedAsset?.dolfId === item?.dolfId && (
									<View style={styles.activeRadio} />
								)}
							</View>
						</View>
					</Pressable>
				)}
				ListHeaderComponent={
					<View style={searchStyles.container}>
						<Image source={icons.searchIcon} style={searchStyles.searchIconStyle} />
						<TextInput
							value={searchText}
							onChangeText={(text) => setSearchText(text)}
							style={[searchStyles.searchInputStyle]}
							placeholder='Search Asset'
						/>
					</View>
				}
			/>
		</View>
	);
};

const searchStyles = StyleSheet.create({
	container: {
		height: 44,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#DFDFDF',
		backgroundColor: colors.primaryWhite,
		paddingHorizontal: 20,
		flexDirection: 'row',
		alignItems: 'center',
		width: Dimensions.get('screen').width - 40,
		marginBottom: 10,
	},
	searchIconStyle: {
		height: 16,
		width: 16,
		marginRight: 8,
	},
	searchInputStyle: {
		fontSize: 14,
		fontWeight: '600',
		fontFamily: fonts.regular,
		color: colors.activeBlack,
		flex: 1
	},
});

// create a component
const AssetFilter = ({ setSelectedAsset, selectedAsset }) => {

	const refRBSheet = useRef();

	return (
		<>
			<Pressable onPress={() => refRBSheet.current.open()} style={styles.emailContainer}>
				<View style={styles.emailPlaceholderView}>
					<Text style={[styles.emailLableText]}>Select Asset</Text>
				</View>
				<View style={{ flexDirection: 'row' }}>
					{
						selectedAsset
							?
							<>
								<CustomImage uri={selectedAsset?.logo_url} style={{ height: 24, width: 24, marginRight: 10 }} />
								<CText txt={selectedAsset?.name} m d />
							</>
							:
							<CText txt='All assets' m d />
					}
				</View>
			</Pressable>
			<BottomSheetModal
				ref1={refRBSheet}
				children={
					<AssetBottomSheet
						setSelectedAsset={setSelectedAsset}
						selectedAsset={selectedAsset}
						sheetRef={refRBSheet}
					/>
				}
			/>
		</>
	);
};
//make this component available to the app

export default AssetFilter;
