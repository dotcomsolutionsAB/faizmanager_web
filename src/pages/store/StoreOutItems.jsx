import { useState } from "react";
import { CssBaseline, Box, Grid } from "@mui/material";
import AppTheme from "../../styles/AppTheme";
import StoreOutTable from "./storeComponents/StoreOutTable";
import StoreOutForm from "./storeComponents/StoreOutForm";

export default function StoreOutItems() {
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = () => setRefreshKey((k) => k + 1);

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
                            <StoreOutForm onSuccess={triggerRefresh} />
                        </Grid>

                        {/* ✅ Table Full Width Below */}
                        <Grid item xs={12}>
                            <StoreOutTable refreshKey={refreshKey} />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </AppTheme>
    );
}
