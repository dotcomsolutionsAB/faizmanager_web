import React from "react";
import { CssBaseline, Box, Grid } from "@mui/material";
import AppTheme from "../../styles/AppTheme";
import StoreStats from "./StoreStats";
import StoreDashboardItemTable from "./StoreDashboardItemTable";

const StoreDashboard = () => {
    return (
        <AppTheme>
            <CssBaseline />
            <Box sx={{ width: "100%", pr: 3, pb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6}>
                        <StoreStats />
                    </Grid>

                    <Grid item xs={12} sm={12} md={6}>
                        <StoreDashboardItemTable />
                    </Grid>
                </Grid>
            </Box>
        </AppTheme>
    );
};

export default StoreDashboard;
