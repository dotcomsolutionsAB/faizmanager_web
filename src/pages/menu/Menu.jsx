import { Box, CssBaseline } from "@mui/material";
import AppTheme from "../../styles/AppTheme";
import { useEffect } from "react";
import ExpensesForm from "../../components/accounts/expenses/ExpensesFrom";
import ExpensesTable from "../../components/accounts/expenses/ExpensesTable";
import MenuForm from "../../components/menu/MenuForm";
import MenuTable from "../../components/menu/MenuTable";
import React, { useState } from 'react';


const Menu = () => {
      // Set the document title
      useEffect(() => {
        document.title = "Menu - FMB 52"; // Set the title for the browser tab
      }, []);
      const [refreshTrigger, setRefreshTrigger] = useState(0);

        const [selectedMenu, setSelectedMenu] = useState(null);


         const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const handleEditMenu = (menuRow) => {
    setSelectedMenu(menuRow);
  };
    
  return (
    <AppTheme>
      <CssBaseline />
      <MenuForm menuData={selectedMenu}  onSuccess={triggerRefresh}  />


      <MenuTable onEditMenu={handleEditMenu}  refreshTrigger={refreshTrigger}/>
    </AppTheme>
  );
};

export default Menu;