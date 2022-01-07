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
    toBlock: any,
    fromBlock: any,
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
            toBlock: true,
            fromBlock: true,
            errorMsg: "",
        }
        // bind some callback functions
        bind(this, "updatedFrom");
        bind(this, "updatedTo");
        bind(this, "swap");
        bind(this, "swapClicked");
    }

    // in case updateState ever needs the fancier mechanism of checking values after updating
    updateState(prop: keyof stateType, val: any) {
        let me = this;
        this.setState(function(state) {
            let ns: any = Object.assign({}, state); // newState
            ns[prop] = val;
            let errorMsg = "", throwError: string;
            if (prop === "errorMsg") errorMsg = val;
            if (ns.fromCrypto === "") {
                throwError = "Must choose from";
                if (errorMsg !== throwError) me.updateState("errorMsg", throwError);
            } else if (ns.toCrypto === "") {

            }
            return ns;
        });
    }
    /*updateState(prop: keyof stateType, val: any) {
        let obj: any = {};
        obj[prop] = val;
        this.setState(obj);
    }*/

    getRate(): number {
        // rates returns $/token, getRate returns token (to) / token (from)
        return (rates.get(getDatum("symbol", this.state.fromCrypto, "id")) || 0) /
            (rates.get(getDatum("symbol", this.state.toCrypto, "id")) || Infinity);
    }

    updatedFrom(prop: keyof sideData, val: any) {
        if (prop === "amount") {
            let rate = this.getRate();
            let other = val * rate;
            if (other > 100) {
                other = 100;
                val = 100 / rate; // maxed out
            }
            if (val > 100) {
                val = 100;
                other = val * rate;
            }
            this.updateState("toAmount", other);
        }
        this.updateState("from"+(prop.charAt(0).toUpperCase())+prop.substring(1) as keyof stateType, val);
    }

    updatedTo(prop: keyof sideData, val: any) {
        if (prop === "amount") {
            let rate = this.getRate();
            let other = val / rate;
            if (other > 100) {
                other = 100;
                val = other * rate; // maxed out
            }
            if (val > 100) {
                val = 100;
                other = val / rate;
            }
            this.updateState("fromAmount", other);
        }
        this.updateState("to"+(prop.charAt(0).toUpperCase())+prop.substring(1) as keyof stateType, val);
    }

    errorOut(msg: string) {
        this.updateState("errorMsg", msg);

    }

    swap() {
        this.setState(Swap.propertySwapper(this.state));
    }

    swapClicked() {
        alert("swapping");
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
                    blockAmount={this.state.fromBlock}
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
                    blockAmount={this.state.toBlock}
                    amount={this.state.toAmount}
                    update={this.updatedTo}
                    cryptos={this.props.cryptos}
                />
                <Button
                    disabled={this.state.errorMsg === ""? undefined: true}
                    onClick={this.swapClicked}
                >{this.state.errorMsg || "Swap!"}</Button>
            </Box>
            <UnderConstruction/>
        </Box>
    }

    static propertySwapper = new PropertySwapper("from", "to").swap;
}