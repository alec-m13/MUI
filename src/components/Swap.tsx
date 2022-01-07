import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { UnderConstruction } from "./HelpPanels/UnderConstruction";
import { data as sideData, Side } from "./OneSideOfSwap";
import { bind } from "../utility/binder";
import { PropertySwapper } from "../utility/PropertySwapper";
import { Crypto, getDatum, rates } from "../utility/cryptos";

type stateType = {
    fromCrypto: string,
    toCrypto: string,
    fromAmount: number,
    toAmount: number,
    blockAmount: boolean,
    errorMsg: string,
}

export class Swap extends React.Component<{cryptos: Crypto[]}, stateType> {
    constructor(props: any) {
        super(props);
        this.state = {
            fromCrypto: "",
            toCrypto: "",
            fromAmount: 0,
            toAmount: 0,
            blockAmount: true,
            errorMsg: "Uninitiated",
        }
        // bind some callback functions
        bind(this, "updatedFrom");
        bind(this, "updatedTo");
        bind(this, "swap");
        bind(this, "swapClicked");
    }

    componentDidUpdate() {
        if (this.state.fromCrypto === "") this.updateState("fromCrypto", "eth");
    }

    updateState(prop: keyof stateType, val: any) {
        let me = this;
        this.setState(function(state) {
            let ns: any = Object.assign({}, state); // newState
            ns[prop] = val;
            ns.blockAmount = false;
            ns.errorMsg = "";
            if (ns.fromCrypto === "" || ns.toCrypto === "") { // cryptos not chosen
                ns.blockAmount = true;
                ns.errorMsg = (ns.fromCrypto === "")? "Must choose from": "Must choose to";
            } else {
                let rate = me.getRate(ns);
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
                    ns.blockAmount = true;
                    ns.fromAmount = ns.toAmount = 0;
                } else {
                    ns.fromAmount = from;
                    ns.toAmount = to;
                }
            }
            return ns;
        });
    }
    /*updateState(prop: keyof stateType, val: any) {
        let obj: any = {};
        obj[prop] = val;
        this.setState(obj);
    }*/

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
        let ns: any = Swap.propertySwapper(this.state);
        this.setState(ns);
        this.updateState("toAmount", ns.toAmount); // hook into tests
    }

    swapClicked() {
        alert("swapping " + this.state.fromAmount + " " + this.state.fromCrypto + " for " + this.state.toAmount + " " + this.state.toCrypto);
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
                    disableCrypto={this.state.toCrypto}
                    blockAmount={this.state.blockAmount}
                    amount={this.state.fromAmount}
                    update={this.updatedFrom}
                    cryptos={this.props.cryptos}
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
                    disableCrypto={this.state.fromCrypto}
                    blockAmount={this.state.blockAmount}
                    amount={this.state.toAmount}
                    update={this.updatedTo}
                    cryptos={this.props.cryptos}
                />
                <Typography>{this.state.errorMsg}</Typography>
                <Button
                    disabled={this.state.errorMsg === ""? undefined: true}
                    onClick={this.swapClicked}
                >Swap{this.state.errorMsg===""? "!": ""}</Button>
            </Box>
            <UnderConstruction/>
        </Box>
    }

    static propertySwapper = new PropertySwapper("from", "to").swap;
}