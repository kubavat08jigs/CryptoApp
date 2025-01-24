import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../helper/colorConstants';
import Loader from '../Loader';

export function TotalAmount({ amount, symbol, gas, gasSymbol, style, hasEnoughETH, estimating = false }) {
    console.log(estimating);
    return (
        <View style={[styles.container, style]}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ justifyContent: "center" }}>
                    <Text style={styles.titleText}>Transaction Amount</Text>
                    <Text style={styles.infoText}>
                        ~{amount || (0).toFixed(2)} {symbol}
                    </Text>
                </View>
                <View style={{ justifyContent: "center" }}>
                    <Text style={styles.titleText}>Transaction Fee</Text>
                    {
                        estimating
                            ? <Loader size={15} width="100%" height={20} /> :
                            <Text style={styles.infoText}>
                                ~{gas || (0).toFixed(2)} {gasSymbol}
                            </Text>
                    }
                </View>
            </View>
            {hasEnoughETH ?
                <Text style={{ color: 'red' }}>You do not have sufficient balance</Text> : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        marginHorizontal: 30,
        borderRadius: 10,
        padding: 30,
        backgroundColor: colors.totalAmountColor,
    },
    titleText: {
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 14,
        color: colors.primaryText,
    },
    infoText: {
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 14,
        color: colors.primaryText,
    },
});