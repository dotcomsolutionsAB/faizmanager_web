import React, { useState } from "react";
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
import { useUser } from "../../../UserContext";
import { useOutletContext, useLocation } from "react-router-dom";

const ExpensesForm = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = useUser();
  const { selectedYear } = useOutletContext();

  // States for form fields
  const [name, setName] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [amount, setAmount] = useState("");
  const [chequeNo, setChequeNo] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);

  // Snackbar state variables
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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

    const formData = new FormData();
    formData.append("year", selectedYear);
    formData.append("name", name);
    formData.append("date", date);
    formData.append("amount", amount);
    formData.append("cheque_no", chequeNo);
    formData.append("description", description);
    if (attachment) {
      formData.append("attachment", attachment);
    } else {
      formData.append("attachment", null);
    }

    try {
      const response = await fetch("https://api.fmb52.com/api/expense", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        setSnackbarMessage(data.message || "Expense created successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        // Optionally reset form here:
        setName("");
        setAmount("");
        setChequeNo("");
        setDescription("");
        setAttachment(null);
        setDate(() => {
          const today = new Date();
          const yyyy = today.getFullYear();
          const mm = String(today.getMonth() + 1).padStart(2, "0");
          const dd = String(today.getDate()).padStart(2, "0");
          return `${yyyy}-${mm}-${dd}`;
        });
      } else {
        setSnackbarMessage(data.message || "Failed to create expense");
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
      <Box
        sx={{
          mt: 20,
          pt: 2,
          pb: 3,
          pl: 3,
          pr: 3,
          mr: 2,
          ml: 2,
          mb: 1,
          backgroundColor: "#fff",
          border: "1px solid #F4EBD0",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              marginBottom: 1,
              padding: "8px 16px",
              borderRadius: 1,
            }}
          >
            Add Expense
          </Typography>
          {/* Collapse Icon */}
          <IconButton
            onClick={handleCollapseToggle}
            sx={{
              color: yellow[300],
              "&:hover": {
                color: yellow[400],
              },
            }}
          >
            {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        </Box>
        {!collapsed && (
          <Box
            sx={{
              width: "calc(100% + 48px)",
              position: "relative",
              height: {
                xs: 10,
                sm: 15,
                md: 15,
                lg: 15,
                xl: 15,
              },
              backgroundImage: `url(${divider})`,
              backgroundSize: "contain",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center",
              mb: 2,
              marginLeft: "-24px",
              marginRight: "-24px",
            }}
          />
        )}
        <Collapse in={!collapsed}>
          <Grid container spacing={3} alignItems="center" sx={{ pr: 5 }}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Paid To"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Cheque No."
                value={chequeNo}
                onChange={(e) => setChequeNo(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={1}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <input
                accept="image/*"
                type="file"
                style={{ marginTop: "16px" }}
                onChange={(e) => setAttachment(e.target.files[0])}
              />
            </Grid>

            <Grid item xs={12} sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{
                  color: "white",
                  backgroundColor: yellow[300],
                  "&:hover": {
                    backgroundColor: yellow[200],
                    color: "#000",
                  },
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Collapse>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        sx={{ height: "100%" }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
          action={
            <Button color="inherit" size="small" onClick={handleSnackbarClose}>
              OK
            </Button>
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AppTheme>
  );
};

export default ExpensesForm;
