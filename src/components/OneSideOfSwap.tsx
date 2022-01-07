import { getTableHeadUtilityClass } from "@mui/material";
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
    from?: string,
    show?: string,
    disable?: string,
    amount?: number,
    update: (prop: keyof data, val: any) => any,
    cryptos: Crypto[],
}

export class Side extends React.Component<propType, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            errorMsg: "",
            crypto: "",
            amount: 0
        }
    }

    render() {
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
                disable={this.props.disable}
                onChange={this.updateCrypto.bind(this)}
                label={this.hasAtt("from")? "From": "To"}
                cryptos={this.props.cryptos}
            />
            <CryptoInput
                error={this.state.error}
                value={this.props.amount}
                msg={this.state.errorMsg}
                callback={this.numberChosen.bind(this)}
            />
        </Box>
    }

    updateCrypto(crypto: string) {
        this.props.update("crypto", crypto);
    }

    updateAmount(amount: number) {
        this.props.update("amount", amount);
    }

    errorOut(msg: string) {
        if (msg !== "") this.setState({
            error: "",
            errorMsg: msg
        });
        else this.setState({
            error: undefined,
            errorMsg: msg
        });
    }

    numberChosen(val: number) {
        if (val < 0) return this.errorOut("must be nonnegative");
        if (val > 100) return this.errorOut("must be less than 100");
        if (typeof this.props.from === "string" && val < 0.1) return this.errorOut("must be at least 0.1");
        this.errorOut("");
        this.updateAmount(val);
    }

    // check if a boolean attribute is present
    hasAtt(name: keyof propType): boolean {
        return typeof this.props[name] !== "undefined";
    }
}