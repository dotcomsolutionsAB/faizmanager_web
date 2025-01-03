import React from "react";
import { CssBaseline, Box, Grid, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppTheme from "../../styles/AppTheme";
import ThaaliStats from "../../components/dashboard/ThaaliStats";
import MumeneenStats from "../../components/dashboard/MumeneenStats";
import AccountStats from "../../components/dashboard/AccountsStats";
import AccountBreakupStats from "../../components/dashboard/AccountBreakupStats";
import SectorsStats from "../../components/dashboard/SectorsStats";
import divider from "../../assets/divider.png";
import { yellow, brown } from "../../styles/ThemePrimitives";

const JamiatAdminDashboard = ({ year, sector, subSector, hofCount }) => {
    const navigate = useNavigate();
  const handleImportRedirect = () => {
    // Implement navigation logic if needed
    navigate('/settings');
  };

  if (hofCount === 0) {
    return (
      <AppTheme>
        <CssBaseline />
        <Box
          sx={{
            backgroundColor: "#fff",
            mt: 20,
            pt: 2,
            px: 3,
            textAlign: "center",
            pb: 3,
            mr: 2,
            ml: 2,
            border: "1px solid #F4EBD0",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              marginBottom: 1,
              padding: "8px 16px",
              borderRadius: 1,
              color: yellow[400],
            }}
          >
            Welcome to FMB52!
          </Typography>
          <Box
            sx={{
              width: "calc(100% + 48px)",
              position: "relative",
              height: 15,
              backgroundImage: `url(${divider})`,
              backgroundSize: "contain",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center",
              mb: 2,
              marginLeft: "-24px",
              marginRight: "-24px",
            }}
          />
          <Typography variant="body1" gutterBottom sx={{ color: brown[700] }}>
            It looks like there are no users (Mumeneen) in the system yet. To start using the system, please import your Mumeneen database.
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 1,
              backgroundColor: yellow[400],
              "&:hover": {
                backgroundColor: yellow[100],
                color: "#000",
              },
            }}
            onClick={handleImportRedirect}
          >
            Import Mumeneen Database
          </Button>
        </Box>
      </AppTheme>
    );
  }

  return (
    <AppTheme>
      <CssBaseline />
      <Box sx={{ width: "100%", pr: 3, pb: 3, pt: 18 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6}>
            <ThaaliStats year={year} sector={sector} subSector={subSector} />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <MumeneenStats year={year} sector={sector} subSector={subSector} />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <AccountStats year={year} sector={sector} subSector={subSector} />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <AccountBreakupStats
              year={year}
              sector={sector}
              subSector={subSector}
            />
          </Grid>
          <Grid item xs={12}>
            <SectorsStats year={year} sector={sector} subSector={subSector} />
          </Grid>
        </Grid>
      </Box>
    </AppTheme>
  );
};

export default JamiatAdminDashboard;
