import { Box } from "@mui/system";
import { Circle } from "./Circle";
import React from "react";
import { Button, Typography } from "@mui/material";

type propsType = {
    title: string,
}

export class HelpPanel extends React.Component<propsType, any> {
    render() {
        return <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: "background.dark",
                minWidth: "20em",
                height: "100px",
            }}
        >
            <Circle/>
            <Typography variant="h5">{this.props.title}</Typography>
            {this.props.children}
        </Box>
    }
}