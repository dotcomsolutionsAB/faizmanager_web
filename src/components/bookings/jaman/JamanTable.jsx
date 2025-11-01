import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  CssBaseline,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
} from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { yellow, brown } from "../../../styles/ThemePrimitives";
import AppTheme from "../../../styles/AppTheme";
import { useUser } from "../../../contexts/UserContext";
import divider from "../../../assets/divider.png";

const inr = (val) => {
  const num = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(num)) return val ?? "";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(num);
};

const JamanTable = ({ data = [], refresh, showMsg }) => {
  const { token, currency } = useUser();

    // Format currency helper
  const currencyCode = currency?.currency_code || 'INR';
  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
    }).format(value || 0);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleSnackbarClose = () => setSnackbar((s) => ({ ...s, open: false }));

  const handleActionsClick = (event, row) => {
    setSelectedRow(row);
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  // TODO: wire to your delete API when available
  const handleDelete = async () => {
    handleMenuClose();
    // await fetch(`${BASE_URL}/commitment/delete/${selectedRow.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    const msg = `Deleted commitment for ${selectedRow?.name || "record"}`;
    setSnackbar({ open: true, message: msg, severity: "success" });
    showMsg?.(msg, "success");
    refresh?.();
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1.4,
      renderCell: (params) => (
        <span style={{ fontWeight: 700, color: brown[700] }}>{params.value}</span>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.9,
      renderCell: (params) => <span style={{ color: brown[700] }}>{params.value}</span>,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0.8,
      renderCell: (params) => (
        <span style={{ color: brown[700], textTransform: "capitalize" }}>{params.value}</span>
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.9,
      renderCell: (params) => (
              <Typography
                variant="body2"
                sx={{
                  color: brown[700],
                  textAlign: 'right',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  height: '100%',
                  fontSize: '18px',
                }}
              >
                {formatCurrency(params.row.amount)}
              </Typography>
            ),
    },
    {
      field: "amount_paid",
      headerName: "Paid",
      flex: 0.8,
      renderCell: (params) => (
              <Typography
                variant="body2"
                sx={{
                  color: brown[700],
                  textAlign: 'right',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  height: '100%',
                  fontSize: '18px',
                }}
              >
                {formatCurrency(params.row.amount_paid)}
              </Typography>
            ),
    },
    {
      field: "amount_due",
      headerName: "Due",
      flex: 0.8,
      renderCell: (params) => (
              <Typography
                variant="body2"
                sx={{
                  color: brown[700],
                  textAlign: 'right',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  height: '100%',
                  fontSize: '18px',
                }}
              >
                {formatCurrency(params.row.amount_due)}
              </Typography>
            ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={(event) => handleActionsClick(event, params.row)}
          sx={{
            backgroundColor: yellow[400],
            "&:hover": { backgroundColor: yellow[100], color: "#000" },
          }}
        >
          Actions
        </Button>
      ),
    },
  ];

  return (
    <AppTheme>
      <CssBaseline />
      <Box
        sx={{
          mt: 2,
          pt: 2,
          pb: 3,
          pl: 3,
          pr: 3,
          mr: 2,
          ml: 2,
          mb: 3,
          backgroundColor: "#fff",
          border: "1px solid #F4EBD0",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            mb: 1,
            p: "8px 16px",
            borderRadius: 1,
          }}
        >
          Jaman
        </Typography>

        <Box
          sx={{
            width: "calc(100% + 48px)",
            position: "relative",
            height: { xs: 10, sm: 15, md: 15, lg: 15, xl: 15 },
            backgroundImage: `url(${divider})`,
            backgroundSize: "contain",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "center",
            mb: 2,
            ml: "-24px",
            mr: "-24px",
          }}
        />

        <Box sx={{ width: "100%", height: 500 }}>
  <DataGridPro
    rows={
      Array.isArray(data)
        ? data.filter((row) => String(row.type).toLowerCase() === "jaman")
        : []
    }
    columns={columns}
    getRowId={(row) => row.id ?? `${row.its}-${row.date}-${row.type}`}
    rowHeight={100}
    checkboxSelection
    pagination
    pageSizeOptions={[5, 10, 25]}
    sx={{
      "& .MuiDataGrid-cell:hover": { backgroundColor: yellow[200] },
      "& .MuiDataGrid-row:hover": { backgroundColor: yellow[100] },
      "& .MuiDataGrid-columnHeaderTitle": { color: yellow[400] },
    }}
  />
</Box>

      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppTheme>
  );
};

export default JamanTable;
