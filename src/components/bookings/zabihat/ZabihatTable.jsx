import React, { useState, useMemo } from "react";
import {
  Typography,
  Box,
  Button,
  CssBaseline,
  Menu,
  MenuItem,
  Tooltip,
  TextField,
} from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { yellow, brown } from "../../../styles/ThemePrimitives";
import AppTheme from "../../../styles/AppTheme";
import { useUser } from "../../../contexts/UserContext";
import divider from "../../../assets/divider.png";
import AddBookingsReceipt from "../AddBookingsReceipt";
import PrintIcon from "@mui/icons-material/Print";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteBookings from "../DeleteBookings"; // ⬅️ new import (adjust path)
import { formatDateToDDMMYYYY } from "../../../util";

const ZabihatTable = ({ data = [], refresh, showMsg, onEditRow }) => {
  const { currency, token } = useUser(); // ⬅️ token for API (if available)

  const currencyCode = currency?.currency_code || "INR";
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode,
    }).format(value || 0);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [addReceiptOpen, setAddReceiptOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);      // ⬅️ dialog open
  const [deleteLoading, setDeleteLoading] = useState(false); // ⬅️ deleting?

  const handleActionsClick = (event, row) => {
    setSelectedRow(row);
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  // open dialog when Delete is clicked from menu
  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteOpen(true);
  };

  // actually call API when user confirms delete in dialog
  const handleConfirmDelete = async () => {
    if (!selectedRow) return;

    try {
      setDeleteLoading(true);

      const res = await fetch(`https://api.fmb52.com/api/commitment/delete/${selectedRow.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.message || "Failed to delete commitment");
      }

      showMsg?.(
        json?.message ||
          `Commitment deleted successfully for ${selectedRow.name || "record"}`,
        "success"
      );

      setDeleteOpen(false);
      refresh?.();
    } catch (err) {
      console.error(err);
      showMsg?.(
        err.message || "An error occurred while deleting commitment.",
        "error"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddReceipt = () => {
    handleMenuClose();
    setAddReceiptOpen(true);
  };

  // Handle printing single or multiple receipts
  // receiptIds can be a single ID, array of IDs, or comma-separated string
  const handlePrintReceipts = (receiptIds) => {
    if (!receiptIds) return;
    
    // Normalize receiptIds to comma-separated string
    let receiptIdsStr = '';
    if (Array.isArray(receiptIds)) {
      receiptIdsStr = receiptIds.join(',');
    } else if (typeof receiptIds === 'string' && receiptIds.includes(',')) {
      receiptIdsStr = receiptIds;
    } else {
      receiptIdsStr = String(receiptIds);
    }
    
    if (!receiptIdsStr) return;
    
    // Open print URL in new tab - supports multiple receipts in multiple pages
    const printUrl = `https://api.fmb52.com/api/commitment_receipt_print/${receiptIdsStr}`;
    window.open(printUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePrintReceipt = () => {
    handleMenuClose();
    if (!selectedRow) return;

    // Check if receipts object exists and has values
    const receipts = selectedRow.receipts;
    if (!receipts || (Array.isArray(receipts) && receipts.length === 0) || (typeof receipts === 'object' && Object.keys(receipts).length === 0)) {
      return;
    }

    // Extract receipt IDs from receipts array/object
    let receiptIds = [];
    if (Array.isArray(receipts)) {
      receiptIds = receipts.map(receipt => receipt.id || receipt).filter(id => id != null);
    } else if (typeof receipts === 'object') {
      // If it's an object, try to get IDs from values
      receiptIds = Object.values(receipts)
        .map(receipt => (receipt && receipt.id) ? receipt.id : receipt)
        .filter(id => id != null);
    }

    if (receiptIds.length > 0) {
      handlePrintReceipts(receiptIds);
    }
  };

  const handleEditCommitment = () => {
    handleMenuClose();
    if (onEditRow && selectedRow) {
      onEditRow(selectedRow);
      const msg = `Editing commitment for ${selectedRow?.name || "record"}`;
      showMsg?.(msg, "info");
    }
  };

  const columns = [
    {
      field: "date",
      headerName: "Date",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <span style={{ color: brown[700], fontSize: "0.875rem" }}>{formatDateToDDMMYYYY(params.value)}</span>
      ),
    },
    {
      field: "its",
      headerName: "ITS",
      flex: 0.8,
      minWidth: 90,
      renderCell: (params) => (
        <span style={{ color: brown[700], fontSize: "0.875rem" }}>{params.value || ""}</span>
      ),
    },
{
  field: "name",
  headerName: "Name",
  flex: 1.5,
  minWidth: 180,
  renderCell: (params) => (
    <Box
      sx={{
        fontWeight: 700,
        color: brown[700],
        whiteSpace: "normal",
        wordBreak: "break-word",
        lineHeight: 1.3,
        display: "flex",
        alignItems: "center",
        height: "100%",
        width: "100%",
        px: 1,
        py: 0.5,
      }}
    >
      {params.value || ""}
    </Box>
  ),
},

    {
      field: "mobile",
      headerName: "Mobile",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Box
          sx={{
            color: brown[700],
            fontSize: "0.875rem",
            whiteSpace: "nowrap",
            overflow: "visible",
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {params.value || ""}
        </Box>
      ),
    },

    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            color: brown[700],
            textAlign: "right",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            height: "100%",
            fontSize: "15px",
            fontWeight: 500,
          }}
        >
          {formatCurrency(params.row.amount)}
        </Typography>
      ),
    },
    {
      field: "amount_paid",
      headerName: "Paid",
      flex: 0.9,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            color: brown[700],
            textAlign: "right",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            height: "100%",
            fontSize: "15px",
            fontWeight: 500,
          }}
        >
          {formatCurrency(params.row.amount_paid)}
        </Typography>
      ),
    },
    {
      field: "amount_due",
      headerName: "Due",
      flex: 0.9,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            color: brown[700],
            textAlign: "right",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            height: "100%",
            fontSize: "15px",
            fontWeight: 500,
          }}
        >
          {formatCurrency(params.row.amount_due)}
        </Typography>
      ),
    },
{
  field: "remarks",
  headerName: "Remarks",
  flex: 1.2,
  minWidth: 150,
  renderCell: (params) => {
    const remarks = params.value || "";
    return (
      <Tooltip 
        title={remarks} 
        arrow
        placement="top"
        enterDelay={300}
        PopperProps={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -8],
              },
            },
          ],
        }}
      >
        <Box
          sx={{
            color: brown[700],
            wordBreak: "break-word",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
            px: 1,
            py: 0.5,
            cursor: remarks.length > 100 ? "pointer" : "default",
          }}
        >
          {remarks}
        </Box>
      </Tooltip>
    );
  },
},

    {
      field: "created_by",
      headerName: "Created by",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <span style={{ color: brown[700], fontSize: "0.875rem" }}>{params.value || ""}</span>
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              p: "8px 16px",
              borderRadius: 1,
            }}
          >
            Zabihat
          </Typography>

          <TextField
            label="Search"
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="small"
            sx={{
              width: { xs: "100%", sm: "300px" },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
              },
            }}
          />
        </Box>

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
            rows={useMemo(() => {
              const filteredByType = Array.isArray(data)
                ? data.filter(
                    (row) => String(row.type).toLowerCase() === "zabihat"
                  )
                : [];

              if (!searchText.trim()) {
                return filteredByType;
              }

              const searchLower = searchText.toLowerCase();
              return filteredByType.filter((row) => {
                return (
                  String(row.name || "").toLowerCase().includes(searchLower) ||
                  String(row.its || "").toLowerCase().includes(searchLower) ||
                  String(row.mobile || "").toLowerCase().includes(searchLower) ||
                  String(row.remarks || "").toLowerCase().includes(searchLower) ||
                  String(row.created_by || "").toLowerCase().includes(searchLower) ||
                  formatDateToDDMMYYYY(row.date).toLowerCase().includes(searchLower) ||
                  String(row.amount || "").includes(searchText) ||
                  String(row.amount_paid || "").includes(searchText) ||
                  String(row.amount_due || "").includes(searchText)
                );
              });
            }, [data, searchText])}
            columns={columns}
            getRowId={(row) => row.id ?? `${row.its}-${row.date}-${row.type}`}
            rowHeight={65}
            checkboxSelection
            pagination
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-cell": {
                py: 0.5,
                fontSize: "0.875rem",
              },
              "& .MuiDataGrid-cell[data-field='mobile']": {
                overflow: "visible",
                textOverflow: "clip",
              },
              "& .MuiDataGrid-cell:hover": { backgroundColor: yellow[200] },
              "& .MuiDataGrid-row:hover": { backgroundColor: yellow[100] },
              "& .MuiDataGrid-columnHeaderTitle": { 
                color: yellow[400],
                fontWeight: 600,
                fontSize: "0.9rem",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                borderBottom: `2px solid ${yellow[400]}`,
              },
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
        {selectedRow?.receipts && 
         ((Array.isArray(selectedRow.receipts) && selectedRow.receipts.length > 0) || 
          (typeof selectedRow.receipts === 'object' && Object.keys(selectedRow.receipts).length > 0)) && (
          <MenuItem onClick={handlePrintReceipt}>
            <Tooltip title="Print Zabihat commitment receipt" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                <PrintIcon sx={{ color: brown[200] }} />
                <Typography>Print Receipt</Typography>
              </Box>
            </Tooltip>
          </MenuItem>
        )}

        <MenuItem onClick={handleAddReceipt}>
          <Tooltip
            title="Add new receipt entry for this Zabihat"
            placement="left"
          >
            <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
              <ReceiptLongIcon sx={{ color: brown[200] }} />
              <Typography>Add Receipt</Typography>
            </Box>
          </Tooltip>
        </MenuItem>

        <MenuItem onClick={handleEditCommitment}>
          <Tooltip title="Edit Zabihat commitment details" placement="left">
            <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
              <EditIcon sx={{ color: brown[200] }} />
              <Typography>Edit</Typography>
            </Box>
          </Tooltip>
        </MenuItem>

        <MenuItem onClick={handleDeleteClick}>
          <Tooltip title="Delete this Zabihat commitment" placement="left">
            <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
              <DeleteIcon sx={{ color: brown[200] }} />
              <Typography>Delete</Typography>
            </Box>
          </Tooltip>
        </MenuItem>
      </Menu>

      {/* Delete confirmation dialog */}
      <DeleteBookings
        open={deleteOpen}
        loading={deleteLoading}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Zabihat"
        description={`Are you sure you want to delete this zabihat${
          selectedRow?.name ? ` for ${selectedRow.name}` : ""
        }?.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />

      <AddBookingsReceipt
        open={addReceiptOpen}
        onClose={() => setAddReceiptOpen(false)}
        row={selectedRow}
        onSuccess={() => {
          refresh?.();
        }}
      />
    </AppTheme>
  );
};

export default ZabihatTable;
