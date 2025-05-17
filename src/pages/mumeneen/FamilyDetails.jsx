import React, { useState, useEffect } from 'react';
import {
  Box, CircularProgress, Typography, IconButton, Paper,
  CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem, Tooltip, Menu
} from '@mui/material';
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import { useUser } from '../../UserContext'; // Assuming useUser is in the correct path
import { yellow, brown } from '../../styles/ThemePrimitives';
import AppTheme from '../../styles/AppTheme';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SwitchIcon from '@mui/icons-material/Flip';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';


const FamilyDetails = ({ familyId }) => {
  const [familyData, setFamilyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useUser(); // Get user data, including the Bearer token from UserContext
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedITS, setSelectedITS] = useState(null); // Store the ITS of the selected user for switching HOF

  const handleEdit = (id) => {
    console.log("Edit", id);
    // Implement your edit functionality here
  };

  const handleDelete = (id) => {
    console.log("Delete", id);
    // Implement your delete functionality here
  };

  const handleSwitchHOF = (its) => {
    setSelectedITS(its); // Set the ITS of the user being switched
    setOpenDialog(true); // Open the dialog
  };

  const confirmSwitchHOF = async () => {
    console.log("Switch HOF for ITS:", selectedITS);
    // Implement the logic to switch HOF here. You can call the API to update the HOF
    setOpenDialog(false); // Close the dialog after confirmation
  };

  const cancelSwitchHOF = () => {
    setOpenDialog(false); // Close the dialog without performing the action
  };

  console.log("Family Details Component")
  console.log(familyId)

  useEffect(() => {
    if (!token || !familyId) return;

    const fetchFamilyData = async () => {
      try {
        const response = await fetch(`https://api.fmb52.com/api/mumeneen/family_members`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ family_id: [familyId] }),
        });

        console.log('Response Status:', response.status);

        if (!response.ok) {
          throw new Error(`Error fetching receipts: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data)
        setFamilyData(data.data || []); // Assuming the API response contains a "data" field for receipts
        setLoading(false);
      } catch (error) {
        setError('The data is currently unavailable, but we are working to resolve this. Thank you for your patience!');
        setLoading(false);
      }
    };

    fetchFamilyData();
  }, [familyId, token]);

    const ActionButtonWithOptions = ({ onActionClick }) => {
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

                        <MenuItem onClick={() => { onActionClick('Switch HOF'); handleClose(); }}>
              <Tooltip title="Switch HOF" placement="left">
                <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                  <SwitchAccountIcon sx={{ color: brown[200] }} />
                  Switch HOF
                </Box>
              </Tooltip>
            </MenuItem>

            {/* View Profile Option */}
            <MenuItem onClick={() => { onActionClick('View Profile'); handleClose(); }}>
              <Tooltip title="View Profile" placement="left">
                <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                  <LocalPrintshopIcon sx={{ color: brown[200] }} />
                  Print
                </Box>
              </Tooltip>
            </MenuItem>
  
  
            {/* Edit Option */}
            <MenuItem onClick={() => { onActionClick('Edit Hub'); handleClose(); }}>
              <Tooltip title="Edit" placement="left">
                <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                  <EditIcon sx={{ color: brown[200] }} />
                  Edit
                </Box>
              </Tooltip>
            </MenuItem>
  
            {/* Delete Option */}
            <MenuItem onClick={() => { onActionClick('Transfer'); handleClose(); }}>
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
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Photo */}
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

          {/* Mumeneen Info (Text) */}
          <Box sx={{ display: 'flex', flexDirection: 'column', paddingTop: 1 }}>
            {/* Name */}
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Name: <Link
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

            {/* Gender*/}
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              Gender: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.gender}</span>
            </Typography>

            {/* DOB */}
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
              DOB: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.dob}</span>
            </Typography>
          </Box>
        </Box>
      ),
    },
    // {
    //   field: 'action',
    //   headerName: 'Action',
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <Box
    //         sx={{
    //           display: 'flex',
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //           height: '100%',
    //           gap: 2,
    //         }}
    //       >
    //         <IconButton onClick={() => handleSwitchHOF(params.row.its)} sx={{ color: brown[700] }}>
    //           <SwitchIcon />
    //         </IconButton>
    //         <IconButton onClick={() => handleEdit(params.row.its)} sx={{ color: brown[700] }}>
    //           <EditIcon />
    //         </IconButton>
    //         <IconButton onClick={() => handleDelete(params.row.its)} sx={{ color: brown[700] }}>
    //           <DeleteIcon />
    //         </IconButton>
    //       </Box>
    //     );
    //   },
    // },
     {
          field: 'action',
          headerName: 'Action',
          width: 170,
          sortable: true,
          renderCell: () => (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <ActionButtonWithOptions />
            </Box>
          ),
        },
  ];

  // Loading and error states
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <AppTheme>
      <CssBaseline />
      <Paper
        sx={{
          p: 4,
          borderRadius: '8px',
          backgroundColor: '#F7F4F1',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
        }}
      >
        <DataGridPro
          rows={familyData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          pageSize={5}
          rowsPerPageOptions={[5]}
          rowHeight={115}
          disableSelectionOnClick
          checkboxSelection
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => setPaginationModel(model)}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          getRowId={(row) => row.its}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              color: yellow[400],
            },
            '& .MuiDataGrid-columnHeader:focus, .MuiDataGrid-columnHeader:focus-within': {
              outline: 'none',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
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
      </Paper>

      {/* Dialog for HOF Switch Confirmation */}
      <Dialog open={openDialog} onClose={cancelSwitchHOF}>
        <DialogTitle>Are you sure you want to switch HOF?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You are about to switch the HOF for the member with ITS?.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelSwitchHOF} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmSwitchHOF} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </AppTheme>
  );
};

export default FamilyDetails;
