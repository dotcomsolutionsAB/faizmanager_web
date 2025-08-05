import React, { useState, useEffect } from "react";
import {
  Box, Typography, Grid, TextField, Button, Snackbar, Alert,
  IconButton, Collapse, CssBaseline, FormControl,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, Checkbox, Chip
} from "@mui/material";
import AppTheme from "../../../styles/AppTheme";
import { yellow } from "../../../styles/ThemePrimitives";
import divider from '../../../assets/divider.png';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useUser } from "../../../UserContext";
import CancelIcon from "@mui/icons-material/Cancel";
import { useOutletContext, useLocation } from "react-router-dom";


const PaymentsForm = () => {
  const { token } = useUser();
  const [collapsed, setCollapsed] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [receiptNos, setReceiptNos] = useState([]);
  const [selectedReceipts, setSelectedReceipts] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { selectedSector, selectedSubSector, selectedYear } = useOutletContext();


  // Controlled form states
  const [date, setDate] = useState(""); // e.g. '2025-05-17'
  const [remarks, setRemarks] = useState("");
  const [year, setYear] = useState(""); // e.g. '1446-1447'

  useEffect(() => {
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
            sub_sector: selectedSubSector
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
    fetchReceipts();
  }, [token, selectedSector, selectedSubSector]);

  const toggleReceipt = (receiptNo) => {
    setSelectedReceipts((prev) => {
      if (prev.includes(receiptNo)) {
        return prev.filter((r) => r !== receiptNo);
      } else {
        return [...prev, receiptNo];
      }
    });
  };

  // Calculate total amount of selected receipts
  const totalSelectedAmount = selectedReceipts.reduce((total, receiptNo) => {
    const receipt = receiptNos.find(r => r.receipt_no === receiptNo);
    return receipt ? total + Number(receipt.amount) : total;
  }, 0);

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
    const payload = {
      date,
      receipt_ids: selectedReceipts,
      amount: totalSelectedAmount,
      year: selectedYear,
      remarks
    };

    try {
      const response = await fetch("https://api.fmb52.com/api/payments", {
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
        setSelectedReceipts([]);
        setDate("");
        setRemarks("");
        setYear("");
      } else {
        setSnackbar({ open: true, message: data.message || "Failed to create payment", severity: "error" });
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Error submitting payment", severity: "error" });
    }
  };

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
          <IconButton onClick={() => setCollapsed((prev) => !prev)} sx={{ color: yellow[300], "&:hover": { color: yellow[400] } }}>
            {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
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
          <Grid container spacing={3} alignItems="center" sx={{ pr: 5 }}>

            <Grid item xs={12} md={4}>
              <TextField
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
                        <ListItem
                          key={r.id}
                          button
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
