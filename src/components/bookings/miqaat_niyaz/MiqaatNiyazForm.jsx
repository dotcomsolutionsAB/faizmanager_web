import React, { useState, useEffect, useMemo } from "react";
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
  Collapse,
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
import { useUser } from "../../../contexts/UserContext";

const MiqaatNiyazForm = ({ onSaved, showMsg, editingRow, clearEditing }) => {
  const { token } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  const [its, setIts] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");

 
  const [type] = useState("miqaat_niyaz");

  // date stored as "YYYY-MM-DD" string (or null)
  const [date, setDate] = useState(null);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const isEditing = Boolean(editingRow?.id);

  const handleCollapseToggle = () => setCollapsed((prev) => !prev);

  // ✅ Clean name helper (removes trailing " (20364301)" if present)
  const cleanPersonName = (val) => {
    if (!val) return "";
    return String(val).replace(/\s*\(\d+\)\s*$/g, "").trim();
  };

  // 🔁 Fetch all users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const res = await fetch("https://api.fmb52.com/api/all_users", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const text = await res.text();
        let data = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = null;
        }

        if (Array.isArray(data)) setUsers(data);
        else if (Array.isArray(data?.data)) setUsers(data.data);
        else setUsers([]);
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

      // ✅ keep what backend has, but store as clean name for input
      setName(cleanPersonName(editingRow.name || ""));

      setAmount(
        editingRow.amount !== undefined && editingRow.amount !== null
          ? String(editingRow.amount)
          : ""
      );

      setRemarks(editingRow.remarks || "");

      // ✅ normalize date to "YYYY-MM-DD" if possible
      const d = editingRow.date ? dayjs(editingRow.date) : null;
      setDate(d && d.isValid() ? d.format("YYYY-MM-DD") : null);
    } else {
      setIts("");
      setName("");
      setAmount("");
      setRemarks("");
      setDate(null);
    }
  }, [editingRow]);

  // If editing row has ITS and we load users later, backfill name (clean)
  useEffect(() => {
    if (!editingRow?.its || !users.length) return;
    const found = users.find(
      (u) => u?.its && String(u.its) === String(editingRow.its)
    );
    if (found?.name) setName(cleanPersonName(found.name));
  }, [editingRow, users]); // eslint-disable-line react-hooks/exhaustive-deps

  // ITS <-> Name sync (ITS field manually typed)
  const handleItsChange = (value) => {
    setIts(value);

    if (!value) return;

    const found = users.find((u) => u?.its && String(u.its) === String(value));
    if (found) setName(cleanPersonName(found.name || ""));
  };

  // Selected value for Autocomplete (match by ITS when possible)
  const selectedUser = useMemo(() => {
    const byIts =
      users.find((u) => String(u?.its ?? "") === String(its ?? "")) || null;
    if (byIts) return byIts;

    const byName =
      users.find(
        (u) =>
          cleanPersonName(u?.name || "").toLowerCase() ===
          cleanPersonName(name || "").toLowerCase()
      ) || null;

    return byName;
  }, [users, its, name]);

  const handleSubmit = async () => {
    if (!amount || !date) {
      showMsg?.("Please fill all required fields (Amount & Date).", "warning");
      return;
    }

    try {
      // ✅ Always send clean name (no "(ITS)" suffix)
      const payload = {
        its: its ? String(its) : null, // nullable
        name: cleanPersonName(name || ""),
        amount: Number(amount),
        remarks: remarks || "",
        type, 
        date, // "YYYY-MM-DD"
      };

      let url = "https://api.fmb52.com/api/commitment/create";
      let defaultSuccessMsg = "Commitment created successfully!";

      if (editingRow?.id) {
        url = `https://api.fmb52.com/api/commitment/update/${editingRow.id}`;
        defaultSuccessMsg = "Commitment updated successfully!";
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json", // ✅ makes Laravel return JSON errors instead of HTML
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      // ✅ SAFE parse (prevents "Unexpected token <" crash)
      const raw = await response.text();
      const ct = response.headers.get("content-type") || "";
      let result = null;

      if (ct.includes("application/json")) {
        try {
          result = raw ? JSON.parse(raw) : null;
        } catch {
          result = null;
        }
      }

      if (response.ok) {
        showMsg?.(result?.message || defaultSuccessMsg, "success");

        // Reset form
        setIts("");
        setName("");
        setAmount("");
        setRemarks("");
        setDate(null);

        clearEditing?.();
        onSaved?.();
      } else {
        // show backend error message if JSON, else show first part of HTML/text
        const fallbackMsg =
          result?.message ||
          (raw ? raw.slice(0, 200) : "") ||
          "Failed to save commitment.";
        showMsg?.(fallbackMsg, "error");

        console.error("Commitment API error:", {
          status: response.status,
          url,
          contentType: ct,
          rawPreview: raw?.slice(0, 400),
          payload,
        });
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
            {isEditing ? "Edit Miqaat Niyaz" : "Add Miqaat Niyaz"}
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
                freeSolo
                options={users}
                loading={usersLoading}
                value={selectedUser}
                inputValue={name}
                getOptionLabel={(option) => {
                  if (!option) return "";
                  if (typeof option === "string") return option;
                  const n = cleanPersonName(option.name || "");
                  const i = option.its ? ` (${option.its})` : "";
                  return `${n}${i}`; // display only
                }}
                onInputChange={(event, newInputValue) => {
                  setName(newInputValue);

                  // If typed name matches someone, auto-set ITS
                  const found = users.find(
                    (u) =>
                      u?.name &&
                      cleanPersonName(u.name).toLowerCase() ===
                        cleanPersonName(newInputValue).toLowerCase()
                  );

                  if (found) {
                    setIts(found.its ? String(found.its) : "");
                    // also keep name clean (no "(ITS)")
                    setName(cleanPersonName(found.name || ""));
                  }
                }}
                onChange={(event, newValue) => {
                  if (!newValue) {
                    setName("");
                    setIts("");
                    return;
                  }

                  if (typeof newValue === "string") {
                    // typed free text
                    setName(cleanPersonName(newValue));
                    return;
                  }

                  // selected from list
                  setName(cleanPersonName(newValue.name || ""));
                  setIts(newValue.its ? String(newValue.its) : "");
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

            {/* ITS */}
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

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth required disabled>
                <InputLabel>Type</InputLabel>
                <Select value={type} label="Type">
                  <MenuItem value="miqaat_niyaz">Miqaat Niyaz</MenuItem>
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
                    } else if (newValue === null) {
                      setDate(null);
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
                      // ✅ click anywhere opens picker (like your other DatePicker)
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

export default MiqaatNiyazForm;
