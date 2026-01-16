import { useState } from "react";
import { CssBaseline, Box, Grid } from "@mui/material";
import AppTheme from "../../styles/AppTheme";
import StoreInTable from "./storeComponents/StoreInTable";
import StoreInForm from "./storeComponents/StoreInForm";

export default function StoreInItems() {
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = () => setRefreshKey((k) => k + 1);

    return (
        <AppTheme>
            <CssBaseline />
            <Box
                sx={{
                    mt: 8,
                    pb: 3,
                    mb: 1,
                }}
            >
                <Box sx={{ width: "100%", pr: 1, pb: 3 }}>
                    <Grid container spacing={2}>
                        {/* ✅ Form Full Width */}
                        <Grid item xs={12}>
                            <StoreInForm onSuccess={triggerRefresh} />
                        </Grid>

                        {/* ✅ Table Full Width Below */}
                        <Grid item xs={12}>
                            <StoreInTable refreshKey={refreshKey} />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </AppTheme>
    );
}
