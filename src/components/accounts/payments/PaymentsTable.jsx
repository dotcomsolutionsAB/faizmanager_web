import React, { useEffect, useState } from 'react';
import { Box, Paper, TextField,Menu,  MenuItem, Select, FormControl, InputLabel, Typography, IconButton, Button, CssBaseline } from '@mui/material';
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../UserContext';
import { Link } from 'react-router-dom';
import {yellow, brown} from "../../../styles/ThemePrimitives";
import EditIcon from '@mui/icons-material/Edit';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import Tooltip from '@mui/material/Tooltip';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useOutletContext, useLocation } from "react-router-dom";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import DeletePaymentsDialog from './DeletePaymentsDialog';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


import { Flip } from 'react-spring';
import AppTheme from "../../../styles/AppTheme";


const customLocaleText = {
  noRowsLabel: 'Please wait....', // Remove the default "No rows" text
  noResultsOverlayLabel: '', // Remove default "No results" text for filtered data
};

function PaymentsTable() {
    const { selectedSector, selectedSubSector, selectedYear } = useOutletContext();
    const [loadingData, setLoadingData] = useState(false);
      const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State to control the delete dialog
      const [deleteId, setDeleteId] = useState(null); // To store the ID of the expense to be deleted
  
  const { token, loading } = useUser();
  const [rows, setRows] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [sortModel, setSortModel] = useState([]);
  const [filterType, setFilterType] = useState('HOF');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
const [snackbarSeverity, setSnackbarSeverity] = useState('success');

const handleSnackbarClose = () => {
  setSnackbarOpen(false);
};

  const navigate = useNavigate();


  const ActionButtonWithOptions = ({ onActionClick,  paymentId  }) => {
    const [anchorEl, setAnchorEl] = useState(null); // Anchor element for the dropdown menu
    const open = Boolean(anchorEl);
  
    // Open the menu
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    // Close the menu
    const handleClose = () => {
      setAnchorEl(null);
    };

         const handleDeleteClick = () => {
      setDeleteId(paymentId); // Set the ID of the receipt to be deleted
      setOpenDeleteDialog(true); // Open the delete dialog
      handleClose();
    };
  
        // Set the document title
        useEffect(() => {
          document.title = "Receipts - FMB 52"; // Set the title for the browser tab
        }, []);
      
    return (
      <Box>
        {/* Actions Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
        >
          Actions
          {/* <MoreVertIcon /> */}

        </Button>
  
        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}

          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
  
          {/* Edit Hub Option */}
          <MenuItem onClick={() => { onActionClick('Edit'); handleClose(); }}>
            <Tooltip title="Edit Hub" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{pr: 2}}>
                <EditIcon sx={{color: brown[200]}} />
                Edit
              </Box>
            </Tooltip>
          </MenuItem>
  
           {/* Delete Option */}
                    <MenuItem onClick={handleDeleteClick}>
                      <Tooltip title="Delete" placement="left">
                        <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                          <DeleteIcon sx={{ color: brown[200] }} />
                          Delete
                        </Box>
                      </Tooltip>
                    </MenuItem>
        </Menu>
      </Box>
    );
  };

  const columns = [
    {
      field: 'mumeneen_info', // Single column for combined photo and info
      headerName: 'Mumeneen Info',
      width: 570, // Adjust the width to fit both photo and details
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Photo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px', // Space between photo and text
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
  
          {/* Mumeneen Info (Text) */}
          <Box sx={{ display: 'flex', flexDirection: 'column', paddingTop: 1 }}>
            {/* Name */}
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Name:
              <Link
                to={`/mumeneen/${params.row.id}`}
                style={{
                  color: yellow[400],
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => (e.target.style.color = brown[700])}
                onMouseLeave={(e) => (e.target.style.color = yellow[400])}
              >
                {params.row.name}
              </Link>
            </Typography>
  
            {/* ITS */}
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              ITS: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.its}</span>
            </Typography>
  
            {/* Mobile */}
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Mobile: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.mobile}</span>
            </Typography>
  
            {/* Folio No */}
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Folio No: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.folio_no}</span>
            </Typography>
  
            {/* Sector */}
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Sector: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.sector}-{params.row.sub_sector}</span>
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
            {params.row.payment_no}
          </Typography>
        </Box>
      ),
    },
    
    {
      field: 'receipt', // Updated to exclude Receipt No
      headerName: 'Receipt Details',
      width: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', paddingTop: 1 }}>
            {/* Mode */}
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Mode: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.mode}</span>
            </Typography>
  
            {/* Date */}
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Date: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.date}</span>
            </Typography>
  
            {/* Year */}
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Year: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.year}</span>
            </Typography>
  
            {/* Comments */}
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
      sortable: true,
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
          <ActionButtonWithOptions paymentId={params.row.id} />
        </Box>
      ),
    },
  ];
  




  useEffect(() => {
    if (loading || !token) return;

    const fetchData = async () => {
      if (loading || !token || !selectedYear?.length) return;
      try {
        setLoadingData(true);

        const response = await fetch('https://api.fmb52.com/api/payments/all', {
                    method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }, body: JSON.stringify({
            year: selectedYear,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Recipts:", data);
        // console.log(data.data)
        setRows(data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }finally {
        setLoadingData(false); // <-- End loading
      }
    };

    fetchData();
  }, [token, loading, selectedYear]);

  // Filter rows based on filterText and filterType
  const filteredRows = rows.filter((row) => {
    const matchesFilterText =
      row.name?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.its?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.mobile?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.folio_no?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.sector?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.sub_sector?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.hof_its?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.mumeneen_type?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.hub_amount?.toString().includes(filterText) ||
      row.paid_amount?.toString().includes(filterText) ||
      row.due_amount?.toString().includes(filterText) ||
      row.overdue?.toString().includes(filterText);

    //     // Sector condition
    //   const matchesSector =
    //   selectedSector === 'all' || !selectedSector || row.sector?.toLowerCase() === selectedSector.toLowerCase();

    // // Sub-Sector condition
    // const matchesSubSector =
    //   selectedSubSector === 'all' || !selectedSubSector || row.sub_sector?.toLowerCase() === selectedSubSector.toLowerCase();

    // Year condition
    // const matchesYear = selectedYear === 'all' || !selectedYear || row.year?.toString() === selectedYear;


    const matchesFilterType =
      filterType === 'All' ||
      (row.mumeneen_type &&
        row.mumeneen_type.trim().toUpperCase() === filterType.trim().toUpperCase());

    return matchesFilterText && matchesFilterType;
  });

  return (
    <AppTheme>
      <CssBaseline />
      <Box sx={{ width: '100%', overflowX: 'auto',  mt: 1, pt: 1, pr: 2, pb: 3, pl: 2 }}>
        <Paper
          sx={{
            width: '100%',
            boxShadow: 1,
            overflowX: 'auto',
            p: 1,
            '@media (max-width: 600px)': {
              p: 1,
            },
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
                sx: {
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  mb: '7px',
                },
              }}
            />
          </Box>
          <div style={{ height: 700, width: '100%', overflow: 'auto' }}>
            <DataGridPro
              rows={rows}
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
              ggetRowId={(row) => row.id}
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  color: yellow[400],
                  textAlign: 'center',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                },

                '& .MuiDataGrid-columnHeader:focus, .MuiDataGrid-columnHeader:focus-within': {
                  outline: 'none',
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold',
                  textAlign: 'center'
                },
                '& .MuiDataGrid-cell': {
                  '&:hover': {
                    backgroundColor: yellow[200],
                  },
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: yellow[100],
                },
                '@media (max-width: 600px)': {
                  '& .MuiDataGrid-columnHeaders': {
                    fontSize: '0.75rem',
                  },
                  '& .MuiDataGrid-cell': {
                    fontSize: '0.75rem',
                  },
                },
              }}
            />
          </div>
        </Paper>
        <DeletePaymentsDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                paymentId={deleteId}
                onConfirm={() => {
                  // Handle the actual deletion here, for example:
                  // Delete the item from the state
                  setRows(rows.filter(row => row.id !== deleteId));
                  setOpenDeleteDialog(false);
                }}
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
      <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loadingData}
            >
              <CircularProgress color="inherit" />
            </Backdrop>

    </AppTheme>
  );
}

export default PaymentsTable;
