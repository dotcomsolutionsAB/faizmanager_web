import React, { useEffect, useState } from 'react';
import { Box, Paper, TextField, Menu, MenuItem, Select, FormControl, InputLabel, Typography, IconButton, Button, CssBaseline } from '@mui/material';
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { Link } from 'react-router-dom';
import {yellow, brown} from "../../styles/ThemePrimitives";
import AppTheme from "../../styles/AppTheme";
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
import DeleteIcon from '@mui/icons-material/Delete';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import DeleteMenuDialog from './DeleteMenuDialog';

import { Flip } from 'react-spring';
const customLocaleText = {
  noRowsLabel: 'Please wait....', // Remove the default "No rows" text
  noResultsOverlayLabel: '', // Remove default "No results" text for filtered data
};

function MenuTable({ onEditMenu, refreshTrigger }) {
  const { token, loading, currency } = useUser();
  const [rows, setRows] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [sortModel, setSortModel] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]); 
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const navigate = useNavigate();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State to control the delete dialog
    const [deleteId, setDeleteId] = useState(null); // To store the ID of the expense to be deleted

  const ActionButtonWithOptions = ({ onActionClick, row, onEditMenu, menuId }) => {
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

    // Set the document title
    useEffect(() => {
      document.title = "Menu - FMB 52"; // Set the title for the browser tab
    }, []);

    const handleEditClick = () => {
    onEditMenu(row);  // Pass selected row to parent
    handleClose();
  };
       const handleDeleteClick = () => {
      setDeleteId(menuId); // Set the ID of the receipt to be deleted
      setOpenDeleteDialog(true); // Open the delete dialog
      handleClose();
    };

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

          {/* Edit Option */}
          <MenuItem onClick={handleEditClick}>
            <Tooltip title="Edit" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                <EditIcon sx={{ color: brown[200] }} />
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
      field: 'date',
      headerName: 'Date',
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
            {params.row.date}
          </Typography>
        </Box>
      ),
    },

    {
      field: 'hof',
      headerName: 'HOF',
      width: 300,
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
            {params.row.hof || ''}
          </Typography>
        </Box>
      ),
    },

    {
      field: 'menu',
      headerName: 'Menu',
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
            {params.row.menu}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'niyaz by',
      headerName: 'Niyaz By',
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
            {params.row.niyaz_by}
          </Typography>
        </Box>
      ),
    },

    {
      field: 'sf dish',
      headerName: 'SF Dish',
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
            {params.row.sf_dish || ''}
          </Typography>
        </Box>
      ),
    },

        {
      field: 'sf details',
      headerName: 'SF Details',
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
            {params.row.sf_details || ''}
          </Typography>
        </Box>
      ),
    },

    // {
    //   field: 'attachment_url',
    //   headerName: 'Attachment',
    //   width: 200,
    //   renderCell: (params) => (
    //     <Button
    //       variant="contained"
    //       color="primary"
    //       onClick={() => window.open(params.value, '_blank')}
    //     >
    //       View Image
    //     </Button>
    //   ),
    // },
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
           <ActionButtonWithOptions row={params.row} onEditMenu={onEditMenu} menuId={params.row.id} />
        </Box>
      ),
    },
  ];





  useEffect(() => {
    if (loading || !token) return;

    const fetchData = async () => {
      try {
        const response = await fetch('https://api.fmb52.com/api/menus', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        // console.log("Recipts:", data);
        // console.log(data.data)
        setRows(data.data || []);
        setFilteredRows(data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [token, loading, refreshTrigger]);

  // Filter function to search the data
  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    setFilterText(searchText);

    // Filter the rows based on the search text across all relevant columns
    const filteredData = rows.filter((row) => {
      return (
        row.voucher_no.toString().toLowerCase().includes(searchText) ||
        row.name.toLowerCase().includes(searchText) ||
        row.date.toLowerCase().includes(searchText) ||
        row.amount.toString().toLowerCase().includes(searchText) ||
        row.cheque_no.toString().toLowerCase().includes(searchText) ||
        row.description.toLowerCase().includes(searchText)
      );
    });
    setFilteredRows(filteredData);
  };
  

  return (
    <AppTheme>
      <CssBaseline />
      <Box sx={{ width: '100%', overflowX: 'auto', mt: 1, pt: 1, pr: 2, pb: 3, pl: 2 }}>
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
            onChange={handleSearch}
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
      </Box>

            <DeleteMenuDialog
              open={openDeleteDialog}
              onClose={() => setOpenDeleteDialog(false)}
              menuId={deleteId}
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

    </AppTheme>
  );
}

export default MenuTable;
