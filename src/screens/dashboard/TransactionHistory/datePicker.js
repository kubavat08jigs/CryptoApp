//import liraries
import moment from 'moment';
import React, { useState } from 'react';
import {
	View,
	Text,
	Image,
	FlatList,
	Pressable,
	Modal,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { CText } from '../../../components';
import { colors } from '../../../helper/colorConstants';
import { icons } from '../../../helper/iconConstant';
import { styles } from './TransactionsStyles';

// create a component
const DateFilter = ({ startDate, endDate, setSelectedStartDate, setSelectedEndDate }) => {

	const defaultRange = [
		{
			label: 'Today',
			value: 0,
		}, {
			label: 'Yesterday',
			value: 1,
		}, {
			label: 'Last 7 Days',
			value: 7,
		}, {
			label: 'Last 30 Days',
			value: 30,
		},
	];
	const [dateType, setDateType] = useState('startDate');
	const [openDatePicker, setOpenDatePicker] = useState(false);

	const [tempStartDate, setTempStartDate] = useState(moment().toDate());
	const [tempEndDate, setTempEndDate] = useState(moment().toDate());

	const onDateRangeDefaultPress = (duration) => {
		const currentDate = moment().toDate();
		const previousDate = moment().subtract(duration, 'd').toDate();
		setSelectedStartDate(previousDate);
		setSelectedEndDate(currentDate);
	};

	const onConfirmPress = () => {
		if (dateType === 'startDate') {
			setDateType('endDate');
		} else {
			setSelectedEndDate(tempEndDate);
			setSelectedStartDate(tempStartDate);
			setDateType('startDate');
			setOpenDatePicker(false);
		}
	};

	return (
		<>
			<Pressable onPress={() => setOpenDatePicker(true)} style={styles.emailContainer}>
				<View style={styles.emailPlaceholderView}>
					<Text style={[styles.emailLableText]}>Date Range</Text>
				</View>
				<View style={styles.dateRangeView}>
					<CText
						txt={
							(startDate && endDate) ?
								(
									startDate === endDate ?
										moment(startDate).format('DD MMM, YYYY')
										:
										`${moment(startDate).format('DD MMM, YYYY')} - ${moment(endDate).format('DD MMM, YYYY')}`
								)
								:
								'All Time'
						}
						m d
					/>
					<Image source={icons.calender} style={{ height: 24, width: 24 }} />
				</View>
			</Pressable>
			<FlatList
				data={defaultRange}
				renderItem={({ item }) => (
					<Pressable
						onPress={() => onDateRangeDefaultPress(item.value)}
						style={{
							borderRadius: 45,
							backgroundColor: '#F1F4FA',
							marginHorizontal: 5,
						}}>
						<CText
							txt={item.label}
							textStyle={{
								fontSize: 10,
								paddingVertical: 5.75,
								paddingHorizontal: 10,
							}}
							d
						/>
					</Pressable>
				)}
				horizontal
				keyExtractor={(item, index) => index?.toString()}
				style={{ marginTop: 12, marginBottom: 16 }}
			/>
			<Modal transparent visible={openDatePicker}>
				<View style={styles.datePickerModalContainer}>
					<View
						style={{
							backgroundColor: 'white',
							padding: 25,
							borderRadius: 8
						}}
					>
						<Text
							style={{
								color: colors.primaryBlack,
								fontWeight: '600',
								fontSize: 16,
								marginBottom: 15
							}}
						>
							{dateType === 'startDate' ? 'Select Start Date' : 'Select End Date'}
						</Text>
						<DatePicker
							date={
								dateType === 'startDate' ? (tempStartDate ?? new Date()) : (tempEndDate ?? new Date())
							}
							minimumDate={
								dateType === 'startDate' ? (new Date('2016-01-01')) : tempStartDate
							}
							maximumDate={new Date()}
							onDateChange={date => {
								console.log(date);
								if (dateType === 'startDate') {
									setTempStartDate(date);
								} else {
									setTempEndDate(date);
								}
							}}
							onCancel={() => {
								setDateType('startDate');
								setOpenDatePicker(false);
							}}
							mode="date"
							textColor={colors.primaryText}
						/>
						<View style={styles.modalBtnView}>
							<Pressable
								style={styles.btnContainer}
								onPress={onConfirmPress}>
								<Text style={styles.modalBtnText}>Confirm</Text>
							</Pressable>
							<Pressable
								style={styles.btnContainer}
								onPress={() => {
									setDateType('startDate');
									setOpenDatePicker(false);
								}}>
								<Text style={styles.modalBtnText}>Cancel</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
};
//make this component available to the app

export default DateFilter;
