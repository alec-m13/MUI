import { Button, Container } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { UnderConstruction } from "./HelpPanels/UnderConstruction";
import { data as sideData, Side } from "./OneSideOfSwap";
import { bind } from "../utility/binder";
import { PropertySwapper } from "../utility/PropertySwapper";

type stateType = {
    fromCrypto: string,
    toCrypto: string
}

export class Swap extends React.Component<{}, stateType> {
    constructor(props: any) {
        super(props);
        this.state = {
            fromCrypto: "ETH",
            toCrypto: ""
        }
        // bind some callback functions
        bind(this, "updatedFrom");
        bind(this, "updatedTo");
        bind(this, "swap");
        bind(this, "swapClicked");
    }

    updateState(prop: keyof stateType, val: any) {
        this.setState(function(state) {
            let obj: any = {};
            obj[prop] = val;
            return obj;
        });
    }

    updatedFrom(data: sideData) {
        this.updateState("fromCrypto", data.crypto);
    }

    updatedTo(data: sideData) {
        this.updateState("toCrypto", data.crypto);
    }

    swap() {
        this.setState(Swap.propertySwapper(this.state));
    }

    swapClicked() {
        alert("swapping");
    }


    // the isReady button disabling is throwing errors as in https://github.com/vercel/next.js/discussions/21999
    isReady() {
        return this.state.fromCrypto !== "" && this.state.toCrypto !== "";
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
                    updated={this.updatedFrom}
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
                    updated={this.updatedTo}
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