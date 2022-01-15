import { Box } from "@mui/system";
import React from "react";


export class Circle extends React.Component {
    render() {
        return <Box
            sx={{
                padding: "1.5em",
                margin: "2em",
                borderRadius: "50%",
                borderStyle: "solid",
                borderWidth: "2px",
                borderColor: "primary.main",
                bgcolor: "primary.main",
            }}
        >
        </Box>
    }
}