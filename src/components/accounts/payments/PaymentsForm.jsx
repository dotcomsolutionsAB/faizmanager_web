import React, { useState, useEffect, useMemo } from "react";
import {
  Box, Typography, Grid, TextField, Button, Snackbar, Alert,
  IconButton, Collapse, CssBaseline, FormControl,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, Checkbox, Chip, InputLabel, Select, MenuItem,
} from "@mui/material";
import AppTheme from "../../../styles/AppTheme";
import { yellow } from "../../../styles/ThemePrimitives";
import divider from "../../../assets/divider.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useUser } from "../../../contexts/UserContext";
import CancelIcon from "@mui/icons-material/Cancel";
import { useOutletContext } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const PaymentsForm = ({ paymentData, fetchData }) => {
  const { token, accessRoleId } = useUser();
  const { selectedSubSector, selectedYear } = useOutletContext();

  const [collapsed, setCollapsed] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [dialogOpen, setDialogOpen] = useState(false);

  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState("");

  const [allReceipts, setAllReceipts] = useState([]); // fetched receipts
  const [selectedReceipts, setSelectedReceipts] = useState(
    paymentData ? paymentData.receipts.map((r) => r.receipt_no) : []
  );

  const [date, setDate] = useState(paymentData ? paymentData.date : "");
  const [remarks, setRemarks] = useState(paymentData ? paymentData.comments : "");
  const [year, setYear] = useState(paymentData ? paymentData.year : "");
  const [totalSelectedAmount, setTotalSelectedAmount] = useState(0);

  // Prefill (edit mode)
  useEffect(() => {
    if (paymentData) {
      setDate(paymentData.date);
      setRemarks(paymentData.comments);
      setSelectedReceipts(paymentData.receipts.map((r) => r.receipt_no));
      setYear(paymentData.year);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [paymentData]);


  // Fetch receipts (always — also in edit so user can add/remove)
  const fetchReceipts = async () => {
    try {
      const resp = await fetch("https://api.fmb52.com/api/receipts/pending", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          mode: "cash",
          sector: "",
          sub_sector: "", // or selectedSubSector if applicable
        }),
      });
      const data = await resp.json();
      if (data?.data) setAllReceipts(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      console.error("Error fetching receipt numbers:", e);
    }
  };

  // useEffect(() => {
  //   if (selectedSector) fetchReceipts();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [token, selectedSector, selectedSubSector]);
  useEffect(() => {
    fetchReceipts()
  }, [token])

  // Union list used for lookups/totals (covers create + edit)
  const lookupList = useMemo(() => {
    const byNo = new Map();
    for (const r of allReceipts) byNo.set(r.receipt_no, r);
    for (const r of (paymentData?.receipts ?? [])) byNo.set(r.receipt_no, r);
    return Array.from(byNo.values());
  }, [allReceipts, paymentData]);

  // Keep total in sync with selection + available data
  useEffect(() => {
    const amountMap = new Map(lookupList.map((r) => [r.receipt_no, Number(r.amount) || 0]));
    const total = selectedReceipts.reduce((sum, no) => sum + (amountMap.get(no) || 0), 0);
    setTotalSelectedAmount(total);
  }, [selectedReceipts, lookupList]);

  // Toggle a receipt by receipt_no
  const toggleReceipt = (receiptNo) => {
    setSelectedReceipts((prev) =>
      prev.includes(receiptNo) ? prev.filter((r) => r !== receiptNo) : [...prev, receiptNo]
    );
  };

  // Submit handler
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

    // Resolve IDs from union list
    const receiptIds = selectedReceipts
      .map((no) => lookupList.find((r) => r.receipt_no === no)?.id ?? null)
      .filter(Boolean);

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
      mode: "cash",
    };

    try {
      const url = paymentData
        ? `https://api.fmb52.com/api/payments/update/${paymentData.id}`
        : "https://api.fmb52.com/api/payments";

      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();

      if (resp.ok) {
        setSnackbar({ open: true, message: data.message || "Payment saved!", severity: "success" });

        // Reset after create; for edit you could keep values if preferred
        setSelectedReceipts([]);
        setDate("");
        setRemarks("");
        setYear("");
        setTotalSelectedAmount(0);

        await fetchReceipts(); // refresh available receipts
        fetchData && fetchData(); // refresh parent list
      } else {
        setSnackbar({ open: true, message: data.message || "Failed to save payment", severity: "error" });
      }
    } catch (e) {
      setSnackbar({ open: true, message: "Error submitting payment", severity: "error" });
    }
  };

  return (
    <AppTheme>
      <CssBaseline />
      <Box
        sx={{
          mt: 20, pt: 2, pb: 3, px: 3, mx: 2, mb: 1,
          backgroundColor: "#fff",
          border: "1px solid #F4EBD0",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, p: "8px 16px", borderRadius: 1 }}>
            {paymentData ? "Edit Payment" : "Add Payment"}
          </Typography>
          <Box>
            {/* <FormControl sx={{ minWidth: 150, mr: 2 }}>
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
            </FormControl> */}
            <IconButton
              onClick={() => setCollapsed((prev) => !prev)}
              sx={{ color: yellow[300], "&:hover": { color: yellow[400] } }}
            >
              {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </Box>
        </Box>

        {!collapsed && (
          <Box
            sx={{
              width: "calc(100% + 48px)",
              height: 15,
              backgroundImage: `url(${divider})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "contain",
              backgroundPosition: "center",
              ml: "-24px",
              mr: "-24px",
              mb: 2,
            }}
          />
        )}

        <Collapse in={!collapsed}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={3} alignItems="center" sx={{ pr: 5 }}>
              <Grid item xs={12} md={4}>
                <DatePicker
                  label="Date"
                  value={date ? dayjs(date) : null}
                  onChange={(nv) => {
                    if (nv?.isValid()) setDate(nv.format("YYYY-MM-DD"));
                  }}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        "& .MuiIconButton-root": { border: "none", p: 0, m: 0, backgroundColor: "transparent" },
                        "& .MuiOutlinedInput-root": { height: "52px", mb: "7px", border: `1px solid ${yellow[400]}` },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: yellow[400] },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: yellow[400] },
                      },
                      onClick: (e) => e.currentTarget.querySelector("button")?.click(),
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
                      py: "12px",
                      mb: "7px",
                      minHeight: "52px",
                      cursor: "pointer",
                      gap: 0.5,
                    }}
                    onClick={() => setDialogOpen(true)}
                    aria-haspopup="true"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter") setDialogOpen(true); }}
                  >
                    {selectedReceipts.length === 0 ? (
                      <Typography sx={{ color: "#aaa" }}>Click to select receipts</Typography>
                    ) : (
                      selectedReceipts.map((val) => (
                        <Chip
                          key={val}
                          label={val}
                          onDelete={() => toggleReceipt(val)} // keep totals in sync
                          deleteIcon={<CancelIcon />}
                          size="small"
                        />
                      ))
                    )}
                  </Box>
                </FormControl>

                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="lg">
                  <DialogTitle>Select Receipt No(s)</DialogTitle>
                  <Box
                    sx={{
                      width: "100%",
                      position: "relative",
                      height: "50vh",
                      backgroundImage: `url(${divider})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "repeat-x",
                      backgroundPosition: "center",
                    }}
                  />
                  <DialogContent>
                    <List>
                      {lookupList.map((r) => {
                        const isChecked = selectedReceipts.includes(r.receipt_no);
                        return (
                          <ListItem key={r.id} onClick={() => toggleReceipt(r.receipt_no)} dense>
                            <Checkbox edge="start" checked={isChecked} tabIndex={-1} disableRipple />
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                                alignItems: "center",
                                pr: 1,
                              }}
                            >
                              <Typography component="span" variant="body1" sx={{ fontWeight: "500" }}>
                                {r.receipt_no} - {r.name}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: "bold", minWidth: 80, textAlign: "right" }}>
                                ₹{Number(r.amount || 0).toFixed(2)}
                              </Typography>
                            </Box>
                          </ListItem>
                        );
                      })}
                    </List>
                  </DialogContent>
                  <DialogActions sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: yellow[400] }}>
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
                    sx: { height: "52px", mb: "7px", border: `1px solid ${yellow[400]}` },
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
                    sx: { height: "52px", mb: "7px", border: `1px solid ${yellow[400]}` },
                  }}
                />
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ color: "white", backgroundColor: yellow[300], "&:hover": { backgroundColor: yellow[200], color: "#000" } }}
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
