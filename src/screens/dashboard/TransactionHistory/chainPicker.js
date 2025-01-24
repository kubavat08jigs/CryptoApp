//import liraries
import React, { useRef } from 'react';
import {
	View,
	Text,
	Image,
	FlatList,
	Pressable,
} from 'react-native';
import { useSelector } from 'react-redux';
import { BottomSheetModal, CText } from '../../../components';
import CustomImage from '../../../components/Common/Image';
import { colors } from '../../../helper/colorConstants';
import { styles } from './TransactionsStyles';


function ChainBottomSheet({ setSelectedChain, selectedChain, sheetRef }) {

	const { allChains } = useSelector(st => st.chain);
	return (
		<View style={{ marginTop: 15, paddingBottom: 40 }}>
			<Text style={styles.sheetTitle}>Select Chain</Text>
			<FlatList
				style={{ alignSelf: 'center', marginTop: 16 }}
				data={allChains}
				renderItem={({ item }) => (
					<Pressable
						onPress={() => {
							setSelectedChain(item);
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
								uri={item?.imageUrl}
							/>
							<CText txt={item?.name} m />
						</View>
						<View style={styles.itemRightView}>
							<View
								style={[
									styles.selectionView,
									{
										borderColor:
											selectedChain?.chainId === item?.chainId
												? colors.primaryBlue
												: '#DEE4F4',
									},
								]}>
								{selectedChain?.chainId === item?.chainId && (
									<View style={styles.activeRadio} />
								)}
							</View>
						</View>
					</Pressable>
				)}
			/>
		</View>
	);
};

// create a component
const ChainFilter = ({ setSelectedChain, selectedChain }) => {

	const refRBSheet = useRef();

	return (
		<>
			<Pressable onPress={() => refRBSheet.current.open()} style={styles.emailContainer}>
				<View style={styles.emailPlaceholderView}>
					<Text style={[styles.emailLableText]}>Chain</Text>
				</View>
				<View style={{flexDirection: 'row'}}>
					{
						selectedChain
							?
							<>
								<CustomImage uri={selectedChain?.imageUrl} style={{ height: 24, width: 24, marginRight: 10 }} />
								<CText txt={selectedChain?.name} m d />
							</>
							:
							<CText txt='All Chains' m d />
					}
				</View>
			</Pressable>
			<BottomSheetModal
				ref1={refRBSheet}
				children={
					<ChainBottomSheet
						setSelectedChain={setSelectedChain}
						selectedChain={selectedChain}
						sheetRef={refRBSheet}
					/>
				}
			/>
		</>
	);
};
//make this component available to the app

export default ChainFilter;
