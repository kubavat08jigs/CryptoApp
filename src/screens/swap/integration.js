import { ethers } from 'ethers';
import blockchain from '../../utils/blockchain';




async function getLiFiTokens(chains) {
	let result = await fetch(`https://li.quest/v1/tokens?chains=${chains.join(',')}`);
	result = await result.json();
	return result;
}


export const getFromAndToTokens = async (balancePerCoin, chains) => {
	try {
		let to = [];
		let from = [];

		let chainIds = chains.filter(e => e.chainId !== 5).map(e => e.chainId);
		let res = await getLiFiTokens(chainIds);

		let chainContractMap = {};
		let chainNativeMap = {};

		balancePerCoin.forEach(e => {
			e.chains.forEach(c => {
				if (chainContractMap[`${c.chain_id}`]) {
					chainContractMap[`${c.chain_id}`][c.contract_address?.toLowerCase()] = c;
				} else {
					chainContractMap[`${c.chain_id}`] = { [c.contract_address?.toLowerCase()]: c };
				}

				if (c.native_token) {
					chainNativeMap[`${c.chain_id}`] = c;
				}

			});
		});


		if (res.tokens) {
			let allChainTokens = res.tokens;

			for (let key in allChainTokens) {
				let chain = chains.find(e => `${e.chainId}` === key);
				if (chain) {
					let arr1 = [];
					let arr2 = [];
					for (let i = 0; i < allChainTokens[key].length; i++) {
						let tok = allChainTokens[key][i];

						let chainData = chainContractMap[key] ? chainContractMap[key][tok.address] : null;
						arr1.push({
							...tok,
							contract_decimals: chainData?.contract_decimals,
							balance: chainData?.balance ?? 0,
							quote: chainData?.quote ?? 0,
							quote_rate: chainData?.quote_rate ?? 0,
							native: chainData?.native_token,
						});

						let chainData2;
						// 0x0000000000000000000000000000000000000000 is native token in LiFi, it may be different for other providers need to keep a map for it
						if (tok.address === '0x0000000000000000000000000000000000000000') {
							chainData2 = chainNativeMap[key];
						} else {
							chainData2 = chainContractMap[key][tok.address.toLowerCase()];
						}

						if (chainData2) {
							arr2.push({
								...tok,
								balance: chainData2.balance,
								quote: chainData2.quote,
								quote_rate: chainData2.quote_rate,
								native: chainData2?.native_token,
							});
						}
					}

					to.push({
						chain,
						tokens: arr1,
					});

					from.push({
						chain,
						tokens: arr2,
					});
				}
			}

		}

		return {
			to,
			from,
		};

	} catch (err) {
		console.log(err);
		return { to: [], from: [] };
	}
};

const API_URL = 'https://li.quest/v1';

function getQueryParams(obj) {
	let str = '';
	let total = Object.keys(obj).length;
	let i = 1;
	for (let key in obj) {
		str += `${key}=${obj[key]}${total === i ? '' : '&'}`;
		i++;
	}
	return str;
}

// Get a quote for your desired transfer
export const getQuote = async ({
	fromChainId,
	fromAmount,
	fromTokenAddress,
	toChainId,
	toTokenAddress,
	fromAddress,
}) => {
	const obj = {
		fromChain: fromChainId,
		toChain: toChainId,
		fromToken: fromTokenAddress,
		toToken: toTokenAddress,
		fromAmount,
		fromAddress,
	};

	console.log(obj);
	let query = getQueryParams(obj);
	console.log(query);
	console.log(`${API_URL}/quote?${query}`);
	let result = await fetch(`${API_URL}/quote?${query}`);

	// let text = await result.text();

	// console.log(text);

	result = await result.json();
	console.log(result);
	return result;
};

// Check the status of your transfer
const getStatus = async (bridge, fromChain, toChain, txHash) => {
	const obj = {
		bridge,
		fromChain,
		toChain,
		txHash,
	};
	let result = await fetch(`${API_URL}/status?${getQueryParams(obj)}`);
	result = await result.json();
	return result;
};

export const swap = async ({
	fromChainId,
	fromAmount,
	fromTokenAddress,
	toChainId,
	toTokenAddress,
	key,
	fromAddress,
	provider_url,
}) => {

	try {


		const quote = await getQuote({
			fromChainId,
			toChainId,
			fromTokenAddress,
			toTokenAddress,
			fromAmount,
			fromAddress,
		});

		if (!quote.transactionRequest) {
			return ({
				success: false,
				message: quote.message
			});
		}

		console.log(quote);


		const provider = ethers.getDefaultProvider(provider_url[`${quote.transactionRequest.chainId}`].INFURA);
		const wallet = new ethers.Wallet(key, provider);

		console.log(quote.transactionRequest);

		//don't performApproval for native tokens
		if (fromTokenAddress !== '0x0000000000000000000000000000000000000000') {
			await blockchain.performApproval(
				fromAmount,
				fromAddress,
				fromTokenAddress,
				quote.estimate.approvalAddress,
				provider_url[`${quote.transactionRequest.chainId}`].INFURA,
				key,
			);
		}
		const tx = await wallet.sendTransaction(quote.transactionRequest);

		let result = await tx.wait();
		console.log(result);

		// Only needed for cross chain transfers
		// in the case of cross chain swap the verification time may take a while so need to display the status to user by storing the details locally
		if (fromChainId !== toChainId) {
			do {
				result = await getStatus(quote.tool, fromChainId, toChainId, tx.hash);
			} while (result.status !== 'DONE' && result.status !== 'FAILED');
		}

		console.log(result);

		return ({
			success: true,
			data: result,
		});

	} catch (err) {
		console.log(err);
		let message = 'Some error occurred please try again later';
		try {
			let { error: bodyError } = JSON.parse(err.error.body);
			console.log(bodyError);
			message = bodyError.message;
		} catch (e) {
			console.log(e);
			return ({
				success: false,
				message,
			});
		}
		console.log(message);
		return ({
			success: false,
			message,
		});
	}

};
