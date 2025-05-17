import { Box, CssBaseline } from "@mui/material";
import AppTheme from "../../styles/AppTheme";
import { useEffect } from "react";
import ExpensesForm from "../../components/accounts/expenses/ExpensesFrom";
import ExpensesTable from "../../components/accounts/expenses/ExpensesTable";


const Expenses = () => {
      // Set the document title
      useEffect(() => {
        document.title = "Expenses - FMB 52"; // Set the title for the browser tab
      }, []);
    
  return (
    <AppTheme>
      <CssBaseline />

      {/* Form Component */}
      <ExpensesForm />

      {/* Table Component */}
      <ExpensesTable />
    </AppTheme>
  );
};

export default Expenses;