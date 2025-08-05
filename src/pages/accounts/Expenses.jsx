import { Box, CssBaseline } from "@mui/material";
import AppTheme from "../../styles/AppTheme";
import { useEffect, useState } from "react";
import ExpensesForm from "../../components/accounts/expenses/ExpensesFrom";
import ExpensesTable from "../../components/accounts/expenses/ExpensesTable";

const Expenses = () => {
  const [selectedExpenseData, setSelectedExpenseData] = useState(null);
  

  // Set the document title
  useEffect(() => {
    document.title = "Expenses - FMB 52"; // Set the title for the browser tab
  }, []);

  // Example function to handle selecting an expense for editing
  const handleEditExpense = (expense) => {
    // console.log("Expenses",expense)
    setSelectedExpenseData(expense);  // Set selected expense data
  };

  return (
    <AppTheme>
      <CssBaseline />

      {/* Form Component */}
      <ExpensesForm expenseData={selectedExpenseData} /> {/* Pass the selected data to the form */}

      {/* Table Component */}
      <ExpensesTable onEdit={handleEditExpense} /> {/* Pass the handleEditExpense function to table */}
    </AppTheme>
  );
};

export default Expenses;
