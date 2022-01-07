import { Box } from "@mui/system";
import React from "react";
import { CryptoInput } from "./CryptoInput";
import { CryptoSelect } from "./CryptoSelect";

export type data = {
    crypto: string
}

export class Side extends React.Component<{
    from?: string,
    show?: string,
    disable?: string,
    numberValue?: number,
    updated: (x: data) => any}
, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            error: false,
            errorMsg: "",
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
                label={typeof this.props.from === "string"? "From": "To"}
            />
            <CryptoInput
                error={this.state.error}
                value={this.props.numberValue}
                msg={this.state.errorMsg}
                callback={this.numberChosen.bind(this)}
            />
        </Box>
    }

    updateCrypto(crypto: string) {
        this.props.updated({
            crypto: crypto
        });
    }

    errorOut(msg: string) {
        this.setState({
            error: msg !== "",
            errorMsg: msg
        });
    }

    numberChosen(val: number) {
        if (val < 0) return this.errorOut("must be nonnegative");
        if (val > 100) return this.errorOut("must be less than 100");
        if (typeof this.props.from === "string" && val < 0.1) return this.errorOut("must be at least 0.1");
        this.errorOut("");
    }
}