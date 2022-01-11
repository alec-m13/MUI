import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { HelpPanel } from "./HelpPanel";
import { data as sideData, Side } from "./OneSideOfSwap";
import { bind } from "../utility/binder";
import { PropertySwapper } from "../utility/PropertySwapper";
import { Crypto, getDatum, rates } from "../utility/cryptos";

type propsType = {
    cryptos: Crypto[],
}

// keep the from*/to* pattern for sided states
type stateType = {
    walletConnected: boolean,
    fromCrypto: string,
    toCrypto: string,
    fromAmount: number,
    toAmount: number,
    blockAmounts: boolean,
    errorMsg: string, // empty string means no error/can swap, nonempty string means error/can't swap
}

export class Swap extends React.Component<propsType, stateType> {
    constructor(props: any) {
        super(props);
        this.state = {
            walletConnected: false,
            fromCrypto: "",
            toCrypto: "",
            fromAmount: 0,
            toAmount: 0,
            blockAmounts: true,
            errorMsg: "Uninitiated",
        }
        // bind some callback functions
        bind(this, "updatedFrom");
        bind(this, "updatedTo");
        bind(this, "swap");
        bind(this, "swapClicked");
        bind(this, "updateState");
        bind(this, "connectWallet");
    }

    // initialize From as Ethereum
    componentDidUpdate() {
        if (this.state.fromCrypto === "") this.updateState("fromCrypto", "eth");
    }

    // fix state to contain a valid state (or consistent error)
    updateState(prop: keyof stateType, val: any, state = this.state) {
        let ns: any = Object.assign({}, state); // ns = newState
        ns[prop] = val;
        ns.blockAmounts = false;
        ns.errorMsg = "";
        if (ns.fromCrypto === "" || ns.toCrypto === "") { // cryptos not chosen
            ns.blockAmounts = true;
            ns.errorMsg = (ns.fromCrypto === "")? "Must choose from": "Must choose to";
        } else {
            let rate = this.getRate(ns);
            let from = ns.fromAmount, to = ns.toAmount;
            if (prop === "toAmount") from = to / rate;
            else to = from * rate;
            // cutoffs
            if (to < 0) {
                to = 0;
                from = 0;
            } else if (to > 100) {
                to = 100;
                from = to / rate;
            }
            if (from < 0.1) {
                from = 0.1;
                to = rate * from;
            } else if (from > 100) {
                from = 100;
                to = rate * from;
            }
            // if cutoffs didn't work...
            if (to < 0 || to > 100) {
                ns.errorMsg = "Cannot trade: price difference too large";
                ns.blockAmounts = true;
                ns.fromAmount = ns.toAmount = 0;
            } else {
                ns.fromAmount = from;
                ns.toAmount = to;
            }
        }
        this.setState(ns);
    }

    getRate(state = this.state): number {
        // rates returns $/token, getRate returns token (to) / token (from)
        return (rates.get(getDatum("symbol", state.fromCrypto, "id")) || 0) /
            (rates.get(getDatum("symbol", state.toCrypto, "id")) || Infinity);
    }

    updatedFrom(prop: keyof sideData, val: any) {
        this.updateState("from"+(prop.charAt(0).toUpperCase())+prop.substring(1) as keyof stateType, val);
    }

    updatedTo(prop: keyof sideData, val: any) {
        this.updateState("to"+(prop.charAt(0).toUpperCase())+prop.substring(1) as keyof stateType, val);
    }

    errorOut(msg: string) {
        this.updateState("errorMsg", msg);

    }

    swap() {
        this.updateState("toAmount", this.state.fromAmount, Swap.propertySwapper(this.state) as stateType);
    }

    swapClicked() {
        alert("swapping " + this.state.fromAmount + " " + this.state.fromCrypto + " for " + this.state.toAmount + " " + this.state.toCrypto);
    }

    connectWallet() {
        this.updateState("walletConnected", true);
    }

    getHelpPanel() {
        if (this.state.walletConnected) {
            return <p>more...</p>
        } else return <HelpPanel title="Connect your wallet">
            <Typography>To start using the app your wallet needs to be connected :)</Typography>
            <Button onClick={this.connectWallet}>Connect wallet</Button>
        </HelpPanel>
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
                    sideName="From"
                    disableWhole = {!this.state.walletConnected}
                    show={this.state.fromCrypto}
                    disableCrypto={this.state.toCrypto}
                    blockAmount={this.state.blockAmounts}
                    amount={this.state.fromAmount}
                    update={this.updatedFrom}
                    cryptos={this.props.cryptos}
                />
                <Button
                    size="large"
                    color="primary"
                    onClick={this.swap}
                    disabled={!this.state.walletConnected || this.state.fromCrypto === "" || this.state.toCrypto === ""}
                >
                    ⇅
                </Button>
                <Side
                    sideName="To"
                    disableWhole = {!this.state.walletConnected}
                    show={this.state.toCrypto}
                    disableCrypto={this.state.fromCrypto}
                    blockAmount={this.state.blockAmounts}
                    amount={this.state.toAmount}
                    update={this.updatedTo}
                    cryptos={this.props.cryptos}
                />
                <Typography>{this.state.errorMsg}</Typography>
                <Button
                    disabled={!this.state.walletConnected || (this.state.errorMsg !== "")}
                    onClick={this.swapClicked}
                >Swap{this.state.errorMsg===""? "!": ""}</Button>
            </Box>
            {this.getHelpPanel()}
        </Box>
    }

    static propertySwapper = new PropertySwapper("from", "to").swap;
}