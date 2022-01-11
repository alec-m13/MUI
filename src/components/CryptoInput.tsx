import { Button, TextField } from "@mui/material";
import React from "react";

type propType = {
    disabled?: any
    error?: any,
    value?: number,
    msg?: string,
    callback: (val: number) => any,
    maxButton?: () => any,
}

export class CryptoInput extends React.Component<propType, any> {
    render() {
        return <TextField
            error={this.hasAtt("error")}
            value={this.props.value}
            helperText={this.props.msg}
            disabled={this.props.disabled}
            id="crypto-input"
            label="Amount"
            type="number"
            onChange={this.listener.bind(this)}
            InputProps={{endAdornment: this.getButton()}}
        />
        
    }

    getButton() {
        if (this.props.disabled || !this.props.maxButton) return;
        return <Button onClick={this.props.maxButton}>MAX</Button>
    }

    // check if a boolean attribute is present
    hasAtt(name: keyof propType): boolean {
        return typeof this.props[name] !== "undefined";
    }

    listener(e: {target: {value: any}}) {
        return this.props.callback(e.target.value);
    }
}