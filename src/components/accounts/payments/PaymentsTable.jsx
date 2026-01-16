import React, { useEffect, useState, useCallback } from 'react';
import { Box, Paper, TextField, Menu, MenuItem, Select, FormControl, InputLabel, Typography, Button, CssBaseline } from '@mui/material';
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import { yellow, brown } from "../../../styles/ThemePrimitives";
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import DeletePaymentsDialog from './DeletePaymentsDialog';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useOutletContext } from "react-router-dom";
import AppTheme from "../../../styles/AppTheme";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ApprovePaymentDialog from './ApprovePaymentDialog';
import { formatDateToDDMMYYYY } from '../../../util';

const customLocaleText = {
  noRowsLabel: 'Please wait....',
  noResultsOverlayLabel: '',
};

function PaymentsTable({ payments, onEdit, fetchData }) {
  const { selectedSector, selectedSubSector, selectedYear, selectedSectorName, selectedSubSectorName } = useOutletContext();
  const [loadingData, setLoadingData] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { token, loading, user } = useUser();
  const [filteredRows, setFilteredRows] = useState(payments);
  const [filterText, setFilterText] = useState('');
  const [sortModel, setSortModel] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const [filterMode, setFilterMode] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // <-- NEW: status filter ('' = All)

  const canApprove = user?.id === 473;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = () => setSnackbarOpen(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFilteredRows(payments || []);
  }, [payments]);

  // Centralized filter: search + mode + status + sector/sub-sector
const applyFilters = useCallback(() => {
  const searchText = (filterText || '').toLowerCase();
  const desiredStatus = (filterStatus || '').toLowerCase(); // '', 'pending', 'approved'
  const desiredMode = (filterMode || '').toLowerCase();     // '', 'cash', 'cheque', 'neft'

  const data = (payments || []).filter((row) => {
    // text search
    const textMatch =
      (row.name?.toLowerCase() || '').includes(searchText) ||
      (row.its?.toLowerCase() || '').includes(searchText) ||
      (row.sector_name?.toLowerCase() || '').includes(searchText) ||
      (row.sub_sector_name?.toLowerCase() || '').includes(searchText);

    // mode filter
    const modeVal = (row.mode || '').toLowerCase();
    const modeMatch = desiredMode ? (modeVal === desiredMode) : true;

    // status filter (expects 'pending' or 'approved' from API)
    const statusVal = (row.status || '').toLowerCase();
    const statusMatch = desiredStatus ? (statusVal === desiredStatus) : true;

    // sector filter (exactly like your snippet)
    const matchesSector =
      !selectedSectorName?.length ||
      selectedSectorName.map((s) => String(s).toLowerCase()).includes((row.sector_name || '').toLowerCase());

    // sub-sector filter (exactly like your snippet)
    const matchesSubSector =
      !selectedSubSectorName?.length ||
      selectedSubSectorName.map((s) => String(s).toLowerCase()).includes((row.sub_sector_name || '').toLowerCase());

    return textMatch && modeMatch && statusMatch && matchesSector && matchesSubSector;
  });

  setFilteredRows(data);

  // ⚠️ Show a short message only when a specific status is selected and nothing matches
  if (desiredStatus && data.length === 0) {
    setSnackbarMessage(`No payments found with status "${filterStatus}".`);
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  }
}, [payments, filterText, filterMode, filterStatus, selectedSectorName, selectedSubSectorName]);


  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSearch = (e) => setFilterText(e.target.value || '');
  const handleModeFilter = (event) => setFilterMode(event.target.value || '');
  const handleStatusFilter = (event) => setFilterStatus(event.target.value || ''); // <-- NEW

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    setOpenDeleteDialog(false);
    fetchData && fetchData();
  };

  const ActionButtonWithOptions = ({ paymentId, rowData, paymentHashedId }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { token } = useUser(); // use token for API in the dialog

    // approve / cancel dialog state
    const [approveOpen, setApproveOpen] = useState(false);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleEditClick = () => {
      onEdit(rowData);
      handleClose();
    };

    const handleDeleteClick = () => {
      setDeleteId(paymentId);
      setOpenDeleteDialog(true);
      handleClose();
    };

    const handlePrintClick = () => {
      const printUrl = `https://api.fmb52.com/api/payment_print/${paymentHashedId}`;
      window.open(printUrl, '_blank');
      handleClose();
    };

    const handleApproveOpen = () => {
      setApproveOpen(true);
      handleClose();
    };

    const handleApproveClose = () => setApproveOpen(false);

    const handleApproveSuccess = () => {
      fetchData && fetchData();
      setSnackbarMessage('Payment status updated successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    };

    useEffect(() => {
      document.title = "Payments - FMB 52";
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
          <MenuItem onClick={handleEditClick}>
            <Tooltip title="Edit" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                <EditIcon sx={{ color: brown[200] }} />
                Edit
              </Box>
            </Tooltip>
          </MenuItem>

          <MenuItem onClick={handleDeleteClick}>
            <Tooltip title="Delete" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                <DeleteIcon sx={{ color: brown[200] }} />
                Delete
              </Box>
            </Tooltip>
          </MenuItem>

          <MenuItem onClick={handlePrintClick}>
            <Tooltip title="Print" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                <LocalPrintshopIcon sx={{ color: brown[200] }} />
                Print
              </Box>
            </Tooltip>
          </MenuItem>

          {canApprove && (
            <MenuItem onClick={handleApproveOpen}>
              <Tooltip title="Approve / Cancel" placement="left">
                <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                  <CheckCircleIcon sx={{ color: brown[200] }} />
                  Approve
                </Box>
              </Tooltip>
            </MenuItem>
          )}
        </Menu>

        {canApprove && (
          <ApprovePaymentDialog
            open={approveOpen}
            onClose={handleApproveClose}
            onSuccess={handleApproveSuccess}
            token={token}
            paymentId={paymentId}
          />
        )}
      </Box>
    );
  };

  const columns = [
    {
      field: 'mumeneen_info',
      headerName: 'Mumeneen Info',
      width: 570,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
            <img
              src={params.row.photo_url ? params.row.photo_url : '/static/images/avatar-placeholder.png'}
              alt="User Photo"
              style={{ width: 80, height: 90, border: '2px solid #ddd', borderRadius: 8, objectFit: 'cover' }}
            />
          </div>

          <Box sx={{ display: 'flex', flexDirection: 'column', pt: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Name:{' '}
              <Link
                to={`/mumeneen/${params.row.id}`}
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
              Sector: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.sector_name}-{params.row.sub_sector_name}</span>
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'payment_no',
      headerName: 'Payment No',
      width: 150,
      sortable: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
          <Typography variant="body2" sx={{ color: brown[700] }}>
            {params.row.payment_no}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      sortable: true,
      renderCell: (params) => {
        const status = params.row.status?.toLowerCase();
        let color;

        switch (status) {
          case 'pending':
            color = '#f1c40f';
            break;
          case 'cancelled':
            color = '#e74c3c';
            break;
          case 'approved':
          case 'completed':
          case 'active':
            color = '#27ae60';
            break;
          default:
            color = '#5d4037';
            break;
        }

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
            <Typography variant="body2" sx={{ color, fontWeight: 600, textTransform: 'capitalize' }}>
              {params.row.status}
            </Typography>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', pt: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Mode: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.mode}</span>
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Date: <span style={{ fontWeight: 'normal', color: brown[700] }}> {formatDateToDDMMYYYY(params.row.date)}</span>
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
        const formattedAmount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(params.row.amount);
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
      sortable: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
          <ActionButtonWithOptions paymentId={params.row.id} rowData={params.row} paymentHashedId={params.row.hashed_id} />
        </Box>
      ),
    },
  ];

  return (
    <AppTheme>
      <CssBaseline />
      <Box sx={{ width: '100%', overflowX: 'auto', mt: 1, pt: 1, pr: 2, pb: 2, pl: 2 }}>
        <Paper
          sx={{
            width: '100%',
            boxShadow: 1,
            overflowX: 'auto',
            p: 1,
            '@media (max-width: 600px)': { p: 1 },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <TextField
              label="Search"
              variant="outlined"
              value={filterText}
              onChange={handleSearch}
              sx={{ width: { xs: '100%', sm: '300px' } }}
              InputProps={{ sx: { height: '52px', display: 'flex', alignItems: 'center', mb: '7px' } }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Mode</InputLabel>
                <Select value={filterMode} label="Mode" onChange={handleModeFilter} sx={{ height: '52px' }}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="cheque">Cheque</MenuItem>
                  <MenuItem value="neft">NEFT</MenuItem>
                </Select>
              </FormControl>

              {/* NEW: Status filter (right of Mode) */}
              <FormControl sx={{ minWidth: 140 }}>
                <InputLabel>Status</InputLabel>
                <Select value={filterStatus} label="Status" onChange={handleStatusFilter} sx={{ height: '52px' }}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                </Select>
              </FormControl>
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
                '& .MuiDataGrid-cell': { '&:hover': { backgroundColor: yellow[200] } },
                '& .MuiDataGrid-row:hover': { backgroundColor: yellow[100] },
                '@media (max-width: 600px)': {
                  '& .MuiDataGrid-columnHeaders': { fontSize: '0.75rem' },
                  '& .MuiDataGrid-cell': { fontSize: '0.75rem' },
                },
              }}
            />
          </div>
        </Paper>

        <DeletePaymentsDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          paymentId={deleteId}
          onConfirm={handleDeleteConfirm}
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarSeverity={setSnackbarSeverity}
        />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          sx={{ height: "100%" }}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loadingData}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </AppTheme>
  );
}

export default PaymentsTable;
