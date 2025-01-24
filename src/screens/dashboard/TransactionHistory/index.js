//import liraries
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	FlatList,
	ScrollView,
} from 'react-native';
import { BottomSheetModal, MainHeader } from '../../../components';
import Loader from '../../../components/Loader';
import { getLocalText } from '../../../helper/globalFunctions';
import { icons } from '../../../helper/iconConstant';
import { NoTransaction } from '../../../helper/svgconstant';
import { baseUrl2 } from '../../../utils/consts';
import useFetch from '../../../utils/_fetch';
import AssetFilter from './assetPicker';
import ChainFilter from './chainPicker';
import DateFilter from './datePicker';
import IconIon from 'react-native-vector-icons/Ionicons';
import { TransactionItem } from './transactionItem';
import { styles } from './TransactionsStyles';
import Button from '../../../components/Common/Button';

// create a component
const TransactionHistory = () => {

	const [selectedSort, setSelectedSort] = useState('');
	const [data, setData] = useState([]);
	const total = useRef(0);
	const [selectedStartDate, setSelectedStartDate] = useState();
	const [selectedEndDate, setSelectedEndDate] = useState();
	const [selectedChain, setSelectedChain] = useState();
	const [selectedAssetType, setSelectedAssetType] = useState();
	const [appliedStartDate, setAppliedStartDate] = useState();
	const [appliedEndDate, setAppliedEndDate] = useState();
	const [appliedChain, setAppliedChain] = useState();
	const [appliedAssetType, setAppliedAssetType] = useState();
	const limit = 10;
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [switchSort, setSwitchSort] = useState('');

	const _fetch = useFetch();

	const refRBSheet = useRef();
	const refRBFilterSheet = useRef();

	const renderChainItem = ({ item }) => {
		return (
			<TransactionItem
				item={item}
				isLeftIocn
				isLeftCoinIcon={item.logo_url}
				isAmountViewVisible={item?.amount}
				isRightIcon
				isChangeAmountText
				selectedSort={selectedSort}
			/>
		);
	};

	const onFilterPress = () => {
		refRBFilterSheet?.current?.open();
	};

	const onFilterApply =() => {
		setAppliedAssetType(selectedAssetType);
		setAppliedChain(selectedChain);
		setAppliedStartDate(selectedStartDate);
		setAppliedEndDate(selectedEndDate);
		refRBFilterSheet?.current?.close();
	};

	const onFilterClear =() => {
		setAppliedAssetType(undefined);
		setSelectedAssetType(undefined);
		setAppliedChain(undefined);
		setSelectedChain(undefined);
		setAppliedStartDate(undefined);
		setSelectedStartDate(undefined);
		setAppliedEndDate(undefined);
		setSelectedEndDate(undefined);
		refRBFilterSheet?.current?.close();

	};

	const filterBottomSheet = () => {
		return (
      <View style={styles.bottomSheetStyle}>
        <Text style={styles.sheetTitle}>{getLocalText('Filters')}</Text>
        <DateFilter
          startDate={selectedStartDate}
          endDate={selectedEndDate}
          setSelectedStartDate={setSelectedStartDate}
          setSelectedEndDate={setSelectedEndDate}
        />
        {/* <RenderMaterialInput
					title={'Transaction Type'}
					val={transactionType}
					onPress={onTransactionTypePress}
				/> */}
        <AssetFilter
          setSelectedAsset={setSelectedAssetType}
          selectedAsset={selectedAssetType}
        />
        <ChainFilter
          setSelectedChain={setSelectedChain}
          selectedChain={selectedChain}
        />
        <View
          style={styles.buttonsView}>
          <Button
            style={[styles.bottomButton, styles.clearButton]}
            titleStyle={styles.clearButtonTitle}
            title={'Clear'}
            onPress={onFilterClear}
          />
          <Button
            style={styles.bottomButton}
            title={'Apply'}
            onPress={onFilterApply}
          />
        </View>
      </View>
    );
	};

	// https://betaapi.dolf.finance/dapp-api/getWalletTransactions?date-start=01032023&date-end=12032023&asset=ETH&chain_id=5&contract-address=0x07865c6e87b9f70255377e024ace6630c1eaa37f&limit=12&page=0
	async function getData(resetData = false) {
		try {
			console.log('------------in getdata---------------');
			setLoading(true);
			console.log(appliedChain);

			let query = `limit=${limit}&page=${resetData ? 1 : page}`;

			if (appliedAssetType) {
				query += `&symbol=${appliedAssetType.symbol}`;
			}
			if (appliedChain) {
				query += `&chain-id=${appliedChain.chainId}`;
			}
			if (appliedStartDate) {
				query += `&date-start=${moment(appliedStartDate).format('DDMMYYYY')}`;
			}
			if (appliedEndDate) {
				query += `&date-end=${moment(appliedEndDate).format('DDMMYYYY')}`;
			}
			if (switchSort) {
				query += `&sort=${switchSort}`;
			}

			console.log('query', `${baseUrl2}/getWalletTransactions?${query}`);

			let res = await _fetch(`${baseUrl2}/getWalletTransactions?${query}`);
			res = await res.json();
			console.log('response', res);
			if (res.status === 200) {
				console.log(res);
				total.current = res.total;
				if (resetData) {
					setData(res.payload);
				} else {
					setData([...data, ...res.payload]);
				}
			}
		} catch (e) { console.log(e); } finally { setLoading(false) }
	}

	useEffect(() => {
		console.log('-----------getting data-----------');
		getData();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	useEffect(() => {
		console.log('------------applying filters or sort---------------')
		console.log(appliedEndDate);
		console.log(appliedStartDate);
		console.log(appliedAssetType);
		console.log(appliedChain);
		console.log(switchSort);
		if (page === 1) {
			getData(true);
		} else {
			setPage(1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [appliedEndDate, appliedEndDate, appliedChain, appliedAssetType, switchSort]);

	return (
		<View style={styles.container}>
			<MainHeader title={'Transaction History'} />
			<View style={styles.sortFilterContainer}>
				<TouchableOpacity onPress={() => setSwitchSort(pre => pre === 'desc' || pre === '' ? 'asc' : 'desc')} style={styles.sortView}>
					<Image
						style={{ height: 16, width: 16, marginLeft: 10 }}
						source={switchSort === 'desc' || switchSort === '' ? icons.bigArrorDown : icons.bigArrorUp}
					/>
					<Text style={styles.sortFilterTitle}>Sort</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={onFilterPress} style={styles.sortView}>
					<Image source={icons.filter} style={styles.sortFilterIcon} />
					<Text style={styles.sortFilterTitle}>Filter</Text>
				</TouchableOpacity>
			</View>
			<View style={{ flexDirection: 'row', marginTop: 14, marginHorizontal: 24 }}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{appliedChain && (
						<View style={styles.selectedFilterView}>
							<Text style={styles.filterTitleText}>
								Chain :{' '}
								<Text style={styles.filterSelectedVal}>{appliedChain.name}</Text>
							</Text>
							<IconIon name="close" size={20} style={styles.removeFilter} onPress={() => setAppliedChain(null)} />
						</View>
					)}
					{appliedAssetType && (
						<View style={styles.selectedFilterView}>
							<Text style={styles.filterTitleText}>
								Asset : <Text style={styles.filterSelectedVal}>{appliedAssetType.symbol}</Text>
							</Text>
							<IconIon name="close" size={20} style={styles.removeFilter} onPress={() => setAppliedAssetType(null)} />
						</View>
					)}
					{appliedStartDate && appliedEndDate && (
						<View style={styles.selectedFilterView}>
							<Text style={styles.filterTitleText}>
								Date : <Text style={styles.filterSelectedVal}>
									{
										moment(appliedStartDate).format('DDMMYYYY') === moment(appliedEndDate).format('DDMMYYYY') ?
											'Today'
											:
											`${moment(appliedStartDate).format('DD MMM, YY')} - ${moment(appliedEndDate).format('DD MMM, YY')}`
									}
								</Text>
							</Text>
							<IconIon name="close" size={20} style={styles.removeFilter}
								onPress={() => { setAppliedEndDate(null); setAppliedStartDate(null); }}
							/>
						</View>
					)}
				</ScrollView>
			</View>
			<View style={styles.saperatorView} />
			{
				loading ? <Loader size={75} height="60%" /> :
					data.length ?
						<FlatList
							data={data}
							contentContainerStyle={{ paddingBottom: 20 }}
							extraData={data}
							renderItem={renderChainItem}
							keyExtractor={(item, index) => index?.toString()}
							onEndReached={async () => {
								if ((page + 1) * limit < total.current) {
									setPage(page + 1);
								}
							}}
						/>
						:
						<View style={styles.emptyStateView}>
							<NoTransaction />
							<Text style={styles.emptyStateTitle}>No Transactions Yet</Text>
						</View>
			}
			<BottomSheetModal
				ref1={refRBFilterSheet}
				children={filterBottomSheet()}
			/>
		</View>
	);
};
//make this component available to the app

export default TransactionHistory;
