import '@ethersproject/shims';
import { BigNumber, ethers } from 'ethers';
import { Buffer } from 'buffer';
import { gasPriceAdjustment } from './consts';


global.Buffer = global.Buffer || Buffer;

// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const ERC20_Abi = [
	// Some details about the token
	"function name() view returns (string)",
	"function symbol() view returns (string)",
	"function decimals() view returns (uint)",

	// Get the account balance
	"function balanceOf(address) view returns (uint)",

	// Send some of your tokens to someone else
	"function transfer(address to, uint amount)",
	"function allowance(address owner, address spender)",

	// An event triggered whenever anyone transfers to someone else
	"event Transfer(address indexed from, address indexed to, uint amount)"
];

const ERC20_FULL_ABI = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_upgradedAddress", "type": "address" }], "name": "deprecate", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "deprecated", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_evilUser", "type": "address" }], "name": "addBlackList", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "upgradedAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balances", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "maximumFee", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "_totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "unpause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_maker", "type": "address" }], "name": "getBlackListStatus", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowed", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "paused", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "who", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "pause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getOwner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newBasisPoints", "type": "uint256" }, { "name": "newMaxFee", "type": "uint256" }], "name": "setParams", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "issue", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "redeem", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "remaining", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "basisPointsRate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "isBlackListed", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_clearedUser", "type": "address" }], "name": "removeBlackList", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "MAX_UINT", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_blackListedUser", "type": "address" }], "name": "destroyBlackFunds", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "_initialSupply", "type": "uint256" }, { "name": "_name", "type": "string" }, { "name": "_symbol", "type": "string" }, { "name": "_decimals", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "amount", "type": "uint256" }], "name": "Issue", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "amount", "type": "uint256" }], "name": "Redeem", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "newAddress", "type": "address" }], "name": "Deprecate", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "feeBasisPoints", "type": "uint256" }, { "indexed": false, "name": "maxFee", "type": "uint256" }], "name": "Params", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "_blackListedUser", "type": "address" }, { "indexed": false, "name": "_balance", "type": "uint256" }], "name": "DestroyedBlackFunds", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "_user", "type": "address" }], "name": "AddedBlackList", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "_user", "type": "address" }], "name": "RemovedBlackList", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Pause", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Unpause", "type": "event" }];

const getChainId = async (providerUrl) => {
	try {
		const ethersProvider = ethers.getDefaultProvider(providerUrl);
		const networkDetails = await ethersProvider.getNetwork();
		return networkDetails;
	} catch (error) {
		return error;
	}
};

const increaseByPercent = (amount, percent = 10) => {
	console.log(amount)
	const tenPercent = amount.mul(BigNumber.from(percent)).div(BigNumber.from(100));
	return amount.add(tenPercent);
};

const getAccounts = async key => {
	try {
		const wallet = new ethers.Wallet(key);
		const address = await wallet.address;
		return address;
	} catch (error) {
		return error;
	}
};

async function getNativeBalance(key, providerUrl) {
	console.log('Provider->', providerUrl);
	try {
		const provider = ethers.getDefaultProvider(providerUrl);
		const wallet = new ethers.Wallet(key, provider);
		const balance = await wallet.getBalance();
		return balance;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

const getFormatedAddress = address => {
	try {
		return ethers.utils.getAddress(address);
	} catch (error) {
		return address;
	}
};

async function getERC20TokenBalance(key, providerUrl, address, contractAddress) {
	const provider = ethers.getDefaultProvider(providerUrl);
	const wallet = new ethers.Wallet(key, provider);
	console.log('Wallet Balance', (await wallet.getBalance()).toBigInt());
	try {
		let contract;
		try {
			contract = new ethers.Contract(ethers.utils.getAddress(contractAddress), ERC20_Abi, wallet);
		} catch (err) {
			contract = new ethers.Contract(contractAddress, ERC20_Abi, wallet);
		}
		const balance = await contract.balanceOf(address);
		console.log(balance);
		// const decimal = await contract.decimals();
		return balance;
	} catch (error) {
		console.log(error);
		return 0;
	}
}


const buildProtocolTransaction = async (
	providerUrl,
	protocol_address,
	abi,
	inputToken,
	amount,
	address,
	key
) => {
	const provider = ethers.getDefaultProvider(providerUrl);
	const contract = new ethers.Contract(protocol_address, abi, provider);
	const wallet = new ethers.Wallet(key, provider);
	let gas = await wallet.getGasPrice();
	const nonce = await getNonce(address, providerUrl);
	const tx = await contract.populateTransaction.deposit(inputToken, amount, address, 2, {
		nonce: nonce,
		gasPrice: gas.mul(BigNumber.from(gasPriceAdjustment)).div(BigNumber.from(100)),
		gasLimit: 1000000
	});
	return tx;
};

const transferNativeToken = async (toAddress, amount, key, providerUrl, address) => {
	try {
		const provider = ethers.getDefaultProvider(providerUrl);
		const wallet = new ethers.Wallet(key, provider);
		let gas = await wallet.getGasPrice();
		gas = gas.mul(BigNumber.from(gasPriceAdjustment)).div(BigNumber.from(100));
		//print gas in gwie

		// console.log('Gas Price', ethers.utils.parseUnits(gas, 'gwei'));
		const nonce = await getNonce(address, providerUrl);
		const data = {
			to: toAddress,
			value: amount,
			nonce: nonce,
			gasPrice: gas,
			gasLimit: 1000000
		};
		const tx = await sendTransaction(data, key, providerUrl);
		return tx;
	} catch (error) {
		console.log(error);
		let message = 'Some error occurred please try again later';
		try {
			let { error: bodyError } = JSON.parse(error.error.body);
			console.log(bodyError);
			message = bodyError.message;
		} catch (e) {
			console.log(e);
		}
		console.log(message);
		throw new Error(message);
	}
};

const estimateGasForNativeTokenTransfer = async (toAddress, amount, key, providerUrl, address) => {
	try {
		console.log(amount);
		const provider = ethers.getDefaultProvider(providerUrl);
		const wallet = new ethers.Wallet(key, provider);
		let gas = await wallet.getGasPrice();
		gas = gas.mul(BigNumber.from(gasPriceAdjustment)).div(BigNumber.from(100));
		console.log("gas - ", gas)
		//print gas in gwie
		let gasUnits = await wallet.estimateGas({
			// Wrapped ETH address
			to: toAddress,

			// 1 ether
			value: amount
		})

		console.log("gasUnit - ", gasUnits)

		let fee = gasUnits.mul(gas);
		return fee;
	} catch (error) {
		console.log(error);
		let message = 'Some error occurred please try again later';
		try {
			let { error: bodyError } = JSON.parse(error.error.body);
			console.log(bodyError);
			message = bodyError.message;
		} catch (e) {
			console.log(e);
		}
		console.log(message);
		throw new Error(message);
	}
};

const estimateGasForERC20Transfer = async (toAddress, amount, key, providerUrl, address, contractAddress) => {
	//log input parameter except key
	console.log(amount);
	console.log('Input parameter log', toAddress, amount, providerUrl, address, contractAddress);

	const provider = ethers.getDefaultProvider(providerUrl);
	const wallet = new ethers.Wallet(key, provider);
	console.log('Wallet Balance', (await wallet.getBalance()).toBigInt());
	try {
		let contract;
		try {
			contract = new ethers.Contract(ethers.utils.getAddress(contractAddress), ERC20_Abi, wallet);
		} catch (err) {
			contract = new ethers.Contract(contractAddress, ERC20_Abi, wallet);
		}

		let gas = await wallet.getGasPrice();
		console.log('Gas Price', gas.toBigInt());
		let feeData = await provider.getFeeData();
		console.log('Fee Data', feeData);
		console.log('Fee Data', ethers.utils.formatUnits(feeData.gasPrice, "gwei"));
		console.log('Fee Data', ethers.utils.formatUnits(feeData.lastBaseFeePerGas, "gwei"));
		console.log('Fee Data', ethers.utils.formatUnits(feeData.maxFeePerGas, "gwei"));
		console.log('Fee Data', ethers.utils.formatUnits(feeData.maxPriorityFeePerGas, "gwei"));
		let tx;
		let gasUnits = await contract.estimateGas.transfer(toAddress, amount, {
			//gasPrice : gas.mul(BigNumber.from(gasPriceAdjustment)).div(BigNumber.from(100)),
			gasLimit: 1000000
		});
		console.log('Gas Units', ethers.utils.formatUnits(gasUnits, "gwei"));
		//price in ETH

		const fee = gasUnits.mul(gas);
		// ethers.utils.formatEther(gasUnits.mul(gas))
		return fee;
	} catch (error) {
		console.log(error);
		let message = 'Some error occurred please try again later';
		try {
			let { error: bodyError } = JSON.parse(error.error.body);
			console.log(bodyError);
			message = bodyError.message;
		} catch (e) {
			console.log(e);
		}
		console.log(message);
		throw new Error(message);
	}
};

const transferERC20Token = async (toAddress, amount, key, providerUrl, address, contractAddress) => {
	//log input parameter except key
	console.log('Input parameter log', toAddress, amount, providerUrl, address, contractAddress);

	const provider = ethers.getDefaultProvider(providerUrl);
	const wallet = new ethers.Wallet(key, provider);
	console.log('Wallet Balance', (await wallet.getBalance()).toBigInt());
	try {
		let contract;
		try {
			contract = new ethers.Contract(ethers.utils.getAddress(contractAddress), ERC20_Abi, wallet);
		} catch (err) {
			contract = new ethers.Contract(contractAddress, ERC20_Abi, wallet);
		}

		let gas = await wallet.getGasPrice();
		console.log('Gas Price', gas.toBigInt());
		let feeData = await provider.getFeeData();
		console.log('Fee Data', feeData);
		console.log('Fee Data', ethers.utils.formatUnits(feeData.gasPrice, "gwei"));
		console.log('Fee Data', ethers.utils.formatUnits(feeData.lastBaseFeePerGas, "gwei"));
		console.log('Fee Data', ethers.utils.formatUnits(feeData.maxFeePerGas, "gwei"));
		console.log('Fee Data', ethers.utils.formatUnits(feeData.maxPriorityFeePerGas, "gwei"));
		let tx;
		let gasUnits = await contract.estimateGas.transfer(toAddress, amount, {
			//gasPrice : gas.mul(BigNumber.from(gasPriceAdjustment)).div(BigNumber.from(100)),
			gasLimit: 1000000
		});
		console.log('Gas Units', ethers.utils.formatUnits(gasUnits, "gwei"));
		//price in ETH
		console.log('Gas Price ETH', ethers.utils.formatEther(gasUnits.mul(gas)));
		// keep the gas limit and keep as five time of previous transacations or 1000000
		// print users balance of contract
		//  const deploymentPrice = gasPrice.mul(estimatedGas);
		console.log('Contract Balance', (await contract.balanceOf(address)).toBigInt(), address);
		const nonce = await getNonce(address, providerUrl);
		gas = gas.mul(BigNumber.from(gasPriceAdjustment)).div(BigNumber.from(100));
		//print gas in gwie

		console.log('Gas Price', ethers.utils.parseUnits(gas.toString(), 'gwei'));
		//utils.formatUnits(feeData.maxFeePerGas, "gwei")
		console.log('Gas Price GWI', ethers.utils.formatUnits(gas.toString(), 'gwei'));
		// print the gas in ETH terms
		console.log('Gas Price ETH', ethers.utils.formatEther(gas.toString()));
		tx = await contract.transfer(toAddress, amount, {
			nonce: nonce,
			gasPrice: gas,
			gasLimit: 1000000,
		});
		return tx;
	} catch (error) {
		console.log(error);
		let message = 'Some error occurred please try again later';
		try {
			console.log(error);
			let { error: bodyError } = JSON.parse(error.error.body);
			console.log(bodyError);
			message = bodyError.message;
		} catch (e) {
			console.log(e);
		}
		console.log(message);
		throw new Error(message);
	}
};



const getTokenAllowance = async (owner, contract1, spender, providerUrl) => {
	const provider = ethers.getDefaultProvider(providerUrl);
	const contract = new ethers.Contract(
		contract1,
		ERC20_FULL_ABI,
		provider
	);
	const allowance = await contract.allowance(owner, spender);

	return allowance;
};

const setTokenApproval = async (value, contract1, spender, providerUrl, key) => {
	const provider = ethers.getDefaultProvider(providerUrl);
	const wallet = new ethers.Wallet(key, provider);
	const contract = new ethers.Contract(
		contract1,
		ERC20_FULL_ABI,
		wallet
	);
	let gas = await wallet.getGasPrice();
	const allowance = await contract.approve(spender, value, {
		gasPrice: gas.mul(BigNumber.from(gasPriceAdjustment)).div(BigNumber.from(100)),
		gasLimit: 1000000
	});

	return allowance;
};

const confirmAllowance = async (
	providerUrl,
	amount,
	inputTokenAddress,
	walletAddress,
	spender
) => {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve, reject) => {
		try {
			let _allowance = await getTokenAllowance(
				walletAddress,
				inputTokenAddress,
				spender,
				providerUrl
			);
			console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Allowance in confirmAllowance', _allowance);
			if (BigNumber.from(_allowance).gte(BigNumber.from(`${amount}`))) {
				resolve();
				return;
			}

			const timer = setInterval(async () => {
				_allowance = await getTokenAllowance(
					walletAddress,
					inputTokenAddress,
					spender,
					providerUrl
				);
				console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Allowance in confirmAllowance setInterval', _allowance);
				if (BigNumber.from(_allowance).gte(BigNumber.from(`${amount}`))) {
					clearInterval(timer);
					resolve();
				}
			}, 10000);
		} catch (err) {
			reject(err);
		}
	});
}

const performApproval = async (amount, owner, token_address, spender, providerUrl, key) => {

	const allowance = await getTokenAllowance(
		owner,
		token_address,
		spender,
		providerUrl
	);
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Allowance in performApproval', allowance);
	if (BigNumber.from(allowance).lt(amount)) {
		// This vary from contract to contract, it was not working for 1inch contract so needed to reset to 0 and it is not required for lifi.
		// if (!BigNumber.from(allowance).eq(BigNumber.from('0'))) {
		// 	await setTokenApproval(
		// 		BigNumber.from('0'),
		// 		token_address,
		// 		spender,
		// 		providerUrl,
		// 		key
		// 	);

		// 	await confirmAllowance(
		// 		providerUrl,
		// 		0,
		// 		token_address,
		// 		owner,
		// 		spender
		// 	);

		// }

		await setTokenApproval(
			amount,
			token_address,
			spender,
			providerUrl,
			key
		);
	}

	await confirmAllowance(
		providerUrl,
		amount,
		token_address,
		owner,
		spender
	);

}


const sendTransaction = async (data, key, providerUrl) => {
	const ethersProvider = ethers.getDefaultProvider(providerUrl);
	const wallet = new ethers.Wallet(key, ethersProvider);
	let tx;
	try {
		tx = await wallet.sendTransaction(data);
		tx = await tx.wait();
		if (tx.status == 0) {
			// this means failed need to retry
			throw new Error('Some error occurred please try again later');
		}
	} catch (error) {
		throw error;
	}
	return tx;
};

const estimateGasFeeV2 = async (data, key, providerUrl) => {
	const ethersProvider = ethers.getDefaultProvider(providerUrl);
	const wallet = new ethers.Wallet(key, ethersProvider);
	const number = await wallet.estimateGas(data);
	let gas = await wallet.getGasPrice();
	gas = gas.mul(gasPriceAdjustment);
	gas = gas.div(100);
	let gasUnit = number.mul(gasPriceAdjustment);// increase the limit by 100% its just indicative, its not used
	gasUnit = gasUnit.div(100);
	let gasLimit = gasUnit.mul(5);
	let response = {
		gasPrice: gas.toNumber(),
		gasUnit: gasUnit.toNumber(),
		gasLimit: gasLimit.toNumber()
	}

	return response;
};

const estimateGasFee = async (data, providerUrl) => {
	const ethersProvider = ethers.getDefaultProvider(providerUrl);
	const number = await ethersProvider.estimateGas(data);
	return number.toString();
};

const signMessage = async (originalMessage, key, providerUrl) => {
	try {
		const ethersProvider = ethers.getDefaultProvider(providerUrl);
		const wallet = new ethers.Wallet(key, ethersProvider);

		// Sign the message
		const signedMessage = await wallet.signMessage(JSON.stringify(originalMessage));

		return signedMessage;
	} catch (error) {
		return error;
	}
};

const getNonce = async (address, providerUrl) => {
	const ethersProvider = ethers.getDefaultProvider(providerUrl);
	const nonce = (await ethersProvider.getTransactionCount(address));
	return nonce;
};

const getContractDetails = async (providerUrl, contractAddress) => {
	const provider = ethers.getDefaultProvider(providerUrl);
	let contract_data = {}
	try {
		let contract;
		try {
			contract = new ethers.Contract(ethers.utils.getAddress(contractAddress), ERC20_FULL_ABI, provider);
		} catch (err) {
			contract = new ethers.Contract(contractAddress, ERC20_FULL_ABI, provider);
		}

		let name = await contract.name();
		let symbol = await contract.symbol();
		let decimals = 0;
		try {
			decimals = await contract.decimals();
		} catch (error) {
			console.log('Exception while getting decimals')
		}


		contract_data = {
			'name': name,
			'symbol': symbol,
			'decimals': decimals
		}

	} catch (error) {
		throw new Error('Some error occurred please try again later');
	}
	return contract_data;
};

export default {
	getChainId,
	getAccounts,
	sendTransaction,
	signMessage,
	estimateGasFee,
	estimateGasFeeV2,
	getNonce,
	getTokenAllowance,
	buildProtocolTransaction,
	transferNativeToken,
	transferERC20Token,
	setTokenApproval,
	getContractDetails,
	confirmAllowance,
	performApproval,
	estimateGasForERC20Transfer,
	estimateGasForNativeTokenTransfer,
	getNativeBalance,
	increaseByPercent,
	getERC20TokenBalance,
	getFormatedAddress
};
