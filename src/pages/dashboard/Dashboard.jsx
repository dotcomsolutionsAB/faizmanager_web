import React, { useState, useEffect } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import AppTheme from "../../styles/AppTheme";
import { CssBaseline, Box, CircularProgress } from "@mui/material";
import MumeneenDashboard from "../../components/dashboard/MumeneenDashboard";
import JamiatAdminDashboard from "../../components/dashboard/JamiatAdminDashboard";
import SuperAdminDashboard from "../../components/dashboard/SuperAdminDashboard";
import CoordinatorDashboard from "../../components/dashboard/CoordinatorDashboard";

// ✅ Add these if you have them:
import SectorAdminDashboard from "../../components/dashboard/SectorAdminDashboard";
import MasoolDashboard from "../../components/dashboard/MasoolDashboard";
import MusaidDashboard from "../../components/dashboard/MusaidDashboard";
import StoreDashboard from "../../components/dashboard/StoreDashboard";

import { Snackbar, Alert, Button } from "@mui/material";

const Dashboard = () => {
  const { selectedSector, selectedSubSector, selectedYear } = useOutletContext();
  const { role, hofCount, accessRoleId } = useUser();
  const location = useLocation();
  const { state } = location;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);

  const year = selectedYear?.length ? selectedYear : "1445-1446";
  const sector = selectedSector?.length ? selectedSector : ["all"];
  const subSector = selectedSubSector?.length ? selectedSubSector : ["all"];

  useEffect(() => {
    document.title = "Dashboard - FMB 52";
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (state?.snackbarMessage) {
      setSnackbarMessage(state.snackbarMessage);
      setSnackbarSeverity(state.snackbarSeverity || "success");
      setSnackbarOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [state]);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  if (loading) {
    return (
      <AppTheme>
        <CssBaseline />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
          <CircularProgress />
        </Box>
      </AppTheme>
    );
  }

  let dashboardContent;

  // ✅ Access-role based routing first
  const accessId = Number(accessRoleId);
  if ([1, 2, 3, 4].includes(accessId)) {
    switch (accessId) {
      case 1: // Sector Admin
        dashboardContent = (
          <SectorAdminDashboard
            year={year}
            sector={sector}
            subSector={subSector}
            hofCount={hofCount}
          />
        );
        break;

      case 2: // Masool
        dashboardContent = (
          <MasoolDashboard
            year={year}
            sector={sector}
            subSector={subSector}
            hofCount={hofCount}
          />
        );
        break;


      case 3: // Musaid
        dashboardContent = (
          <MusaidDashboard
            year={year}
            sector={sector}
            subSector={subSector}
            hofCount={hofCount}
          />
        );
        break;

      case 4: // Coordinator
        dashboardContent = (
          <CoordinatorDashboard
            year={year}
            sector={sector}
            subSector={subSector}
            hofCount={hofCount}
          />
        );
        break;

      default:
        break;
    }
  } else {
    // Fallback: old role-based routing
    switch (role) {
      case "mumeneen":
        dashboardContent = (
          <MumeneenDashboard
            year={year}
            sector={sector}
            subSector={subSector}
            hofCount={hofCount}
          />
        );
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
      case "store":
      case "Store":
      case "STORE":
        dashboardContent = (
          <StoreDashboard
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
  }

  return (
    <>
      <div
        style={{
          filter: snackbarOpen ? "blur(5px)" : "none",
          transition: "filter 0.3s ease",
          pointerEvents: snackbarOpen ? "none" : "auto",
          userSelect: snackbarOpen ? "none" : "auto",
          marginTop: "80px",
        }}
      >
        {dashboardContent}
      </div>

      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        sx={{ height: "100%" }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
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