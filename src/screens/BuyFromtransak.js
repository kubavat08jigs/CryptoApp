import TransakWebView from '@transak/react-native-sdk';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function BuyFromTransak() {
    const { address } = useSelector(st => st.wallet);
    const { email } = useSelector(st => st.user);
    useEffect(() => { console.log(email); }, [email])

    const transakEventHandler = (event, data) => {
        switch (event) {
            case 'ORDER_PROCESSING':
                console.log(data);
                break;

            case 'ORDER_COMPLETED':
                console.log(data);
                break;

            default:
                console.log(data);
        }
    };

    return (
        <TransakWebView
            queryParams={{
                apiKey: 'a4d757f1-b099-41e9-a276-72db12ea2121',
                environment: 'PRODUCTION',
                walletAddress: address,
                disableWalletAddressForm: true,
                email,
                isAutoFillUserData:true,
            }}
            onTransakEventHandler={transakEventHandler}
        />
    );
}