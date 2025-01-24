import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import blockchain from '../utils/blockchain';


export const walletSlice = createSlice({
    name: 'wallet',
    initialState: {
        key: '1',
        address: '',
        balance: {},
        status: '',
        error: "",
        idleDollarBalance: {},
        totalIdleDollarBalance: 952.30,
        investedBalance: {},
        investedDollarBalance: {},
        totalInvestedDollarBalance: 0,
        loadingBalance: false,
        loadingInvestBalance: false
    },
    reducers: {
        updateWallet: (state, action) => {
            state = { ...state, ...action.payload }
            console.log(state);
            return state;

        },
        extraReducers(builder) {
            builder
                .addCase(addAddress.pending, (state, action) => {
                    state.status = 'loading'
                })
                .addCase(addAddress.fulfilled, (state, action) => {
                    state.status = 'succeeded'
                    // Add any fetched posts to the array
                    state.address = action.payload
                    console.log('CHecking state inside slice');
                    console.log(state);
                })
                .addCase(addAddress.rejected, (state, action) => {
                    state.status = 'failed'
                    state.error = action.error.message
                })
        }
    }
})

// export function getAddress() {
//     return async (dispatch, getState) => {

//         const state = getState();
//         const key = state.wallet?.key;

//         if (!key || state.wallet?.address) return;

//         const address = await blockchain.getAccounts(key);

//         dispatch(updateWallet({ address: address }))
//     };
// }

export const addAddress = createAsyncThunk(
    'wallet/addAddress',
    async x => {
        // We send the initial data to the fake API server
        console.log("here");
        const address = await blockchain.getAccounts(x);

        console.log(address);
        // The response includes the complete post object, including unique ID
        return address
    }
)

export const { updateWallet } = walletSlice.actions
export default walletSlice.reducer