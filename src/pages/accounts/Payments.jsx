import { Box, CssBaseline } from "@mui/material";
import AppTheme from "../../styles/AppTheme";
import { useEffect } from "react";
import ExpensesForm from "../../components/accounts/expenses/ExpensesFrom";
import ExpensesTable from "../../components/accounts/expenses/ExpensesTable";
import PaymentsForm from "../../components/accounts/payments/PaymentsForm";
import PaymentsTable from "../../components/accounts/payments/PaymentsTable";


const Sector = () => {
      // Set the document title
      useEffect(() => {
        document.title = "Payments - FMB 52"; // Set the title for the browser tab
      }, []);
    
  return (
    <AppTheme>
      <CssBaseline />

      {/* Form Component */}
      <PaymentsForm/>

      {/* Table Component */}
      <PaymentsTable />
    </AppTheme>
  );
};

export default Sector;