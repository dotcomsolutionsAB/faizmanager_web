import { Box, CssBaseline } from "@mui/material";
import AppTheme from "../../styles/AppTheme";
import { useContext, useEffect, useState } from "react";
import ExpensesForm from "../../components/accounts/expenses/ExpensesFrom";
import ExpensesTable from "../../components/accounts/expenses/ExpensesTable";
import PaymentsForm from "../../components/accounts/payments/PaymentsForm";
import PaymentsTable from "../../components/accounts/payments/PaymentsTable";
import { useUser } from "../../UserContext";
import { ContinuousColorLegend } from "@mui/x-charts";

import { useOutletContext } from "react-router-dom";


const Payments = () => {
    const {token} = useUser();
    const [selectedPaymentData, setSelectedPaymentData] = useState(null);
    const [payments, setPayments] = useState([]);
    const {selectedYear} = useOutletContext();

    // console.log(selectedYear)
  
      // Set the document title
      useEffect(() => {
        document.title = "Payments - FMB 52"; // Set the title for the browser tab
      }, []);

      const fetchData = async () => {
        try {
            const response = await fetch('https://api.fmb52.com/api/payments/all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }, body: JSON.stringify({
                    year: selectedYear,
                })
            })
            if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
                
            }
            const data = await response.json();
            // console.log("Payments: ", data);
            setPayments(data.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      }

      const handleEditPayment = (payment) => {
        // console.log(payment)
        setSelectedPaymentData(payment);
      }

      useEffect(() => {
        fetchData();
      },[]);
    
  return (
    <AppTheme>
      <CssBaseline />

      {/* Form Component */}
      <PaymentsForm paymentData = {selectedPaymentData} fetchData={fetchData}/>

      {/* Table Component */}
      <PaymentsTable payments={payments} onEdit={handleEditPayment} fetchData={fetchData}/>
    </AppTheme>
  );
};

export default Payments;