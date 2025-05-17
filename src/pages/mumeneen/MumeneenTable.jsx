import React, { useEffect, useState } from 'react';
import { Box, Paper, TextField, FormControl, InputLabel, Select, Menu, MenuItem, Tooltip, Typography, Button, CssBaseline, Chip } from '@mui/material';
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import { Link } from 'react-router-dom';
import { yellow, brown } from '../../styles/ThemePrimitives';
import { useOutletContext } from 'react-router-dom';
import AppTheme from '../../styles/AppTheme'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EditIcon from '@mui/icons-material/Edit';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import EditHubDialog from '../../components/mumeneenTable/EditHubDialog';
import AddReceiptDialog from '../../components/mumeneenTable/AddReceiptDialog';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import OtherSectorTransferDialog from '../../components/mumeneenTable/OtherSectorTransferDialog';
import OtherJamiatTransferDialog from '../../components/mumeneenTable/OtherJamiatTransferDialog';
import AddHofDialog from '../../components/mumeneenTable/AddHofDialog';


const customLocaleText = {
  noRowsLabel: 'Please wait....',
  noResultsOverlayLabel: '',
};

function MumeneenTable() {
  const { selectedSector, selectedSubSector, selectedYear } = useOutletContext();
  const { token, loading, currency } = useUser();

  const year = selectedYear.length ? selectedYear : "";
  const sector = selectedSector.length ? selectedSector : ["all"];
  const subSector = selectedSubSector.length ? selectedSubSector : ["all"];


  const [filterText, setFilterText] = useState('');
  const [sortModel, setSortModel] = useState([]);
  const [filterType, setFilterType] = useState('HOF');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [rows, setRows] = useState([]);
  const [apiError, setApiError] = useState(null);

  
  const [editHubDialogOpen, setEditHubDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [addReceiptDialogOpen, setAddReceiptDialogOpen] = useState(false);
const [selectedRowForReceipt, setSelectedRowForReceipt] = useState(null);

const [addHofDialogOpen, setAddHofDialogOpen] = useState(false);
const [selectedFamilyRow, setSelectedFamilyRow] = useState(null); // for future edit if needed


const handleOtherSectorTransferSave = (data) => {
    console.log('Other Sector Transfer Data:', data);
    // Handle the save action here, such as API call to update data
  };

  const handleOtherJamiatTransferSave = (data) => {
    console.log('Out of Jamiat Transfer Data:', data);
    // Handle the save action here, such as API call to update data
  };

  const [selectedRowForTransfer, setSelectedRowForTransfer] = useState(null);
  const [otherSectorTransferDialogOpen, setOtherSectorTransferDialogOpen] = useState(false);
  const [otherJamiatTransferDialogOpen, setOtherJamiatTransferDialogOpen] = useState(false);



const thaliStatusOptions = {
  "taking": "Taking",
  "not_taking": "Not Taking",
  "once_a_week": "Once a Week",
  "joint": "Joint",
  "other_centre": "Other Centre"
};

const thaliStatusColors = {
  "taking": "success",
  "not_taking": "error",
  "once_a_week": "warning",
  "joint": "info",
  "other_centre": "default"
};

    // Set the document title
    useEffect(() => {
      document.title = "Mumeneen - FMB 52"; // Set the title for the browser tab
    }, []);
  


  const navigate = useNavigate();

  const currencyCode = currency?.currency_code || 'INR';
  const currencySymbol = currency?.currency_symbol || '₹';

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
    }).format(value || 0);
  };

  const ActionButtonWithMenu = ({ row, onActionClick }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    // const open = Boolean(anchorEl);
    const [open, setOpen] = useState(false);
    const [showTransferOptions, setShowTransferOptions] = useState(false);
  
     const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

   const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

     const handleTransferClick = () => {
    setShowTransferOptions(!showTransferOptions); // Toggle options visibility on click
  }
  



    return (
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
        >
          Actions
        </Button>
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
          <MenuItem
            onClick={() => {
              onActionClick('View Profile', row);
              handleClose();
            }}
          >
            <Tooltip title="View Profile" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{pr: 2}}>
                <AccountCircleIcon  sx={{ color: brown[200] }} />
                <Typography>View Profile</Typography>
              </Box>
            </Tooltip>
          </MenuItem>
          <MenuItem
            onClick={() => {
              onActionClick('Add Receipt', row);
              handleClose();
            }}
          >
            <Tooltip title="Add Receipt" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{pr: 2}}>
                <ReceiptIcon  sx={{ color: brown[200] }} />
                <Typography>Add Receipt</Typography>
              </Box>
            </Tooltip>
          </MenuItem>
          <MenuItem
            onClick={() => {
              onActionClick('Edit Hub', row);
              handleClose();
            }}
          >
            <Tooltip title="Edit Hub" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{pr: 2}}>
                <EditIcon  sx={{ color: brown[200] }} />
                <Typography>Edit Hub</Typography>
              </Box>
            </Tooltip>
          </MenuItem>
           <MenuItem
          onClick={handleTransferClick}
        >
          <Tooltip title="Transfer" placement="left">
            <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
              <TransferWithinAStationIcon sx={{ color: brown[200] }} />
              <Typography>Transfer</Typography>
              <KeyboardArrowDownIcon sx={{ color: brown[200] }} />
            </Box>
          </Tooltip>
        </MenuItem>

        {/* Conditionally render additional options when clicked on "Transfer" */}
        {showTransferOptions && (
          <>
            <MenuItem
              onClick={() => {
                onActionClick('Other sector', row);
                handleClose();
              }}
              sx={{ pl: 4 }}
            >
              Other sector
            </MenuItem>
            <MenuItem
              onClick={() => {
                onActionClick('Out of jamiat', row);
                handleClose();
              }}
              sx={{ pl: 4 }}
            >
              Out of jamiat
            </MenuItem>
          </>
        )}
      </Menu>
      </Box>
    );
  };
  
  const columns = [
    {
  field: 'mumeneen_info',
  headerName: 'Mumeneen Info',
  width: 550,
  renderCell: (params) => {

    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '16px',
        }}>
          <img
            src={params.row.photo ? params.row.photo.file_url : '/static/images/avatar-placeholder.png'}
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
            Sector: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.sector?.name} - {params.row.sub_sector?.name}</span>
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
            Thali Status: <span style={{ fontWeight: 'normal', color: brown[700] }}>  
              <Chip 
                label={thaliStatusOptions[params.row.thali_status] || params.row.thali_status}
                color={thaliStatusColors[params.row.thali_status] || "default"}
                sx={{ ml: 0.5, fontWeight: 'bold' }}
              /> 
            </span>
          </Typography>
          {/* Show label if it is not null */}
          {params.row.label && (
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Label: <span style={{ fontWeight: 'normal', color: brown[700] }}>{params.row.label}</span>
            </Typography>
          )}
        </Box>
      </Box>
    );
  },
},

    {
      field: 'hub_amount',
      headerName: 'Hub',
      width: 180,
      sortable: true,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            color: '#1976d2',
            textAlign: 'right',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: '100%',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          {formatCurrency(params.row.hub_amount)}
        </Typography>
      ),
    },
    {
      field: 'paid_amount',
      headerName: 'Paid',
      width: 180,
      sortable: true,
      renderCell: (params) => (
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
            fontWeight: 'bold'
          }}
        >
          {formatCurrency(params.row.paid_amount)}
        </Typography>
      ),
    },
    {
      field: 'due_amount',
      headerName: 'Due',
      width: 180,
      sortable: true,
      renderCell: (params) => (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-end',
          height: '100%'
        }}>
          <Typography
            variant="body2"
            sx={{
              color: '#d32f2f',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            {formatCurrency(params.row.due_amount)}
          </Typography>
          {params.row.overdue > 0 && (
            <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
              Overdue: {formatCurrency(params.row.overdue)}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%', // Ensures full height of the cell
            width: '100%',  // Ensures full width of the cell
          }}
        >
          <ActionButtonWithMenu
            row={params.row}
            onActionClick={(action, row) => {
              console.log(`Action: ${action}`, row);
              if (action === 'View Profile') {
                navigate(`/mumeneen/${row.family_id}`);
              } else if (action === 'Add Receipt') {
                setSelectedRowForReceipt(row);
                setAddReceiptDialogOpen(true); // Open the dialog
              } else if (action === 'Edit Hub') {
                setSelectedRow(row);
                setEditHubDialogOpen(true); // Open the dialog
              } else if (action === 'Transfer') {
      console.log('Transfer clicked for:', row);
    } else if (action === 'Other sector') {
      console.log('Other sector transfer clicked for:', row);
      setSelectedRowForTransfer(row);
      setOtherSectorTransferDialogOpen(true); // Open the Other Sector Transfer dialog
    } else if (action === 'Out of jamiat') {
      console.log('Out of jamiat transfer clicked for:', row);
      setSelectedRowForTransfer(row);
      setOtherJamiatTransferDialogOpen(true); // Open the Out of Jamiat Transfer dialog
    }
            }}            
          />
        </Box>
      ),
    },
    
  ];

  useEffect(() => {
    if (loading || !token) return;

    const fetchData = async () => {
      try {
        const sectorParams = sector.map((s) => `sector[]=${encodeURIComponent(s)}`).join("&");
        const subSectorParams = subSector.map((s) => `sub_sector[]=${encodeURIComponent(s)}`).join("&");

        const url = `https://api.fmb52.com/api/mumeneen?year=${year}&${sectorParams}&${subSectorParams}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setRows(data.data || []);
      } catch (error) {
        setApiError('The data is currently unavailable, but we are working to resolve this. Thank you for your patience!');
        setRows([]);
      }
    };

    fetchData();
  }, [token, loading, year, sector, subSector]);

  const filteredRows = rows.filter((row) => {
    const matchesFilterText =
    row.name?.toLowerCase().includes(filterText.toLowerCase()) ||
    row.its?.toLowerCase().includes(filterText.toLowerCase()) ||
    row.mobile?.toLowerCase().includes(filterText.toLowerCase()) ||
    row.folio_no?.toLowerCase().includes(filterText.toLowerCase()) ||
    row.sector?.name?.toLowerCase().includes(filterText.toLowerCase()) ||
    row.sub_sector?.name?.toLowerCase().includes(filterText.toLowerCase()) ||
    row.hof_its?.toLowerCase().includes(filterText.toLowerCase()) ||
    row.mumeneen_type?.toLowerCase().includes(filterText.toLowerCase()) ||
    row.hub_amount?.toString().includes(filterText) ||
    row.paid_amount?.toString().includes(filterText) ||
    row.due_amount?.toString().includes(filterText) ||
    row.overdue?.toString().includes(filterText);

    const matchesFilterType =
      filterType === 'All' ||
      (row.mumeneen_type &&
        row.mumeneen_type.trim().toUpperCase() === filterType.trim().toUpperCase());

    return matchesFilterText && matchesFilterType;
  });

  return (
    <AppTheme>
          <Box sx={{ width: '100%', overflowX: 'auto', mt: 16, pt: 1, pr: 2, pb: 3, pl: 2 }}>
      <CssBaseline />
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
            <Button
              variant="outlined"
              color="primary"
               onClick={() => setAddHofDialogOpen(true)}
            >
              Add HOF
            </Button>
            <FormControl sx={{ minWidth: 150, width: { xs: '100%', sm: '150px' } }}>
              <InputLabel>Filter By</InputLabel>
              <Select value={filterType} label="Filter By" onChange={(e) => setFilterType(e.target.value)}>
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="HOF">HOF</MenuItem>
                <MenuItem value="FM">FM</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <div style={{ height: 700, width: '100%', overflow: 'auto' }}>
          <DataGridPro
            rows={filteredRows}
            columns={columns}
            loading={loading}
            components={{
              Toolbar: GridToolbar, NoRowsOverlay: () => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    backgroundColor: '#f9f9f9',
                    color: '#555',
                  }}
                >
                  {apiError ? (
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {apiError}
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        No data available yet
                      </Typography>
                      <Typography variant="body2">
                        Please add entries or adjust filters to display data here.
                      </Typography>
                    </>
                  )}
                </Box>
              ),
            }}
            localeText={customLocaleText}
            rowHeight={135}
            getRowHeight={(params) => (params.model.label ? 155 : 135)} // Increase height if label exists
            checkboxSelection
            disableSelectionOnClick
            pagination
            paginationMode="client"
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => setPaginationModel(model)}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            sortModel={sortModel}
            onSortModelChange={(model) => setSortModel(model)}
            getRowId={(row) => row.its || Math.random()}
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
    {console.log("Year in mumeneen", year)}
    <EditHubDialog
  open={editHubDialogOpen}
  onClose={() => setEditHubDialogOpen(false)}
  row={selectedRow} // Pass the selected row
  onSave={(updatedData) => {
    console.log('Updated Data from API:', updatedData);

    if (updatedData && updatedData.hub) {
        const newHubAmount = updatedData.hub.hub_amount;
        const newThaliStatus = updatedData.hub.thali_status;
        
        console.log('New Hub Amount:', newHubAmount);
        console.log('Thali status:', newThaliStatus);

        setRows((prevRows) =>
            prevRows.map((r) =>
                r.its === selectedRow.its 
                    ? { ...r, hub_amount: newHubAmount, thali_status: newThaliStatus } 
                    : r
            )
        );
    } else {
        console.error('Invalid updated data:', updatedData);
    }

}}

  formatCurrency={formatCurrency}
  year={year}
/>

<AddHofDialog
  open={addHofDialogOpen}
  onClose={() => setAddHofDialogOpen(false)}
  row={selectedFamilyRow} // optional, useful if editing existing family
  onSave={(newData) => {
    console.log('New Family Saved:', newData);
    setAddHofDialogOpen(false);

    // Optionally push into table
    setRows((prev) => [newData, ...prev]);
  }}
  formatCurrency={formatCurrency}
  year={year}
/>


<AddReceiptDialog
  open={addReceiptDialogOpen}
  onClose={() => setAddReceiptDialogOpen(false)}
  row={selectedRowForReceipt}
  familyId={selectedRowForReceipt?.family_id}
  onSave={(receiptData) => {
    console.log('Receipt Data:', receiptData);
    // Perform save logic here
  }}
  formatCurrency={formatCurrency}
/>

<OtherSectorTransferDialog
        open={otherSectorTransferDialogOpen}
        onClose={() => setOtherSectorTransferDialogOpen(false)}
        row={selectedRowForTransfer}
        onSave={handleOtherSectorTransferSave}
      />

      <OtherJamiatTransferDialog
        open={otherJamiatTransferDialogOpen}
        onClose={() => setOtherJamiatTransferDialogOpen(false)}
        row={selectedRowForTransfer}
        onSave={handleOtherJamiatTransferSave}
      />



    </AppTheme>
  );
}

export default MumeneenTable;
