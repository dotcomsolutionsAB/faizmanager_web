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
import Autocomplete from "@mui/material/Autocomplete";
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

const SalawatFatehaForm = ({ onSaved, showMsg, editingRow, clearEditing }) => {
  const { token } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  const [its, setIts] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [type, setType] = useState("salwat"); // now editable
  const [date, setDate] = useState(null);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const isEditing = Boolean(editingRow?.id);

  // 🔁 Fetch all users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const res = await fetch("https://api.fmb52.com/api/all_users", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const data = await res.json();

        // Accept either plain array or {data: []}
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          setUsers([]);
        }
      } catch (e) {
        console.error("Error fetching users:", e);
        showMsg?.("Failed to load users list.", "error");
        setUsers([]);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // 🔁 Populate when editingRow changes
  useEffect(() => {
    if (editingRow) {
      setIts(
        editingRow.its !== undefined && editingRow.its !== null
          ? String(editingRow.its)
          : ""
      );
      setAmount(
        editingRow.amount !== undefined && editingRow.amount !== null
          ? String(editingRow.amount)
          : ""
      );
      setRemarks(editingRow.remarks || "");
      setDate(editingRow.date || null);
      setName(editingRow.name || "");
      setType(editingRow.type || "salwat"); // pick up type from row
    } else {
      setIts("");
      setName("");
      setAmount("");
      setRemarks("");
      setDate(null);
      setType("salwat"); // default
    }
  }, [editingRow]);

  // If editing row has ITS and we load users later, backfill name
  useEffect(() => {
    if (!editingRow?.its || !users.length) return;

    const found = users.find(
      (u) => u.its && String(u.its) === String(editingRow.its)
    );
    if (found) setName(found.name || "");
  }, [editingRow, users]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCollapseToggle = () => setCollapsed((prev) => !prev);

  // ITS <-> Name sync
  const handleItsChange = (value) => {
    setIts(value);

    if (!value) return;

    const found = users.find(
      (u) => u.its && String(u.its) === String(value)
    );
    if (found) {
      setName(found.name || "");
    }
  };

  const handleSubmit = async () => {
    // ITS optional; but amount + date required
    if (!amount || !date) {
      showMsg?.("Please fill all required fields (Amount & Date).", "warning");
      return;
    }

    try {
      const payload = {
        its: its || null, // nullable
        name: name,
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

      if (response.ok) {
        const msg = result.message || defaultSuccessMsg;

        showMsg?.(msg, "success");

        // Reset fields (keep selected type to speed multiple entries)
        setIts("");
        setName("");
        setAmount("");
        setRemarks("");
        setDate(null);

        onSaved?.();
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

  // Selected value for Autocomplete (match by both name & ITS when possible)
  const selectedUser =
    users.find(
      (u) =>
        u.name === name &&
        String(u.its ?? "") === String(its ?? "")
    ) ||
    users.find((u) => u.name === name) ||
    null;

  const typeLabel = type === "fateha" ? "Fateha" : "Salawat";

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
            {isEditing ? `Edit ${typeLabel}` : `Add ${typeLabel}`}
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
            {/* NAME AUTOCOMPLETE */}
            <Grid item xs={12} sm={6} md={6}>
              <Autocomplete
                options={users}
                loading={usersLoading}
                value={selectedUser}
                getOptionLabel={(option) => {
                  if (!option) return "";
                  const n = option.name || "";
                  const i = option.its ? ` (${option.its})` : "";
                  return `${n}${i}`;
                }}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setName(newValue.name || "");
                    setIts(newValue.its ? String(newValue.its) : "");
                  } else {
                    setName("");
                    setIts("");
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Name"
                    fullWidth
                    sx={{
                      "& .MuiIconButton-root": {
                        border: "none",
                        padding: 0,
                        margin: 0,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {/* ITS (optional, linked to name) */}
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                label="ITS Number (optional)"
                value={its}
                onChange={(e) => handleItsChange(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                required
              />
            </Grid>

            {/* TYPE DROPDOWN - now editable */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  label="Type"
                  onChange={(e) => setType(e.target.value)}
                >
                  <MenuItem value="salwat">Salawat</MenuItem>
                  <MenuItem value="fateha">Fateha</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
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

export default SalawatFatehaForm;
