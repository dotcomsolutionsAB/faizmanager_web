import React from "react";
import { CssBaseline, Box, Grid } from "@mui/material";
import AppTheme from "../../styles/AppTheme";
import StoreVendorTable from "./storeComponents/StoreVendorTable";
import StoreVendorForm from "./storeComponents/StoreVendorForm";

export default function StoreVendors() {
    return (
        <AppTheme>
            <CssBaseline />
            <Box
                sx={{
                    mt: 10,
                    pb: 3,
                    mb: 1,
                }}
            >
                <Box sx={{ width: "100%", pr: 1, pb: 3 }}>
                    <Grid container spacing={2}>
                        {/* ✅ Form Full Width */}
                        <Grid item xs={12}>
                            <StoreVendorForm />
                        </Grid>

                        {/* ✅ Table Full Width Below */}
                        <Grid item xs={12}>
                            <StoreVendorTable />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </AppTheme>
    );
}
