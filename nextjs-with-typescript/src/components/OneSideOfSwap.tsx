import { Box } from "@mui/system";
import React from "react";
import { CryptoSelect } from "./CryptoSelect";
import { MsgElement } from "./MsgElement";

export type data = {
    crypto: string
}

export class Side extends React.Component<{from?: string, show?: string, disable?: string, updated: (x: data) => any}, any> {

    render() {
        return <Box>
            <MsgElement beforeMsg={typeof this.props.from === "string"? "From": "To"}>
                <CryptoSelect
                    show={this.props.show}
                    disable={this.props.disable}
                    onChange={this.updateCrypto.bind(this)}
                />
            </MsgElement>
        </Box>
    }

    updateCrypto(crypto: string) {
        this.props.updated({
            crypto: crypto
        });
    }
}