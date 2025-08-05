import React, { useEffect, useState } from 'react';
import { Box, Paper, TextField, Menu, MenuItem, Select, FormControl, InputLabel, Typography, IconButton, Button, CssBaseline, Snackbar, Alert } from '@mui/material';
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import { Link } from 'react-router-dom';
import { yellow, brown } from '../../styles/ThemePrimitives';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { useOutletContext, useLocation } from "react-router-dom";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';
import CancelReceiptDialog from '../../components/accounts/receipts/CancelReceiptDialog';

import AppTheme from '../../styles/AppTheme';

const customLocaleText = {
  noRowsLabel: 'Please wait....', // Remove the default "No rows" text
  noResultsOverlayLabel: '', // Remove default "No results" text for filtered data
};

function Receipts() {
  const { selectedSector, selectedSubSector, selectedYear, selectedSectorName, selectedSubSectorName } = useOutletContext();
  const [loadingData, setLoadingData] = useState(false);
  const [modeFilter, setModeFilter] = useState('All'); 

// console.log("selected: ", selectedSectorName)

  // console.log("selectedSector:", selectedSector, typeof selectedSector);


  const { token, loading } = useUser();
  const [rows, setRows] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [sortModel, setSortModel] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const navigate = useNavigate();

  
  // Export filtered rows to Excel
  const exportToExcel = () => {
    if (!filteredRows.length) {
      alert("No data to export.");
      return;
    }
    // Prepare data for XLSX
    const exportData = filteredRows.map(row => ({
      Name: row.name,
      ITS: row.its,
      Mobile: row.mobile,
      'Folio No': row.folio_no,
      Sector: row.sector.name,
      'Sub Sector': row.sub_sector.name,
      Mode: row.mode,
      Date: row.date,
      Year: row.year,
      Comments: row.comments,
      Amount: row.amount,
      ReceiptNo: row.receipt_no,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Receipts");

    // Generate buffer and trigger download
    XLSX.writeFile(workbook, `Receipts_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

    const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const ActionButtonWithOptions = ({ receiptId  }) => {
    const [anchorEl, setAnchorEl] = useState(null); // Anchor element for the dropdown menu
     const [openCancelDialog, setOpenCancelDialog] = useState(false);
     
    const open = Boolean(anchorEl);

     // Snackbar states


    // Open the menu
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    // Close the menu
    const handleClose = () => {
      setAnchorEl(null);
    };
    const handlePrintClick = () => {
    const printUrl = `https://api.fmb52.com/api/receipt_print/${receiptId}`;
    window.open(printUrl, '_blank');  // Opens in new tab
    handleClose();
  };

  const handleCancelClick = () => {
    setOpenCancelDialog(true);
    handleClose();
  };

  const handleConfirmCancel = (id) => {
    // TODO: Add your cancel logic here, e.g., call API to cancel receipt
    console.log('Cancel confirmed for receipt ID:', id);
    // Optionally refresh the list or show a notification
  };

    // Set the document title
    useEffect(() => {
      document.title = "Receipts - FMB 52"; // Set the title for the browser tab
    }, []);

    return (
      <Box>
        {/* Actions Button */}
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
          {/* View Profile Option */}
          <MenuItem onClick={handlePrintClick}>
          <Tooltip title="View/Print Receipt" placement="left">
            <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
              <LocalPrintshopIcon sx={{ color: brown[200] }} />
              Print
            </Box>
          </Tooltip>
        </MenuItem>

          {/* Edit Option */}
                    <MenuItem onClick={() => { /* Your Edit logic */ handleClose(); }}>
            <Tooltip title="Edit" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                <EditIcon sx={{ color: brown[200] }} />
                Edit
              </Box>
            </Tooltip>
          </MenuItem>

          {/* Delete Option */}
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
        receiptId={receiptId}
        onConfirm={handleConfirmCancel}
        setSnackbarOpen={setSnackbarOpen}
        setSnackbarMessage={setSnackbarMessage}
        setSnackbarSeverity={setSnackbarSeverity}
      />
       <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        sx={{ height: "100%"}}
   anchorOrigin={{
      vertical: "top",
      horizontal: "center"
   }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
              sx={{ width: "100%",  
               }}
              action={
                <Button color="inherit" size="small" onClick={() => setSnackbarOpen(false)}>
                  OK
                </Button>
              }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
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
                to={`/mumeneen/${params.row.family_id}`}
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
              {/* {console.log("sector in receipts: ", params.row)} */}
              Sector: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.sector_name}-{params.row.sub_sector_name}</span>
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'receipt_no',
      headerName: 'Receipt No',
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
            {params.row.receipt_no}
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
        <ActionButtonWithOptions receiptId={params.row.hashed_id} />
      </Box>
    ),
  },
  ];





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
          body: JSON.stringify({
            year: selectedYear,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Receipts", data)
        setRows(data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
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
    row.sector_name?.toLowerCase().includes(filterText.toLowerCase()) ||
    row.sub_sector_name?.toLowerCase().includes(filterText.toLowerCase()) ||
    row.hof_its?.toLowerCase().includes(filterText.toLowerCase()) ||
    row.mumeneen_type?.toLowerCase().includes(filterText.toLowerCase()) ||
    row.hub_amount?.toString().includes(filterText) ||
    row.paid_amount?.toString().includes(filterText) ||
    row.due_amount?.toString().includes(filterText) ||
    row.overdue?.toString().includes(filterText);

  const matchesMode =
    modeFilter === 'All' || row.mode?.toLowerCase() === modeFilter.toLowerCase();

  const selectedSectorValue = Array.isArray(selectedSector) ? selectedSector[0] : selectedSector;
const selectedSubSectorValue = Array.isArray(selectedSubSector) ? selectedSubSector[0] : selectedSubSector;

const matchesSector =
  !selectedSectorName?.length ||
  selectedSectorName.map((s) => s.toLowerCase()).includes(row.sector_name?.toLowerCase());

  const matchesSubSector =
  !selectedSubSectorName?.length ||
  selectedSubSectorName.map((s) => s.toLowerCase()).includes(row.sub_sector_name?.toLowerCase());




// const matchesSubSector =
//   !selectedSubSectorValue ||
//   selectedSubSectorValue === 'all' ||
//   row.sub_sector_name?.toUpperCase() === selectedSubSectorValue.toUpperCase();
//   console.log("row.sector_name:", row.sector_name);
// console.log("comparing with:", selectedSectorValue);



  return matchesFilterText && matchesMode && matchesSector && matchesSubSector;

});


  return (
    <AppTheme>
      <CssBaseline />
      <div
        style={{
          filter: snackbarOpen ? "blur(5px)" : "none",
          transition: "filter 0.3s ease",
          pointerEvents: snackbarOpen ? "none" : "auto",
          userSelect: snackbarOpen ? "none" : "auto",
          marginTop: '145px'
        }}
      >
      <Box sx={{ width: '100%', overflowX: 'auto', mt: 19, pt: 1, pr: 2, pb: 3, pl: 2 }}>
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
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
           <FormControl sx={{ minWidth: 150, width: { xs: '100%', sm: '150px' } }}>
              <InputLabel>Filter By Mode</InputLabel>
              <Select
                label="Filter By Mode"
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Cheque">Cheque</MenuItem>
                <MenuItem value="NEFT">NEFT</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" startIcon={<DownloadIcon />} onClick={() => exportToExcel()}>
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
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingData}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
</div>
    </AppTheme>
  );
}

export default Receipts;
