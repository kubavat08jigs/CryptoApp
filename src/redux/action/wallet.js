import RPC from '../../utils/blockchain';
import { _fetch } from '../../utils/_fetch';
import { baseUrl2 } from '../../utils/consts';
import AssetStore from '../../asyncStore/assets';
// import { stat } from 'fs';

export function initAssets() {
  return async (dispatch) => {
    try {
      const assets = await AssetStore.getAssets();
      if (assets) {
        dispatch({
          type: 'SET_BALANCE',
          payload: assets,
        });
      }
    } catch (err) {
      // console.log(err);
    }
  };
}

export function setKey(payload) {
  return {
    type: 'SET_KEY',
    payload,
  };
}

export function getAddress() {
  return async (dispatch, getState) => {
    const state = getState();
    const key = state.wallet?.key;

    if (!key || state.wallet?.address) return;

    const address = await RPC.getAccounts(key);
    console.log(address);
    dispatch({
      type: 'SET_ADDRESS',
      payload: address,
    });
  };
}

export function getWalletBalance() {
  return async (dispatch, getState) => {
    const state = getState();
    const chain = state.chain?.allChains;
    const loadingBalance = state.wallet?.loadingBalance;
    const zeroBalanceVisible = state.app?.zeroBalanceVisible;

    if (loadingBalance) return;

    let balance = {};
    const idleDollarBalance = {};
    let totalIdleDollarBalance = 0;
    let balancePerCoin = [];
    let chainwise_bal = {};
    let chainwiseNativeToken = {};
    let change24H = 0;
    let balPerChain;

    if (!Array.isArray(chain) || chain.length === 0) return;

    try {
      dispatch(setLoadingBalance());
      const chainCommaSeparated = chain.map(e => e.chainId);
      const tokenBalances = {};
      console.log(state.wallet?.address);
      let res = await _fetch(
        //`${baseUrl2}/getBalanceFromCovalent?address=0x6729F3A23aEE4Ec81d1B96Ee10D002A03c3723df&chain_id=1,137`,
        `${baseUrl2}/getBalanceFromCovalent?address=${state.wallet?.address}&chain_id=${chainCommaSeparated.join(',')}`,
      );
      let total_wallet_balance = await res.json();

      totalIdleDollarBalance = total_wallet_balance.payload?.total_balance;
      balancePerCoin = total_wallet_balance.payload?.balance_per_coin;

      // console.log(total_wallet_balance.payload);

      let balancePerCoinArr = [];

      for (var i = 0; i < balancePerCoin.length; i++) {

        let e = balancePerCoin[i];

        if (totalIdleDollarBalance !== 0) {
          e.percentage =
            e.total_quote_balance * 100 / totalIdleDollarBalance;
        } else {
          e.percentage = 0;
        }

        let chainsArr = [];

        for (var j = 0; j < e.chains.length; j++) {

          change24H += (e.chains[j].quote - e.chains[j].quote_24h);

          let chainId = e.chains[j].chain_id;
          if (chainwise_bal[chainId] === undefined) {
            chainwise_bal[chainId] = {};
            chainwise_bal[chainId].total_quote_balance = 0;
          }
          chainwise_bal[chainId].total_quote_balance += e.chains[j].quote;
          chainwise_bal[chainId].name = e.chains[j].chain_name;
          chainwise_bal[chainId].chain_id = chainId;

          console.log(zeroBalanceVisible, e.chains[j].native_token);

          if (zeroBalanceVisible === '1' || e.chains[j].native_token || (zeroBalanceVisible === '0' && e.chains[j].balance > 0)) {
            chainsArr.push(e.chains[j]);
          }

          if (e.chains[j].native_token) {
            chainwiseNativeToken[chainId] = { 
              ...e,
              ...e.chains[j],
              chains: undefined,
            };
          }

        }
        if (zeroBalanceVisible === '1' || (zeroBalanceVisible === '0' && chainsArr.length > 0)) {
          balancePerCoinArr.push({ ...e, chains: chainsArr });
        }
      }

      balPerChain = Object.values(chainwise_bal);
      for (var i = 0; i < balPerChain.length; i++) {
        if (totalIdleDollarBalance != 0) {
          balPerChain[i].percentage =
            balPerChain[i].total_quote_balance * 100 / totalIdleDollarBalance;
        } else {
          balPerChain[i].percentage = 0;
        }
      }

      console.log(balancePerCoinArr);
      console.log(chainwiseNativeToken);

      AssetStore.setAssets({
        balance,
        idleDollarBalance,
        totalIdleDollarBalance,
        loadingBalance: false,
        initialIdleLoad: true,
        balancePerCoin: balancePerCoinArr,
        balancePerChain: balPerChain,
        change24H,
        chainwiseNativeToken,
      });

      dispatch({
        type: 'SET_BALANCE',
        payload: {
          balance,
          idleDollarBalance,
          totalIdleDollarBalance,
          loadingBalance: false,
          initialIdleLoad: true,
          balancePerCoin: balancePerCoinArr,
          balancePerChain: balPerChain,
          change24H,
          chainwiseNativeToken,
        },
      });

    } catch (err) {
      console.log(err);
    }
  };
}

export function setLoadingBalance() {
  return {
    type: 'SET_LOADING_BALANCE',
  };
}

export function setLoadingInvestBalance() {
  return {
    type: 'SET_LOADING_INVEST_BALANCE',
  };
}
