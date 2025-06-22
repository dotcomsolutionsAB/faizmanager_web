import React from "react";
import { CssBaseline } from "@mui/material";
import AppTheme from "../../styles/AppTheme";
import RolesForm from "../../components/userManagement/roles/RolesForm"; // Adjust the path as needed
import RolesTable from "../../components/userManagement/roles/RolesTable";
import { useEffect } from "react";


const Roles= () => {
      // Set the document title
      useEffect(() => {
        document.title = "Roles - FMB 52"; // Set the title for the browser tab
      }, []);
    
  return (
    <AppTheme>
      <CssBaseline />

      {/* Form Component */}
      <RolesForm />

      {/* Table Component */}
      <RolesTable />
    </AppTheme>
  );
};

export default Roles;