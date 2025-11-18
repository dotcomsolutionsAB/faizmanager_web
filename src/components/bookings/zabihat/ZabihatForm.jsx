import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  CssBaseline,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { yellow } from "../../../styles/ThemePrimitives";
import AppTheme from "../../../styles/AppTheme";
import divider from "../../../assets/divider.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Collapse from "@mui/material/Collapse";
import { useUser } from "../../../contexts/UserContext";

const ZabihatForm = ({ refresh, showMsg, editingRow, clearEditing }) => {
  const { token } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  const [its, setIts] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [type] = useState("zabihat"); // fixed value
  const [date, setDate] = useState(null);

  // 🔁 Populate when editingRow changes
  useEffect(() => {
    if (editingRow) {
      setIts(editingRow.its || "");
      setAmount(
        editingRow.amount !== undefined && editingRow.amount !== null
          ? String(editingRow.amount)
          : ""
      );
      setRemarks(editingRow.remarks || "");
      setDate(editingRow.date || null);
    } else {
      setIts("");
      setAmount("");
      setRemarks("");
      setDate(null);
    }
  }, [editingRow]);

  const handleCollapseToggle = () => setCollapsed((prev) => !prev);
  const isEditing = Boolean(editingRow?.id);

const handleSubmit = async () => {
  if (!its || !amount || !date) {
    showMsg?.("Please fill all required fields.", "warning");
    return;
  }

  try {
    const payload = {
      its,
      amount: parseFloat(amount),
      remarks,
      type,
      date,
    };

    let url = "https://api.fmb52.com/api/commitment/create";
    let defaultSuccessMsg = "Commitment created successfully!";

    // UPDATE MODE
    if (editingRow?.id) {
      url = `https://api.fmb52.com/api/commitment/update/${editingRow.id}`;
      defaultSuccessMsg = "Commitment updated successfully!";
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result?.status) {
      const msg = result.message || defaultSuccessMsg;

      showMsg?.(msg, "success");

      // Reset form
      setIts("");
      setAmount("");
      setRemarks("");
      setDate(null);

      // Clear edit mode
      clearEditing?.();

      // Refresh table
      refresh?.();
    } else {
      showMsg?.(result.message || "Failed to save commitment.", "error");
    }
  } catch (err) {
    console.error("Error creating/updating commitment:", err);
    showMsg?.("An error occurred while submitting.", "error");
  }
};


  const handleCancelEdit = () => {
    clearEditing?.();
  };

  return (
    <AppTheme>
      <CssBaseline />
      <Box
        sx={{
          mt: 12,
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
            {isEditing ? "Edit Zabihat" : "Add Zabihat"}
          </Typography>
          <IconButton
            onClick={handleCollapseToggle}
            sx={{
              color: yellow[300],
              "&:hover": { color: yellow[400] },
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
              height: { xs: 10, sm: 15 },
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
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="ITS Number"
                value={its}
                onChange={(e) => setIts(e.target.value)}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth required disabled>
                <InputLabel>Type</InputLabel>
                <Select value={type} label="Type">
                  <MenuItem value="zabihat">Zabihat</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  value={date ? dayjs(date) : null}
                  onChange={(newValue) => {
                    if (newValue?.isValid()) {
                      setDate(newValue.format("YYYY-MM-DD"));
                    }
                  }}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        "& .MuiIconButton-root": {
                          border: "none",
                          padding: 0,
                          margin: 0,
                          backgroundColor: "transparent",
                        },
                      },
                      onClick: (e) => {
                        e.currentTarget.querySelector("button")?.click();
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                multiline
                rows={1}
                fullWidth
              />
            </Grid>
          </Grid>
        </Collapse>

        {/* Buttons */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
          {isEditing && (
            <Button variant="outlined" onClick={handleCancelEdit}>
              Cancel Edit
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{
              color: "white",
              backgroundColor: yellow[300],
              "&:hover": { backgroundColor: yellow[200], color: "#000" },
            }}
          >
            {isEditing ? "Update" : "Submit"}
          </Button>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default ZabihatForm;
