import { useState } from "react";
import { CssBaseline, Box, Grid } from "@mui/material";
import AppTheme from "../../styles/AppTheme";
import MenuDishTable from "./storeComponents/MenuDishTable";
import StoreDishForm from "./storeComponents/StoreDishForm";

export default function StoreMenuDish() {
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
                            <StoreDishForm onSuccess={triggerRefresh} />
                        </Grid>

                        <Grid item xs={12}>
                            <MenuDishTable refreshKey={refreshKey} />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </AppTheme>
    );
}
