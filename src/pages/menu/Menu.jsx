import { Box, CssBaseline } from "@mui/material";
import AppTheme from "../../styles/AppTheme";
import { useEffect } from "react";
import ExpensesForm from "../../components/accounts/expenses/ExpensesFrom";
import ExpensesTable from "../../components/accounts/expenses/ExpensesTable";
import MenuForm from "../../components/menu/MenuForm";
import MenuTable from "../../components/menu/MenuTable";


const Menu = () => {
      // Set the document title
      useEffect(() => {
        document.title = "Expenses - FMB 52"; // Set the title for the browser tab
      }, []);
    
  return (
    <AppTheme>
      <CssBaseline />

      {/* Form Component */}
      <MenuForm />

      {/* Table Component */}
      <MenuTable />
    </AppTheme>
  );
};

export default Menu;