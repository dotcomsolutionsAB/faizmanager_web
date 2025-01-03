import React from "react";
import { CssBaseline, Box, Typography } from "@mui/material";
import AppTheme from "../../styles/AppTheme";
import { yellow, brown } from "../../styles/ThemePrimitives";

const SuperAdminDashboard = () => {
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
          Super Admin Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: brown[700] }}>
          This page is under development.
        </Typography>
      </Box>
    </AppTheme>
  );
};

export default SuperAdminDashboard;
