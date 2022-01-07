import { Container } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { UnderConstruction } from "./HelpPanels/UnderConstruction";
import { data as sideData, Side } from "./OneSideOfSwap";

export class Swap extends React.Component<{}, {
    inCrypto: string,
    outCrypto: string
}> {
    constructor(props: any) {
        super(props);
        this.state = {
            inCrypto: "ETH",
            outCrypto: ""
        }
    }

    updatedFrom(data: sideData) {
        alert("from: "+JSON.stringify(data));
    }

    updatedTo(data: sideData) {
        alert("to: "+JSON.stringify(data));
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
                    show={this.state.inCrypto}
                    disable={this.state.outCrypto}
                    updated={this.updatedFrom}
                />
                <button>⇅</button>
                <Side
                    show={this.state.outCrypto}
                    disable={this.state.inCrypto}
                    updated={this.updatedTo}
                />
                <button>Swap</button>
            </Box>
            <UnderConstruction/>
        </Box>
    }
}