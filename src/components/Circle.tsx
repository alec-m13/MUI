import { Box } from "@mui/system";
import React from "react";


export class Circle extends React.Component {
    render() {
        return <Box
            sx={{
                width: "80px",
                height: "80px",
                borderRadius: "40px",
                bgcolor: "primary.dark",
            }}
        >
        </Box>
    }
}