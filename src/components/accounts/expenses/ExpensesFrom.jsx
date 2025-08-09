import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  CssBaseline,
  Grid,
  IconButton,
} from "@mui/material";
import { yellow } from "../../../styles/ThemePrimitives";
import AppTheme from "../../../styles/AppTheme";
import divider from "../../../assets/divider.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Collapse from "@mui/material/Collapse";
import { useUser } from "../../../contexts/UserContext";
import { useOutletContext, useLocation } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';


const ExpensesForm = ({ expenseData, fetchData }) => { // Accept expenseData as prop
  const [collapsed, setCollapsed] = useState(false);
  const { token } = useUser();
  const { selectedYear } = useOutletContext();
// console.log("Form", expenseData)
  // States for form fields
  
  const [name, setName] = useState(expenseData ? expenseData.name : "");
  const [date, setDate] = useState(expenseData ? expenseData.date : new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState(expenseData ? expenseData.amount : "");
  const [chequeNo, setChequeNo] = useState(expenseData ? expenseData.cheque_no : "");
  const [description, setDescription] = useState(expenseData ? expenseData.description : "");
  const [attachment, setAttachment] = useState(null);


  // Snackbar state variables
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (expenseData) {
      // If expenseData is passed (editing), set the form fields with the data
      setName(expenseData.name || "");
      setDate(expenseData.date || new Date().toISOString().split("T")[0]);
      setAmount(expenseData.amount || "");
      setChequeNo(expenseData.cheque_no || "");
      setDescription(expenseData.description || "");
    }
  }, [expenseData]); // Re-run when expenseData changes

  const handleCollapseToggle = () => {
    setCollapsed((prev) => !prev);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

const handleSubmit = async () => {
    if (!name || !date || !amount || !chequeNo) {
      setSnackbarMessage("Please fill all required fields");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Cheque number must be exactly 6 digits
    const chequePattern = /^\d{6}$/;
    if (!chequePattern.test(chequeNo)) {
      setSnackbarMessage("Cheque number must be exactly 6 digits.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const body = JSON.stringify({
      paid_to: name,
      date: date,
      amount: amount,
      cheque_no: chequeNo,
      description: description,
    });

    try {
      const url = expenseData
        ? `https://api.fmb52.com/api/expense/update/${expenseData.id}`
        : "https://api.fmb52.com/api/expense";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body,
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbarMessage(data.message || "Expense created/updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        if (!expenseData) {
          setName("");
          setAmount("");
          setChequeNo("");
          setDescription("");
          setDate(new Date().toISOString().split("T")[0]);
        }
        fetchData()
      } else {
        setSnackbarMessage(data.message || "Failed to create/update expense");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error: " + error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  



  return (
    <AppTheme>
      <CssBaseline />
      <Box sx={{ mt: 20, pt: 2, pb: 3, pl: 3, pr: 3, mr: 2, ml: 2, mb: 1, backgroundColor: "#fff", border: "1px solid #F4EBD0", borderRadius: 2, boxShadow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1, padding: "8px 16px", borderRadius: 1 }}>
            {expenseData ? "Edit Expense" : "Add Expense"}
          </Typography>
          <IconButton onClick={handleCollapseToggle} sx={{ color: yellow[300], "&:hover": { color: yellow[400] } }}>
            {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        </Box>
        {!collapsed && (
          <Box sx={{ width: "calc(100% + 48px)", position: "relative", height: 15, backgroundImage: `url(${divider})`, backgroundSize: "contain", backgroundRepeat: "repeat-x", backgroundPosition: "center", mb: 2, marginLeft: "-24px", marginRight: "-24px" }} />
        )}
        <Collapse in={!collapsed}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={3} alignItems="center" sx={{ pr: 5 }}>
            <Grid item xs={12} md={3}>
              {/* <TextField fullWidth label="Date" type="date" InputLabelProps={{ shrink: true }} value={date} onChange={(e) => setDate(e.target.value)} required /> */}
                                                  <DatePicker
                                                      label="Date"
                                                      value={date ? dayjs(date) : null}
                                                      onChange={(newValue) => {
                                                          if (newValue?.isValid()) {
                                                              setDate(newValue.format('YYYY-MM-DD'));
                                                          }
                                                      }}
                                                      slotProps={{
                                                          textField: {
                                                              fullWidth: true,
                                                              sx: {
                                                                  '& .MuiIconButton-root': {
                                                                      border: 'none',
                                                                      padding: 0,
                                                                      margin: 0,
                                                                      backgroundColor: 'transparent',
                                                                  },
                                                              },
                                                              onClick: (e) => {
                                                                  e.currentTarget.querySelector('button')?.click();
                                                              },
                                                          },
                                                      }}
                                                      required
                                                  />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth label="Paid To" value={name} onChange={(e) => setName(e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth label="Cheque No." value={chequeNo} onChange={(e) => setChequeNo(e.target.value)} required />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Description" multiline rows={1} value={description} onChange={(e) => setDescription(e.target.value)} />
            </Grid>

            <Grid item xs={12} sx={{ textAlign: "right" }}>
              <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ color: "white", backgroundColor: yellow[300], "&:hover": { backgroundColor: yellow[200], color: "#000" } }}>
                Submit
              </Button>
            </Grid>
          </Grid>
          </LocalizationProvider>
        </Collapse>
      </Box>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} onClose={handleSnackbarClose} sx={{ height: "100%" }} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled" sx={{ width: "100%" }} action={<Button color="inherit" size="small" onClick={handleSnackbarClose}>OK</Button>}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AppTheme>
  );
};

export default ExpensesForm;
