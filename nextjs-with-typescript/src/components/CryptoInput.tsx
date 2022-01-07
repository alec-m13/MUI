import { TextField } from "@mui/material";
import React from "react";

export class CryptoInput extends React.Component<{
    error: boolean,
    value?: number,
    msg: string,
    callback: (val: number) => any
}, any> {
    render() {
        return <TextField
            error={this.props.error}
            value={this.props.value}
            helperText={this.props.msg}
            id="crypto-input"
            label="Amount"
            type="number"
            onChange={this.listener.bind(this)}
        />
        
    }

    listener(e: {target: {value: any}}) {
        return this.props.callback(e.target.value);
    }
}