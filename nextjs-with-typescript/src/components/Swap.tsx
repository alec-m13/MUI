import { Button, Container } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { UnderConstruction } from "./HelpPanels/UnderConstruction";
import { data as sideData, Side } from "./OneSideOfSwap";
import { bind } from "../utility/binder";
import { PropertySwapper } from "../utility/PropertySwapper";

export class Swap extends React.Component<{}, {
    fromCrypto: string,
    toCrypto: string
}> {
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
    }

    updatedFrom(data: sideData) {
        this.setState({fromCrypto: data.crypto});
    }

    updatedTo(data: sideData) {
        this.setState({toCrypto: data.crypto});
    }

    swap() {
        /*console.log(this.state, Swap.propertySwapper(this.state));
        this.setState(Swap.propertySwapper(this.state));
        console.log(this.state);
        let me = this;
        window.setTimeout(function() {console.log(me.state)}, 1000);*/
        this.setState({fromCrypto: this.state.toCrypto, toCrypto: this.state.fromCrypto});
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
            <Box>
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
                <button>Swap</button>
            </Box>
            <UnderConstruction/>
        </Box>
    }

    static propertySwapper = new PropertySwapper("from", "to").swap;
}