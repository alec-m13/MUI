import { Box } from "@mui/system";
import React from "react";
import { Crypto } from "../utility/cryptos";
import { CryptoInput } from "./CryptoInput";
import { CryptoSelect } from "./CryptoSelect";

// upwards callback data
export type data = {
    crypto: string,
    amount: number
}

type propType = {
    sideName: string,
    disableWhole: boolean,
    show: string,
    disableCrypto: string,
    blockAmount: boolean,
    amount: number,
    update: (prop: keyof data, val: any) => any,
    cryptos: Crypto[],
    maxAmount?: string
    msg?: string
}

export class Side extends React.Component<propType, any> {

    render() {
        let me = this;
        return <Box
        sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'left',
            alignItems: 'left',
        }}
        >
            <CryptoSelect
                show={this.props.show}
                disable={this.props.disableCrypto}
                disabled={this.props.disableWhole}
                onChange={this.updateCrypto.bind(this)}
                label={this.props.sideName}
                cryptos={this.props.cryptos}
            />
            <CryptoInput
                disabled={this.props.blockAmount}
                value={this.props.amount}
                callback={this.updateAmount.bind(this)}
                msg={this.props.maxAmount || this.props.msg}
                maxButton={this.props.sideName==="From"? () => me.updateAmount(Infinity): undefined}
            />
        </Box>
    }

    updateCrypto(crypto: string) {
        this.props.update("crypto", crypto);
    }

    updateAmount(amount: number) {
        this.props.update("amount", amount);
    }
}