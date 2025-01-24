import { Dimensions, NativeModules } from 'react-native';
import { colors } from '../helper/colorConstants';



const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const appVersion = '1.0.3';

//const env = 'DEV';
const hideLogs = false;
const env = 'PROD';


const baseUrl1 = 'https://apiserver.dolf.finance';
const baseUrl2 = 'https://api.dolf.finance/dapp-api';
//const baseUrl2 = 'https://betaapi.dolf.finance/dapp-api';

let ethereumProviderUrl;
let polygonProviderUrl;
let googleClientId;
let web3authClientId;
let resolvedRedirectUrl;
let web3authVerifier;
let balanceRefreshTimer;

if (env === 'DEV') {
	googleClientId = '831479189204-vhb3i57ilu54kcsqqjotip3e2is5pdel.apps.googleusercontent.com';
	web3authClientId = 'BDkNiWpP8N7htBFZbHFIQxbHddr8iYPVJG1o0tXUXGPVZPBQcWGKQJx9OP53FKouzFROUycxdARh4tBgAUaj0Fo';
	resolvedRedirectUrl = 'dolf.app://auth';
	web3authVerifier = 'dolf-labs-dapp-test';
	ethereumProviderUrl = 'https://apiserver.dolf.finance/local-node';
	polygonProviderUrl = 'https://apiserver.dolf.finance/local-node-polygon';
	balanceRefreshTimer = 1800000;
} else {
	googleClientId = '831479189204-vhb3i57ilu54kcsqqjotip3e2is5pdel.apps.googleusercontent.com';
	web3authClientId = 'BGBu2IudhA3kZJC38P3EzA2wMSFsCIwFhqUwoQJR3uXpRR1iFjOGC5iW6ASTHJj8BmQjJpO1qFb-8Brgt-cqUcI';
	resolvedRedirectUrl = 'dolf.app://auth';
	web3authVerifier = 'dolf-labs-pvt-ltd-prod';
	ethereumProviderUrl = 'https://mainnet.infura.io/v3/d25792b88c724f9ca8adf0a5bcdc4dee';
	polygonProviderUrl = 'https://polygon-mainnet.infura.io/v3/d25792b88c724f9ca8adf0a5bcdc4dee';
	balanceRefreshTimer = 60000;
}


const explorerLink = {
	ETHEREUM: 'https://etherscan.io/tx/',
	POLYGON: 'https://polygonscan.com/tx/'
};

const _1inchBaseAddress = 'https://api.1inch.io/v5.0';
const _1inchRouterAddress = '0x1111111254EEB25477B68fb85Ed929f73A960582';


const gasPriceAdjustment = 200;
const lockTimerInMillis = 5 * 60 * 1000;

const kyc = "https://dolf.finance/kyc-and-aml";
const cookie = "https://dolf.finance/cookie-policy";
const tnc = "https://dolf.finance/terms-of-service";
const privacy = "https://dolf.finance/privacy";
const walletPolicy = "https://dolf.finance/wallet-policy";
const swapPolicy = "https://dolf.finance/swap-policy";
const about = "https://dolf.finance/about";
const twitter = "https://twitter.com/DolfFinance";
const linkedin = "https://www.linkedin.com/company/dolffinance/";
const reddit = "https://www.reddit.com/r/dolffinance/";
const telegram = "https://t.me/dolffinanceofficial";

function getDecimals(price) {

	console.log(price);

	if (!price || isNaN(price)) return 3;
	let _price = parseFloat(price);
	if (_price < 100) {
		return 3;
	} else return parseInt(Math.log10(_price) + 1);
}

function formatNumber(amount, decimals) {

	console.log(amount, decimals);

	if (isNaN(amount)) {
		return amount;
	}
	let str = `${amount}`;
	if (!str.includes('.')) {
		str += '.00';
	}
	let arr = str.split('.');
	return `${arr[0]}.${arr[1].substring(0, decimals)}`;
}

const inAppBrowserConfig = {
	// iOS Properties
	dismissButtonStyle: 'cancel',
	preferredBarTintColor: '#453AA4',
	preferredControlTintColor: 'white',
	readerMode: false,
	animated: true,
	modalPresentationStyle: 'fullScreen',
	modalTransitionStyle: 'coverVertical',
	modalEnabled: true,
	enableBarCollapsing: false,
	// Android Properties
	showTitle: true,
	toolbarColor: colors.primaryBlue,
	secondaryToolbarColor: 'black',
	navigationBarColor: 'black',
	navigationBarDividerColor: 'white',
	enableUrlBarHiding: true,
	enableDefaultShare: true,
	forceCloseOnRedirection: false,
	// Specify full animation resource identifier(package:anim/name)
	// or only resource name(in case of animation bundled with app).
	animations: {
		startEnter: 'slide_in_right',
		startExit: 'slide_out_left',
		endEnter: 'slide_in_left',
		endExit: 'slide_out_right',
	},
};

function checkNaN(val) {
	if (isNaN(val) ||  val === undefined || val === null || (val.trim && val.trim() === '')) {
		return true;
	}
}

const transactionType = { outgoingTransaction: 'OUTGOING_TRANSFER', incomingTransaction: 'INCOMING_TRANSFER' };

const dolfLocale = () => NativeModules.I18nManager.localeIdentifier.replace('_', '-');

export {
	screenWidth,
	screenHeight,
	kyc,
	cookie,
	tnc,
	privacy,
	walletPolicy,
	swapPolicy,
	about,
	twitter,
	linkedin,
	reddit,
	telegram,
	googleClientId,
	web3authClientId,
	resolvedRedirectUrl,
	web3authVerifier,
	ethereumProviderUrl,
	polygonProviderUrl,
	env,
	hideLogs,
	baseUrl1,
	baseUrl2,
	getDecimals,
	_1inchRouterAddress,
	_1inchBaseAddress,
	gasPriceAdjustment,
	explorerLink,
	appVersion,
	balanceRefreshTimer,
	formatNumber,
	lockTimerInMillis,
	inAppBrowserConfig,
	transactionType,
	dolfLocale,
	checkNaN
};
