import { applyMiddleware, compose, configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';

import { userReducer } from './reducer/user';
import { walletReducer } from './reducer/wallet';
import { chainReducer } from './reducer/chain';
import { assetReducer } from './reducer/asset';
import { appReducer } from './reducer/app';

const middlewareEnhancer = applyMiddleware(thunkMiddleware);
const composedEnhancers = compose(middlewareEnhancer);

const store = configureStore({
	reducer: {
		user: userReducer,
		wallet: walletReducer,
		chain: chainReducer,
		asset: assetReducer,
		app: appReducer
	},
	enhancers: [composedEnhancers],
});

export default store;
