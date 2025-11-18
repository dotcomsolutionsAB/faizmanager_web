import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  CssBaseline,
  Paper,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import AppTheme from "../../styles/AppTheme";

import { useUser } from "../../contexts/UserContext";
import { useOutletContext } from "react-router-dom";

import ZabihatForm from "../../components/bookings/zabihat/ZabihatForm";
import ZabihatTable from "../../components/bookings/zabihat/ZabihatTable";

const Zabihat = () => {
  const { token } = useUser();
  const { selectedYear } = useOutletContext() || {};

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // 🔁 which commitment is being edited
  const [editingCommitment, setEditingCommitment] = useState(null);

  const showMsg = (msg, severity = "info") => {
    setSnackbarMsg(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    document.title = "Zabihat - FMB 52";
  }, []);

  const fetchCommitments = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await fetch(
        `https://api.fmb52.com/api/commitment/retrieve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
      }

      const json = await resp.json();
      setRows(Array.isArray(json?.data) ? json.data : []);
      if (!json?.status) {
        showMsg(json?.message || "Failed to fetch commitments.", "warning");
      }
    } catch (err) {
      console.error("Commitments retrieve error:", err);
      showMsg("Error fetching commitments.", "error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [token, selectedYear]);

  useEffect(() => {
    fetchCommitments();
  }, [fetchCommitments]);

  return (
    <AppTheme>
      <CssBaseline />

      {/* Form: pass refresh + showMsg + editing state */}
      <ZabihatForm
        refresh={fetchCommitments}
        showMsg={showMsg}
        editingRow={editingCommitment}
        clearEditing={() => setEditingCommitment(null)}
      />

      {/* Table: pass data + refresh + showMsg + edit handler */}
      <ZabihatTable
        data={rows}
        refresh={fetchCommitments}
        showMsg={showMsg}
        onEditRow={(row) => setEditingCommitment(row)}
      />

      <Backdrop
        sx={{ color: "#fff", zIndex: (t) => t.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </AppTheme>
  );
};

export default Zabihat;
