// import { Box, CssBaseline } from "@mui/material";
// import AppTheme from "../../styles/AppTheme";
// import { useEffect, useState } from "react";
// import ExpensesForm from "../../components/accounts/expenses/ExpensesFrom";
// import ExpensesTable from "../../components/accounts/expenses/ExpensesTable";

// const Expenses = () => {
//   const [selectedExpenseData, setSelectedExpenseData] = useState(null);
  

//   // Set the document title
//   useEffect(() => {
//     document.title = "Expenses - FMB 52"; // Set the title for the browser tab
//   }, []);

//   // Example function to handle selecting an expense for editing
//   const handleEditExpense = (expense) => {
//     // console.log("Expenses",expense)
//     setSelectedExpenseData(expense);  // Set selected expense data
//   };

//   return (
//     <AppTheme>
//       <CssBaseline />

//       {/* Form Component */}
//       <ExpensesForm expenseData={selectedExpenseData} /> {/* Pass the selected data to the form */}

//       {/* Table Component */}
//       <ExpensesTable onEdit={handleEditExpense} /> {/* Pass the handleEditExpense function to table */}
//     </AppTheme>
//   );
// };

// export default Expenses;


import React, { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import AppTheme from "../../styles/AppTheme";
import ExpensesForm from '../../components/accounts/expenses/ExpensesFrom';
import ExpensesTable from '../../components/accounts/expenses/ExpensesTable';
import { useUser } from '../../UserContext';

const Expenses = () => {
    const {token} = useUser()
  const [selectedExpenseData, setSelectedExpenseData] = useState(null);
  const [expenses, setExpenses] = useState([]); // State to store the fetched expenses

  // Function to fetch data
  const fetchData = async () => {
    try {
      const response = await fetch('https://api.fmb52.com/api/expense', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)
      setExpenses(data.data || []); // Update expenses state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Example function to handle selecting an expense for editing
  const handleEditExpense = (expense) => {
    setSelectedExpenseData(expense); // Set selected expense data for editing
  };

  // Fetch data initially when component mounts
  useEffect(() => {
    fetchData(); // Fetch data on initial load
  }, []);

  return (
    <AppTheme>
      <CssBaseline />

      {/* Form Component */}
      <ExpensesForm 
        expenseData={selectedExpenseData} 
        fetchData={fetchData} // Pass fetchData to ExpensesFormTrial
      />

      {/* Table Component */}
      <ExpensesTable 
        expenses={expenses} // Pass fetched expenses data to the table
        onEdit={handleEditExpense} // Pass the handleEditExpense function to the table
        fetchData={fetchData} // Pass fetchData to ExpensesTableTrial
      />
    </AppTheme>
  );
};

export default Expenses;
