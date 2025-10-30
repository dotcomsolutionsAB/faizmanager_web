import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Button,
  CssBaseline,
  Snackbar,
  Alert,
  Tooltip,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { yellow, brown } from '../../styles/ThemePrimitives';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';

import AppTheme from '../../styles/AppTheme';
import CancelReceiptDialog from '../../components/accounts/receipts/CancelReceiptDialog';
import EditReceiptDialog from '../../components/accounts/receipts/EditReceiptDialog';

const customLocaleText = {
  noRowsLabel: 'Please wait....',
  noResultsOverlayLabel: '',
};

function Receipts() {
  const { selectedSector, selectedSubSector, selectedYear, selectedSectorName, selectedSubSectorName } = useOutletContext();
  const [loadingData, setLoadingData] = useState(false);
  const [modeFilter, setModeFilter] = useState('All');

  const { token, loading, accessRoleId } = useUser();
  const [rows, setRows] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [sortModel, setSortModel] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const navigate = useNavigate();

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editReceipt, setEditReceipt] = useState(null);

  // Export filtered rows to Excel
  const exportToExcel = () => {
    if (!filteredRows.length) {
      alert('No data to export.');
      return;
    }
    const exportData = filteredRows.map((row) => ({
      Name: row.name,
      ITS: row.its,
      Mobile: row.mobile,
      'Folio No': row.folio_no,
      Sector: row.sector_name,
      'Sub Sector': row.sub_sector_name,
      Mode: row.mode,
      Date: row.date,
      Year: row.year,
      Comments: row.comments,
      Amount: row.amount,
      ReceiptNo: row.receipt_no,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Receipts');
    XLSX.writeFile(workbook, `Receipts_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Button-with-menu inside Action column
  const ActionButtonWithOptions = ({ row, onEdit }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const open = Boolean(anchorEl);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handlePrintClick = () => {
      const printUrl = `https://api.fmb52.com/api/receipt_print/${row.hashed_id}`;
      window.open(printUrl, '_blank');
      handleClose();
    };

    const handleCancelClick = () => {
      setOpenCancelDialog(true);
      handleClose();
    };

    const handleConfirmCancel = (id) => {
      // TODO: integrate cancel API
      console.log('Cancel confirmed for receipt ID:', id);
    };

    useEffect(() => {
      document.title = 'Receipts - FMB 52';
    }, []);

    return (
      <Box>
        <Button variant="contained" color="primary" onClick={handleClick}>
          Actions
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <MenuItem onClick={handlePrintClick}>
            <Tooltip title="View/Print Receipt" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                <LocalPrintshopIcon sx={{ color: brown[200] }} />
                Print
              </Box>
            </Tooltip>
          </MenuItem>

          <MenuItem
            onClick={() => {
              onEdit?.(row);
              handleClose();
            }}
          >
            <Tooltip title="Edit" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                <EditIcon sx={{ color: brown[200] }} />
                Edit
              </Box>
            </Tooltip>
          </MenuItem>

          <MenuItem onClick={handleCancelClick}>
            <Tooltip title="Cancel" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                <CancelIcon sx={{ color: brown[200] }} />
                Cancel
              </Box>
            </Tooltip>
          </MenuItem>
        </Menu>

        <CancelReceiptDialog
          open={openCancelDialog}
          onClose={() => setOpenCancelDialog(false)}
          receiptId={row.id}
          onConfirm={handleConfirmCancel}
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarSeverity={setSnackbarSeverity}
        />
      </Box>
    );
  };

  // Columns
  const columns = [
    {
      field: 'mumeneen_info',
      headerName: 'Mumeneen Info',
      width: 570,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
            }}
          >
            <img
              src={params.row.photo_url ? params.row.photo_url : '/static/images/avatar-placeholder.png'}
              alt="User Photo"
              style={{
                width: 80,
                height: 90,
                border: '2px solid #ddd',
                borderRadius: '8px',
                objectFit: 'cover',
              }}
            />
          </div>

          <Box sx={{ display: 'flex', flexDirection: 'column', paddingTop: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Name:{' '}
              <Link
                to={`/mumeneen/${params.row.family_id}`}
                style={{ color: yellow[400], textDecoration: 'none' }}
                onMouseEnter={(e) => (e.target.style.color = brown[700])}
                onMouseLeave={(e) => (e.target.style.color = yellow[400])}
              >
                {params.row.name}
              </Link>
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              ITS: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.its}</span>
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Mobile: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.mobile}</span>
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Folio No: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.folio_no}</span>
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Sector:{' '}
              <span style={{ fontWeight: 'normal', color: brown[700] }}>
                {params.row.sector_name}-{params.row.sub_sector_name}
              </span>
            </Typography>
          </Box>
        </Box>
      ),
    },
   {
  field: 'receipt_no',
  headerName: 'Receipt No',
  width: 170,
  sortable: true,
  renderCell: (params) => {
    const status = String(params.row.status || '').toLowerCase(); // e.g. "cancelled"
    const isCancelled = status === 'cancelled' || status === 'canceled'; // handle both spellings

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            color: brown[700],
            textDecoration: isCancelled ? 'line-through' : 'none',
            opacity: isCancelled ? 0.7 : 1,
            fontWeight: 600,
          }}
          title={isCancelled ? 'This receipt is cancelled' : ''}
        >
          {params.row.receipt_no}
        </Typography>

        {isCancelled && (
          <Typography
            variant="caption"
            sx={{ mt: 0.5, color: '#d32f2f', fontWeight: 700, letterSpacing: 0.3 }}
          >
            {params.row.status} {/* shows whatever the API sent, e.g. "cancelled" */}
          </Typography>
        )}
      </Box>
    );
  },
},
    {
      field: 'receipt',
      headerName: 'Receipt Details',
      width: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', paddingTop: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Mode: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.mode}</span>
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Date: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.date}</span>
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Year: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.year}</span>
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Comments: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.comments}</span>
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 180,
      sortable: true,
      renderCell: (params) => {
        const formattedAmount = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
        }).format(params.row.amount);

        return (
          <Typography
            variant="body2"
            sx={{
              color: '#388e3c',
              textAlign: 'right',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              height: '100%',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            {formattedAmount}
          </Typography>
        );
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 170,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <ActionButtonWithOptions
            row={params.row}
            onEdit={(row) => {
              setEditReceipt(row);
              setEditOpen(true);
            }}
          />
        </Box>
      ),
    },
  ];


  // Fetch data
  useEffect(() => {
    if (loading || !token || !selectedYear?.length) return;

    const fetchData = async () => {
      try {
        setLoadingData(true);

        const response = await fetch('https://api.fmb52.com/api/receipts/all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ year: selectedYear, role_id: accessRoleId }),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setRows(data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [token, loading, selectedYear]);

  // Filtered rows
  const filteredRows = rows.filter((row) => {
    const t = filterText.toLowerCase();
    const matchesFilterText =
      row.name?.toLowerCase().includes(t) ||
      row.its?.toLowerCase().includes(t) ||
      row.mobile?.toLowerCase().includes(t) ||
      row.folio_no?.toLowerCase().includes(t) ||
      row.sector_name?.toLowerCase().includes(t) ||
      row.sub_sector_name?.toLowerCase().includes(t) ||
      row.hof_its?.toLowerCase().includes(t)
 

    const matchesMode = modeFilter === 'All' || row.mode?.toLowerCase() === modeFilter.toLowerCase();

    const matchesSector =
      !selectedSectorName?.length ||
      selectedSectorName.map((s) => s.toLowerCase()).includes(row.sector_name?.toLowerCase());

    // const matchesSubSector =
    //   !selectedSubSectorName?.length ||
    //   selectedSubSectorName.map((s) => s.toLowerCase()).includes(row.sub_sector_name?.toLowerCase());

    return matchesFilterText && matchesMode && matchesSector;
  });

  // After successful save from dialog, update the grid row
  const handleReceiptSaved = (updated) => {
    setRows((prev) =>
      prev.map((r) =>
        (updated.id && r.id === updated.id) || (updated.hashed_id && r.hashed_id === updated.hashed_id)
          ? { ...r, ...updated }
          : r
      )
    );
  };

  console.log("Edit",editReceipt)


  return (
    <AppTheme>
      <CssBaseline />
      <div
        style={{
          filter: snackbarOpen ? 'blur(5px)' : 'none',
          transition: 'filter 0.3s ease',
          pointerEvents: snackbarOpen ? 'none' : 'auto',
          userSelect: snackbarOpen ? 'none' : 'auto',
          marginTop: '95px',
        }}
      >
        <Box sx={{ width: '100%', overflowX: 'auto',  pr: 2, pb: 3, pl: 2 }}>
          <Paper
            sx={{
              width: '100%',
              boxShadow: 1,
              overflowX: 'auto',
              p: 1,
              '@media (max-width: 600px)': { p: 1 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <TextField
                label="Search"
                variant="outlined"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                sx={{ width: { xs: '100%', sm: '300px' } }}
                InputProps={{
                  sx: { height: '52px', display: 'flex', alignItems: 'center', mb: '7px' },
                }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControl sx={{ minWidth: 150, width: { xs: '100%', sm: '150px' } }}>
                  <InputLabel>Filter By Mode</InputLabel>
                  <Select label="Filter By Mode" value={modeFilter} onChange={(e) => setModeFilter(e.target.value)}>
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Cheque">Cheque</MenuItem>
                    <MenuItem value="NEFT">NEFT</MenuItem>
                  </Select>
                </FormControl>

                <Button variant="contained" color="primary" startIcon={<DownloadIcon />} onClick={exportToExcel}>
                  Export to Excel
                </Button>
              </Box>
            </Box>

            <div style={{ height: 700, width: '100%', overflow: 'auto' }}>
              <DataGridPro
                rows={filteredRows}
                columns={columns}
                components={{ Toolbar: GridToolbar }}
                localeText={customLocaleText}
                rowHeight={110}
                checkboxSelection
                disableSelectionOnClick
                pagination
                paginationMode="client"
                paginationModel={paginationModel}
                onPaginationModelChange={(model) => setPaginationModel(model)}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                sortModel={sortModel}
                onSortModelChange={(model) => setSortModel(model)}
                getRowId={(row) => row.id}
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    color: yellow[400],
                    textAlign: 'center',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  },
                  '& .MuiDataGrid-columnHeader:focus, .MuiDataGrid-columnHeader:focus-within': { outline: 'none' },
                  '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', textAlign: 'center' },
                  '& .MuiDataGrid-cell:hover': { backgroundColor: yellow[200] },
                  '& .MuiDataGrid-row:hover': { backgroundColor: yellow[100] },
                  '@media (max-width: 600px)': {
                    '& .MuiDataGrid-columnHeaders': { fontSize: '0.75rem' },
                    '& .MuiDataGrid-cell': { fontSize: '0.75rem' },
                  },
                }}
              />
            </div>
          </Paper>
        </Box>

        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loadingData}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>

      {/* Global snackbar */}
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        sx={{ height: '100%' }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
          action={
            <Button color="inherit" size="small" onClick={() => setSnackbarOpen(false)}>
              OK
            </Button>
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Edit dialog */}
      <EditReceiptDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        receipt={editReceipt}
        token={token}
        onSaved={handleReceiptSaved}
        setSnackbarOpen={setSnackbarOpen}
        setSnackbarMessage={setSnackbarMessage}
        setSnackbarSeverity={setSnackbarSeverity}
      />
    </AppTheme>
  );
}

export default Receipts;
