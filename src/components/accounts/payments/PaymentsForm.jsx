import React, { useState, useEffect } from "react";
import {
  Box, Typography, Grid, TextField, Button, Snackbar, Alert,
  IconButton, Collapse, CssBaseline, FormControl,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, Checkbox, Chip, InputLabel, Select, MenuItem,
  Divider
} from "@mui/material";
import AppTheme from "../../../styles/AppTheme";
import { yellow } from "../../../styles/ThemePrimitives";
import divider from '../../../assets/divider.png';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useUser } from "../../../UserContext";
import CancelIcon from "@mui/icons-material/Cancel";
import { useOutletContext, useLocation } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';


const PaymentsForm = ({paymentData, fetchData}) => {
  const { token } = useUser();
  const [collapsed, setCollapsed] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [receiptNos, setReceiptNos] = useState([]);
//   const [selectedReceipts, setSelectedReceipts] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { selectedSubSector, selectedYear } = useOutletContext();
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState("");

  


  // Controlled form states
//   const [date, setDate] = useState(""); // e.g. '2025-05-17'
//   const [remarks, setRemarks] = useState("");
//   const [year, setYear] = useState(""); // e.g. '1446-1447'

const [date, setDate] = useState(paymentData ? paymentData.date : "");
const [remarks, setRemarks] = useState(paymentData ? paymentData.comments: "");
const [selectedReceipts, setSelectedReceipts] = useState(
  paymentData ? paymentData.receipts.map((receipt) => (receipt.receipt_no) ): []
);
const [totalSelectedAmount, setTotalSelectedAmount] = useState(0);

const [year, setYear] = useState(paymentData ? paymentData.year : "");



// console.log("year", paymentData? paymentData.year: "");



useEffect(() => {
    if (paymentData) {
      // Prefill the form with the selected payment data
      setDate(paymentData.date);
      setRemarks(paymentData.comments);
      setSelectedReceipts(paymentData.receipts.map((receipt) => receipt.receipt_no));
      setYear(paymentData.year);

      // Pre-populate receiptNos with the existing data
      setReceiptNos(paymentData.receipts);

      // Calculate the initial total amount from paymentData.receipts
      const initialTotal = paymentData.receipts.reduce((total, receipt) => total + Number(receipt.amount), 0);
      setTotalSelectedAmount(initialTotal);  // Set the initial total

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

  }, [paymentData]);



  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await fetch("https://api.fmb52.com/api/sector", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        });
        const data = await response.json();
        if (data?.data) {
          setSectors(data.data);
          setSelectedSector(data.data[0].id);
        }
      } catch (err) {
        console.error("Error fetching sectors:", err);
      }
    };
    fetchSectors();
  }, [token]);

        const fetchReceipts = async () => {
        try {
          const response = await fetch("https://api.fmb52.com/api/receipts/pending", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              mode: "cash",
              sector: selectedSector,
              sub_sector: ""
            })
          });
          const data = await response.json();
          if (data?.data) {
            setReceiptNos(data.data);
          }
        } catch (err) {
          console.error("Error fetching receipt numbers:", err);
        }
      };

useEffect(() => {
    if (!paymentData) {

      fetchReceipts();
    }
  }, [token, selectedSector, selectedSubSector, paymentData]);

const toggleReceipt = (receiptNo) => {
  setSelectedReceipts((prev) => {
    let updatedReceipts;
    let newTotalAmount = totalSelectedAmount; // Start with the existing total

    if (prev.includes(receiptNo)) {
      // Receipt is being deselected, so subtract its amount
      updatedReceipts = prev.filter((r) => r !== receiptNo);
      const receipt = receiptNos.find((r) => r.receipt_no === receiptNo);
      if (receipt) {
        newTotalAmount -= Number(receipt.amount); // Decrease amount
      }
    } else {
      // Receipt is being selected, so add its amount
      updatedReceipts = [...prev, receiptNo];
      const receipt = receiptNos.find((r) => r.receipt_no === receiptNo);
      if (receipt) {
        newTotalAmount += Number(receipt.amount); // Increase amount
      }
    }

    // Update the total selected amount
    setTotalSelectedAmount(newTotalAmount);

    return updatedReceipts;
  });
};

// console.log(selectedYear)

//   // Calculate total amount of selected receipts
//   const totalSelectedAmount = selectedReceipts.reduce((total, receiptNo) => {
//     const receipt = receiptNos.find(r => r.receipt_no === receiptNo);
//     return receipt ? total + Number(receipt.amount) : total;
//   }, 0);

  // Submit handler to call POST /payments API
  const handleSubmit = async () => {
    if (!date) {
      setSnackbar({ open: true, message: "Please select a date", severity: "error" });
      return;
    }
    if (!selectedYear) {
      setSnackbar({ open: true, message: "Year is not selected in the context", severity: "error" });
      return;
    }
    if (selectedReceipts.length === 0) {
      setSnackbar({ open: true, message: "Please select at least one receipt", severity: "error" });
      return;
    }

    // Map selectedReceipts to send the receipt ids
  const receiptIds = selectedReceipts.map((receiptNo) => {
    const receipt = receiptNos.find((r) => r.receipt_no === receiptNo);
    return receipt ? receipt.id : null;
  }).filter(id => id !== null);

  if (receiptIds.length === 0) {
    setSnackbar({ open: true, message: "No valid receipts selected", severity: "error" });
    return;
  }

  const yearToSend = Array.isArray(selectedYear) ? selectedYear[0] : selectedYear;

    const payload = {
      date,
      receipt_ids: receiptIds,
      amount: totalSelectedAmount,
      year: yearToSend,
      remarks,
      mode: "cash"
    };
    // console.log("id", receiptIds)
    // console.log(selectedYear[0])
    console.log(payload)

    try {
        const url= paymentData ? `https://api.fmb52.com/api/payments/update/${paymentData.id}` : "https://api.fmb52.com/api/payments";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        setSnackbar({ open: true, message: data.message || "Payment created successfully!", severity: "success" });
        // Optionally reset form here:
      setSelectedReceipts([]);  // Clear selected receipts
      setDate("");  // Clear date
      setRemarks("");  // Clear remarks
      setYear("");  // Clear year
      setTotalSelectedAmount(0);
      fetchReceipts();
        fetchData()

      } else {
        setSnackbar({ open: true, message: data.message || "Failed to create payment", severity: "error" });
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Error submitting payment", severity: "error" });
    }
  };

  console.log(selectedReceipts)

  return (
    <AppTheme>
      <CssBaseline />
      <Box sx={{
        mt: 20, pt: 2, pb: 3, px: 3, mx: 2, mb: 1,
        backgroundColor: "#fff",
        border: "1px solid #F4EBD0",
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, p: "8px 16px", borderRadius: 1 }}>
            Add Payment
          </Typography>
          <Box>
            <FormControl sx={{ minWidth: 150, mr: 2 }}>
              <InputLabel id="sector-label">Sector</InputLabel>
              <Select
                labelId="sector-label"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                label="Sector"
                sx={{ height: "40px" }}
              >
                {sectors.map((sector) => (
                  <MenuItem key={sector.id} value={sector.id}>
                    {sector.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton onClick={() => setCollapsed((prev) => !prev)} sx={{ color: yellow[300], "&:hover": { color: yellow[400] } }}>
              {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </Box>
        </Box>

        {!collapsed && (
          <Box sx={{
            width: "calc(100% + 48px)",
            height: 15,
            backgroundImage: `url(${divider})`,
            backgroundRepeat: "repeat-x",
            backgroundSize: "contain",
            backgroundPosition: "center",
            marginLeft: "-24px",
            marginRight: "-24px",
            mb: 2,
          }} />
        )}

        <Collapse in={!collapsed}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={3} alignItems="center" sx={{ pr: 5 }}>

              <Grid item xs={12} md={4}>
                {/* <TextField
                fullWidth
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputProps={{
                  sx: {
                    height: '52px',
                    mb: '7px',
                    border: `1px solid ${yellow[400]}`,
                  },
                }}
              /> */}
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
                        '& .MuiOutlinedInput-root': {
                          height: '52px',
                          mb: '7px',
                          border: `1px solid ${yellow[400]}`,
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: yellow[400], // Ensures the outline gets the correct color
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: yellow[400], // Ensures border color on hover as well
                        },
                      },
 

                      onClick: (e) => {
                        e.currentTarget.querySelector('button')?.click();
                      },

                    },
                  }}

                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <Box
                    sx={{
                      border: `1px solid ${yellow[400]}`,
                      borderRadius: "8px",
                      display: "inline-flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      px: 1,
                      py: '12px',
                      mb: '7px',
                      minHeight: '52px',
                      cursor: "pointer",
                    }}
                    onClick={() => setDialogOpen(true)}
                    aria-haspopup="true"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') setDialogOpen(true); }}
                  >
                    {selectedReceipts.length === 0 ? (
                      <Typography sx={{ color: "#aaa" }}>Click to select receipts</Typography>
                    ) : (
                      selectedReceipts.map((val) => (
                        <Chip
                          key={val}
                          label={val}
                          onDelete={() => setSelectedReceipts((prev) => prev.filter((v) => v !== val))}
                          deleteIcon={<CancelIcon />}
                        />
                      ))
                    )}
                  </Box>
                </FormControl>

                <Dialog
                  open={dialogOpen}
                  onClose={() => setDialogOpen(false)}
                  fullWidth
                  maxWidth="lg"
                >
                  <DialogTitle>Select Receipt No(s)</DialogTitle>
                  <Box
                    sx={{
                      width: '100%',
                      position: 'relative',
                      height: '50vh',
                      backgroundImage: `url(${divider})`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'repeat-x',
                      backgroundPosition: 'center',
                    }}
                  />
                  <DialogContent>
                    <List>
                      {receiptNos.map((r) => {
                        const isChecked = selectedReceipts.includes(r.receipt_no);
                        return (
                          <>
                            <ListItem
                              key={r.id}
                              onClick={() => toggleReceipt(r.receipt_no)}
                              dense
                            >
                              <Checkbox
                                edge="start"
                                checked={isChecked}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': `checkbox-list-label-${r.id}` }}
                              />
                              <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", pr: 1 }}>
                                <Typography id={`checkbox-list-label-${r.id}`} component="span" variant="body1" sx={{ fontWeight: 'medium' }}>
                                  {r.receipt_no} - {r.name}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: "bold", minWidth: 80, textAlign: "right" }}>
                                  ₹{r.amount}
                                </Typography>
                              </Box>

                            </ListItem>
                            <Divider sx={{ margin: '10px 0' }} />
                          </>
                        );
                      })}

                    </List>
                  </DialogContent>
                  <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: yellow[400] }}>
                      Total Selected Amount: ₹{totalSelectedAmount.toFixed(2)}
                    </Typography>
                    <Button onClick={() => setDialogOpen(false)} color="primary" variant="contained">
                      Done
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Amount"
                  value={totalSelectedAmount.toFixed(2)}
                  InputProps={{
                    sx: {
                      height: '52px',
                      mb: '7px',
                      border: `1px solid ${yellow[400]}`,
                    },
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Comments"
                  multiline
                  rows={1}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  InputProps={{
                    sx: {
                      height: '52px',
                      mb: '7px',
                      border: `1px solid ${yellow[400]}`,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    color: "white",
                    backgroundColor: yellow[300],
                    "&:hover": { backgroundColor: yellow[200], color: "#000" }
                  }}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Grid>

            </Grid>
          </LocalizationProvider>
        </Collapse>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        sx={{ height: "100%" }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppTheme>
  );
};

export default PaymentsForm;
