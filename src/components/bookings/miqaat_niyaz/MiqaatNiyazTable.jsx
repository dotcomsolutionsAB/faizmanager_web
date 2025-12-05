import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  CssBaseline,
  Menu,
  MenuItem,
  Tooltip,
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

const MiqaatNiyazTable = ({ data = [], refresh, showMsg, onEditRow }) => {
  const { currency } = useUser();

  const currencyCode = currency?.currency_code || "INR";
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode,
    }).format(value || 0);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [addReceiptOpen, setAddReceiptOpen] = useState(false);

  const handleActionsClick = (event, row) => {
    setSelectedRow(row);
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleDelete = async () => {
    handleMenuClose();
    const msg = `Deleted commitment for ${selectedRow?.name || "record"}`;
    showMsg?.(msg, "success");
    refresh?.();
  };

  const handleAddReceipt = () => {
    handleMenuClose();
    setAddReceiptOpen(true);
  };

  const handlePrintReceipt = () => {
    handleMenuClose();
    const msg = "Print Receipt action clicked (wire print URL here).";
    showMsg?.(msg, "info");
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
      field: 'date',
      headerName: 'Date',
      flex: 0.7,
      sortable: true,
      renderCell: (params) => {
        const d = params.row.date;
  let formatted = d ? d.split('-').reverse().join('-') : '';
  return(
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            // justifyContent: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              // fontWeight: 'bold',
              textAlign: 'center',
              color: brown[700],
            }}
          >
            {formatted}
          </Typography>
        </Box>
  )
      },
    },

    {
      field: "its",
      headerName: "ITS",
      flex: 0.7,
      renderCell: (params) => (
        <span style={{ color: brown[700] }}>{params.value}</span>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1.4,
      renderCell: (params) => (
        <span style={{ fontWeight: 700, color: brown[700],  whiteSpace: "normal",
        wordBreak: "break-word"}}>
          {params.value}
        </span>
      ),
    },
    {
      field: "mobile",
      headerName: "Mobile",
      flex: 0.9,
      renderCell: (params) => (
        <span style={{ color: brown[700] }}>{params.value}</span>
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1.2,
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
            fontSize: "18px",
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
            textAlign: "right",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            height: "100%",
            fontSize: "18px",
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
            textAlign: "right",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            height: "100%",
            fontSize: "18px",
          }}
        >
          {formatCurrency(params.row.amount_due)}
        </Typography>
      ),
    },
    {
      field: "remarks",
      headerName: "Remarks",
      flex: 0.9,
      renderCell: (params) => (
        <span style={{ color: brown[700],  whiteSpace: "normal",
        wordBreak: "break-word" }}>{params.value}</span>
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
          Miqaat Niyaz
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
                ? data.filter(
                    (row) => String(row.type).toLowerCase() === "miqaat_niyaz"
                  )
                : []
            }
            columns={columns}
            getRowId={(row) => row.id ?? `${row.its}-${row.date}-${row.type}`}
            rowHeight={100}
            pagination
            pageSizeOptions={[5, 10, 25]}
            
            sx={{
               "& .MuiDataGrid-cell": {
      whiteSpace: "normal !important",
      wordBreak: "break-word !important",
      lineHeight: "1.3 !important",
      display: "flex",
      alignItems: "center",
    },
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
        <MenuItem onClick={handlePrintReceipt}>
          <Tooltip title="Print Zabihat commitment receipt" placement="left">
            <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
              <PrintIcon sx={{ color: brown[200] }} />
              <Typography>Print Receipt</Typography>
            </Box>
          </Tooltip>
        </MenuItem>

        <MenuItem onClick={handleAddReceipt}>
          <Tooltip title="Add new receipt entry for this Zabihat" placement="left">
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

        <MenuItem onClick={handleDelete}>
          <Tooltip title="Delete this Zabihat commitment" placement="left">
            <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
              <DeleteIcon sx={{ color: brown[200] }} />
              <Typography>Delete</Typography>
            </Box>
          </Tooltip>
        </MenuItem>
      </Menu>

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

export default MiqaatNiyazTable;
