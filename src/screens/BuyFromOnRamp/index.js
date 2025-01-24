import React, { useState } from 'react';
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';


export default function BuyFromOnRamp() {

	const [loading, setLoading] = useState(true);
	const { address } = useSelector(st => st.wallet);

	return (
		<>
			{
				loading
				&&
				<Loader />
			}
			<WebView
				source={{
					uri: `https://onramp.money/app/?appId=247512&walletAddress=${address}&network=erc20`
				}}
				style={{ opacity: 0.99, overflow: 'hidden' }}
				onLoadProgress={() => {
					setLoading(false);
				}}
			/>
		</>
	);
}
