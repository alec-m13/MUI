import { Button, Container } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { UnderConstruction } from "./HelpPanels/UnderConstruction";
import { data as sideData, Side } from "./OneSideOfSwap";
import { bind } from "../utility/binder";
import { PropertySwapper } from "../utility/PropertySwapper";

type stateType = {
    fromCrypto: string,
    toCrypto: string,
    fromAmount: number,
    toAmount: number
}

export class Swap extends React.Component<{}, stateType> {
    constructor(props: any) {
        super(props);
        this.state = {
            fromCrypto: "ETH",
            toCrypto: "",
            fromAmount: 0,
            toAmount: 0
        }
        // bind some callback functions
        bind(this, "updatedFrom");
        bind(this, "updatedTo");
        bind(this, "swap");
        bind(this, "swapClicked");
    }

    // in case updateState ever needs the fancier mechanism of checking values after updating
    /*updateState(prop: keyof stateType, val: any) {
        this.setState(function(state) {
            let obj: any = {};
            obj[prop] = val;
            return obj;
        });
    }*/
    updateState(prop: keyof stateType, val: any) {
        let obj: any = {};
        obj[prop] = val;
        this.setState(obj);
    }

    updatedFrom(prop: keyof sideData, val: any) {
        this.updateState("from"+(prop.charAt(0).toUpperCase())+prop.substring(1) as keyof stateType, val);
    }

    updatedTo(prop: keyof sideData, val: any) {
        this.updateState("to"+(prop.charAt(0).toUpperCase())+prop.substring(1) as keyof stateType, val);
    }

    swap() {
        this.setState(Swap.propertySwapper(this.state));
    }

    swapClicked() {
        alert("swapping");
    }


    // the isReady button disabling is throwing errors as in https://github.com/vercel/next.js/discussions/21999
    isReady() {
        if (1>0) return true;
        let state = this.state,
            fromCrypto = state.fromCrypto,
            toCrypto = state.toCrypto,
            fromAmount = state.fromAmount,
            toAmount = state.toAmount;
        return fromCrypto !== ""
            && toCrypto !== ""
            && fromAmount > 0
            && toAmount > 0;
    }

    render() {
        return <Box
            sx={{
                my: 4,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    my: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <p>Select a token to start swapping.</p>
                <Side
                    from="true"
                    show={this.state.fromCrypto}
                    disable={this.state.toCrypto}
                    amount={this.state.fromAmount}
                    update={this.updatedFrom}
                />
                <Button
                    size="large"
                    color="primary"
                    onClick={this.swap}
                >
                    ⇅
                </Button>
                <Side
                    show={this.state.toCrypto}
                    disable={this.state.fromCrypto}
                    amount={this.state.toAmount}
                    update={this.updatedTo}
                />
                <Button
                    disabled={!this.isReady()}
                    onClick={this.swapClicked}
                >Swap{this.isReady()? "!": ""}</Button>
            </Box>
            <UnderConstruction/>
        </Box>
    }

    static propertySwapper = new PropertySwapper("from", "to").swap;
}