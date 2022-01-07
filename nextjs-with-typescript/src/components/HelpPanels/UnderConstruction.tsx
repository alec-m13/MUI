import { Container } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";


export class UnderConstruction extends React.Component {
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
            <p>Help panel under construction</p>
        </Box>
    }
}