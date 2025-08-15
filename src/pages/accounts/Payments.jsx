import { Box, CssBaseline } from "@mui/material";
import AppTheme from "../../styles/AppTheme";
import { useEffect, useState, useCallback } from "react";
import PaymentsForm from "../../components/accounts/payments/PaymentsForm";
import PaymentsTable from "../../components/accounts/payments/PaymentsTable";
import { useUser } from "../../contexts/UserContext";
import { useOutletContext } from "react-router-dom";

const Payments = () => {
  const { token } = useUser();
  const { selectedYear } = useOutletContext();

  const [selectedPaymentData, setSelectedPaymentData] = useState(null);
  const [payments, setPayments] = useState([]);

  // Always resolve the year safely
  const yearToSend = Array.isArray(selectedYear) ? selectedYear[0] : selectedYear;

  useEffect(() => {
    document.title = "Payments - FMB 52";
  }, []);

  // Make fetchData stable and always use the latest token/year
  const fetchData = useCallback(async () => {
    // Don’t hit the API until we actually have a year
    if (!yearToSend) return;

    const payload = { year: yearToSend };
    // console.log("Fetching payments with payload:", payload);

    try {
      const response = await fetch("https://api.fmb52.com/api/payments/all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setPayments(data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [token, yearToSend]);

  // Refetch whenever token or year changes (including the first time year becomes available)
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditPayment = (payment) => {
    setSelectedPaymentData(payment);
  };

  return (
    <AppTheme>
      <CssBaseline />
      <PaymentsForm paymentData={selectedPaymentData} fetchData={fetchData} />
      <PaymentsTable payments={payments} onEdit={handleEditPayment} fetchData={fetchData} />
    </AppTheme>
  );
};

export default Payments;
