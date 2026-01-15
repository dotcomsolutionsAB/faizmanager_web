// import React from "react";
// import { CssBaseline, Box, Typography } from "@mui/material";
// import AppTheme from "../../styles/AppTheme";
// import { yellow, brown } from "../../styles/ThemePrimitives";

// const MumeneenDashboard = () => {
//   return (
//          <AppTheme>
//            <CssBaseline />
//            <Box
//              sx={{
//                backgroundColor: "#fff",
//                mt: 20,
//                pt: 2,
//                px: 3,
//                textAlign: "center",
//                pb: 3,
//                mr: 2,
//                ml: 2,
//                border: "1px solid #F4EBD0",
//                borderRadius: 2,
//                boxShadow: 1,
//              }}
//            >
//              <Typography
//                variant="h6"
//                sx={{
//                  fontWeight: "bold",
//                  marginBottom: 1,
//                  padding: "8px 16px",
//                  borderRadius: 1,
//                  color: yellow[400],
//                }}
//              >
//                Mumeneen Dashboard
//              </Typography>
//              <Typography variant="body1" sx={{ color: brown[700] }}>
//                This page is under development.
//              </Typography>
//            </Box>
//          </AppTheme>
//   );
// };

// export default MumeneenDashboard;

import React from "react";
import { CssBaseline, Box, Grid, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppTheme from "../../styles/AppTheme";
import ThaaliStats from "../../components/dashboard/ThaaliStats";
import MumeneenStats from "../../components/dashboard/MumeneenStats";
import AccountStats from "../../components/dashboard/AccountsStats";
import AccountBreakupStats from "../../components/dashboard/AccountBreakupStats";
import SectorsStats from "../../components/dashboard/SectorsStats";
import HubDistributionStats from "./HubDistributionStats";
import NiyazStats from "./NiyazStats";
import divider from "../../assets/divider.png";
import { yellow, brown } from "../../styles/ThemePrimitives";
import MohallaWiseStats from "./MohallaWiseStats";

const MumeneenDashboard = ({ year, sector, subSector, hofCount }) => {
  const navigate = useNavigate();


  return (
    <AppTheme>
      <CssBaseline />
      <Box sx={{ width: "100%", pr: 3, pb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6}>
            <HubDistributionStats year={year} sector={sector} subSector={subSector} />
          </Grid>

          <Grid item xs={12} sm={12} md={6}>
            <AccountStats year={year} sector={sector} subSector={subSector} />
          </Grid>


        </Grid>
      </Box>
    </AppTheme>
  );
};

export default MumeneenDashboard;
