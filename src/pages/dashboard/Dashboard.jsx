import React, { useState, useEffect } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import { useUser } from "../../UserContext";
import AppTheme from "../../styles/AppTheme";
import { CssBaseline, Box, CircularProgress } from "@mui/material";
import MumeneenDashboard from "../../components/dashboard/MumeneenDashboard";
import JamiatAdminDashboard from "../../components/dashboard/JamiatAdminDashboard";
import SuperAdminDashboard from "../../components/dashboard/SuperAdminDashboard";
import { Snackbar, Alert } from '@mui/material';
import Button from '@mui/material/Button';

const Dashboard = () => {
  const { selectedSector, selectedSubSector, selectedYear } = useOutletContext();
  const { role, hofCount } = useUser();
    const location = useLocation();
  const { state } = location;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const year = selectedYear.length ? selectedYear : "1445-1446";
  const sector = selectedSector.length ? selectedSector : ["all"];
  const subSector = selectedSubSector.length ? selectedSubSector : ["all"];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard - FMB 52";
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulated delay for fetching data
    return () => clearTimeout(timer);
  }, []);

   useEffect(() => {
    if (state?.snackbarMessage) {
      setSnackbarMessage(state.snackbarMessage);
      setSnackbarSeverity(state.snackbarSeverity || 'success');
      setSnackbarOpen(true);
      // Optionally clear the location state to prevent showing snackbar on refresh
      window.history.replaceState({}, document.title);
    }
  }, [state]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <AppTheme>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      </AppTheme>
    );
  }

   let dashboardContent;
  switch (role) {
    case "mumeneen":
      dashboardContent = <MumeneenDashboard />;
      break;
    case "superadmin":
      dashboardContent = <SuperAdminDashboard />;
      break;
    case "jamiat_admin":
      dashboardContent = (
        <JamiatAdminDashboard
          year={year}
          sector={sector}
          subSector={subSector}
          hofCount={hofCount}
        />
      );
      break;
    default:
      dashboardContent = (
        <AppTheme>
          <CssBaseline />
          <Box
            sx={{
              backgroundColor: "#fff",
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
            <h2>Unauthorized</h2>
            <p>You do not have access to this dashboard.</p>
          </Box>
        </AppTheme>
      );
  }

  return (
    <>
      <div
        style={{
          filter: snackbarOpen ? "blur(5px)" : "none",
          transition: "filter 0.3s ease",
          pointerEvents: snackbarOpen ? "none" : "auto",
          userSelect: snackbarOpen ? "none" : "auto",
          marginTop: '145px'
        }}
      >
        {dashboardContent}
      </div>

      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
         sx={{ height: "100%"}}
   anchorOrigin={{
      vertical: "top",
      horizontal: "center"
   }}

      >
        <Alert
    onClose={handleSnackbarClose}
    severity={snackbarSeverity}
    variant="filled"
    sx={{ width: "100%",  
     }}
    action={
      <Button color="inherit" size="small" onClick={handleSnackbarClose}>
        OK
      </Button>
    }
  >
    {snackbarMessage}
  </Alert>
      </Snackbar>
    </>
  );
};

export default Dashboard;