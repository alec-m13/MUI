import { Box } from "@mui/system";
import React from "react";
import { CryptoOption } from "./CryptoOption";

export class MsgElement extends React.Component<{beforeMsg?: string, afterMsg?: string}, any> {
    render() {
        // should loop over utility.cryptos.allNames but I'm brand new to react and don't know how yet
        return <Box
        sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'left',
            alignItems: 'left',
          }}
        >
            <p>{this.props.beforeMsg}</p>
            {this.props.children}
            <p>{this.props.afterMsg}</p>
        </Box>
    }
}