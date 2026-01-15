import React from "react";
import { CssBaseline, Box, Grid } from "@mui/material";
import AppTheme from "../../styles/AppTheme";
import StoreInTable from "./storeComponents/StoreInTable";

export default function StoreInItems() {
    return (
        <AppTheme>
            <CssBaseline />
            <Box
                sx={{
                    mt: 12,
                    pb: 3,
                    // pl: 3,
                    // pr: 3,
                    // mr: 2,
                    // ml: 2,
                    mb: 1,
                    // backgroundColor: "#fff",
                    // border: "1px solid #F4EBD0",
                    // borderRadius: 2,
                    // boxShadow: 1,
                }}
            >
                <Box sx={{ width: "100%", pr: 1, pb: 3 }}>
                    <Grid container spacing={2}>
                        {/* ✅ Form Full Width */}
                        <Grid item xs={12}>
                            {/* <StoreItemForm /> */}
                        </Grid>

                        {/* ✅ Table Full Width Below */}
                        <Grid item xs={12}>
                            <StoreInTable />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </AppTheme>
    );
}
