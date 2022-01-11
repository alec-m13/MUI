import { Button, Typography, Grid } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { HelpPanel } from "./HelpPanel";
import { data as sideData, Side } from "./OneSideOfSwap";
import { bind } from "../utility/binder";
import { PropertySwapper } from "../utility/PropertySwapper";
import { Crypto, fillWallet, getDatum, rates } from "../utility/cryptos";

type propsType = {
    cryptos: Crypto[],
}

// keep the from*/to* pattern for sided states
type stateType = {
    wallet?: Map<string, number>,
    walletConnected: boolean,
    fromCrypto: string,
    toCrypto: string,
    fromAmount: number,
    toAmount: number,
    blockAmounts: boolean,
    errorMsg: string, // empty string means no error/can swap, nonempty string means error/can't swap
    recentSwap: any,
}

export class Swap extends React.Component<propsType, stateType> {
    constructor(props: any) {
        super(props);
        this.state = {
            wallet: new Map(),
            walletConnected: false,
            fromCrypto: "",
            toCrypto: "",
            fromAmount: 0,
            toAmount: 0,
            blockAmounts: true,
            errorMsg: "Uninitiated",
            recentSwap: false,
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
        ns.recentSwap = false;
        if (ns.fromCrypto === "" || ns.toCrypto === "") { // cryptos not chosen
            ns.blockAmounts = true;
            ns.errorMsg = (ns.fromCrypto === "")? "Must choose from": "Must choose to";
        } else {
            let rate = this.getRate(ns);
            let from = ns.fromAmount, to = ns.toAmount;
            if (prop === "toAmount") from = to / rate;
            else to = from * rate;
            let maxFrom = Math.min(100, ns.wallet.get(ns.fromCrypto));
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
            } else if (from > maxFrom) {
                from = maxFrom;
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

    getRate(state: any = this.state): number {
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
        let gas = 0.0000005;
        let priceImpact = "0.00%";
        let allowedSlippage = "0.50%";
        let minimumReceived = this.state.toAmount - (gas * this.getRate({
            toCrypto: this.state.toCrypto,
            fromCrypto: "eth"
        }));
        this.setState({
            recentSwap: <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>
              Liquidity provider fee
            </Grid>
            <Grid item xs={6}>
              {gas} eth
            </Grid>
            <Grid item xs={6}>
              Price impact
            </Grid>
            <Grid item xs={6}>
              {priceImpact}
            </Grid>
            <Grid item xs={6}>
                Allowed slippage
            </Grid>
            <Grid item xs={6}>
                {allowedSlippage}
            </Grid>
            <Grid item xs={6}>
                Minimum received
            </Grid>
            <Grid item xs={6}>
                {minimumReceived}
            </Grid>
          </Grid>
        })
    }

    connectWallet() {
        fillWallet(this.state.wallet || new Map());
        this.updateState("walletConnected", true);
    }

    getHelpPanel() {
        if (this.state.recentSwap) return <HelpPanel title="Transaction details">
            {this.state.recentSwap}
        </HelpPanel>
        if (this.state.walletConnected) {
            if (this.state.fromCrypto === "" || this.state.toCrypto === "") {
                return <HelpPanel title="Hint">
                    You can choose any token on the list. If there is some missing you can add it by the <b>contact address.</b>
                </HelpPanel>
            } else {
                return <HelpPanel title="Hint">
                    Choose the amount you want to swap on your balance. You can check it beneath the amount field you want to swap :D
                </HelpPanel>
            }
        } else return <HelpPanel title="Connect your wallet">
            <Typography>To start using the app your wallet needs to be connected :)</Typography>
            <Button onClick={this.connectWallet}>Connect wallet</Button>
        </HelpPanel>
    }

    getRateMsg() {
        if (this.state.toCrypto === "" || this.state.fromCrypto === "") return;
        let rate = (1 / this.getRate()) + "";
        rate = rate.substring(0, 8);
        return "1 "+this.state.toCrypto+" = "+rate+" "+this.state.fromCrypto;
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
                    maxAmount={this.state.walletConnected? "Balance "+(this.state.wallet?.get(this.state.fromCrypto))+this.state.fromCrypto: undefined}
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
                    msg={this.getRateMsg()}
                />
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