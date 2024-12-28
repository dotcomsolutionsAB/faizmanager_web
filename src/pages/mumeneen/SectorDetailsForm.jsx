import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Stack,
  Menu,
  MenuItem as MuiMenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled, useTheme } from '@mui/material/styles';

const StyledTransferButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 'bold',
    border: `1px solid #a98260`, // Match the datepicker's border color
    borderRadius: '8px',
    margin: 6,
    backgroundColor: '#ffffff',
    color: '#5a4037',
    '&:hover': {
      backgroundColor: '#f5e4d2', // Light brown shade on hover
      borderColor: '#a98260',
    },
  }));


function SectorDetailsForm() {
  const [sectorDetails, setSectorDetails] = useState({
    sector: '',
    subSector: '',
    folio: '',
    building: '',
    flatNo: '',
    address1: '',
    address2: '',
    pincode: '',
    city: '',
    deliveryPerson: '',
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const sectors = ['BURHANI', 'SAIFEE', 'TAHREEQ'];
  const subSectors = ['AA', 'BB', 'CC'];
  const deliveryPersons = ['Person 1', 'Person 2', 'Person 3'];
  const transferOptions = ['Other sector', 'Other sub-sector', 'Out of jamiat'];

  const handleInputChange = (field, value) => {
    setSectorDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log(sectorDetails);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTransferOption = (option) => {
    if (option === 'Other sector') {
      setDialogOpen(true);
    }
    setAnchorEl(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: '8px',
        backgroundColor: '#F7F4F1',
      }}
    >
      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
            You can view and update sector details over here.
          </Typography>
        </Box>

        {/* Transfer Dropdown */}
        {/* <Box>
        <StyledTransferButton
            endIcon={<MoreVertIcon />}
            onClick={handleMenuOpen}
          >
            Transfer
          </StyledTransferButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              '& .MuiPaper-root': {
                border: '1px solid #e0e0e0', // Matches the dropdown border
                borderRadius: '8px', // Smooth border radius for the dropdown
              },
            }}
          >
            {transferOptions.map((option, index) => (
              <MuiMenuItem
                key={index}
                onClick={() => handleTransferOption(option)}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f5f5f5', // Light hover effect
                    color: '#333', // Keep text color consistent on hover
                  },
                }}
              >
                {option}
              </MuiMenuItem>
            ))}
          </Menu>
        </Box> */}
      </Stack>

      {/* Transfer Dialog */}
      {/* <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Transfer Family</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Select Sector"
            value={sectorDetails.sector}
            onChange={(e) => setSectorDetails({ ...sectorDetails, sector: e.target.value })}
            helperText="Please select the sector to which the family is to be transferred.."
            fullWidth
            margin="dense"
            InputProps={{
                sx: {
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  mb: '7px',
                },
              }}    
          >
            {sectors.map((sector, index) => (
              <MenuItem key={index} value={sector}>
                {sector}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            variant="contained"
            sx={{
                margin: 2,
                padding: 2,
              backgroundColor: '#795548', // Matches your theme
              '&:hover': {
                backgroundColor: '#5a4037',
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* Form Section */}
      <Box
        component="form"
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
        }}
        noValidate
        autoComplete="off"
      >
        {/* Sector */}
        <TextField
          select
          label="Sector"
          value={sectorDetails.sector}
          onChange={(e) => handleInputChange('sector', e.target.value)}
        //   helperText="Enter sector name.."
          fullWidth
          InputProps={{
            sx: {
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              mb: '7px',
            },
          }}
        >
          {sectors.map((sector, index) => (
            <MenuItem key={index} value={sector}>
              {sector}
            </MenuItem>
          ))}
        </TextField>

        {/* Sub Sector */}
        <TextField
          select
          label="Sub Sector"
          value={sectorDetails.subSector}
          onChange={(e) => handleInputChange('subSector', e.target.value)}
        //   helperText="Enter sub sector name.."
          fullWidth
          InputProps={{
            sx: {
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              mb: '7px',
            },
          }}
        >
          {subSectors.map((subSector, index) => (
            <MenuItem key={index} value={subSector}>
              {subSector}
            </MenuItem>
          ))}
        </TextField>

        {/* Folio */}
        <TextField
          label="Folio"
          value={sectorDetails.folio}
          onChange={(e) => handleInputChange('folio', e.target.value)}
        //   helperText="Enter folio number.."
          fullWidth
          InputProps={{
            sx: {
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              mb: '7px',
            },
          }}
        />

        {/* Remaining Fields */}
        {['Building', 'Flat No', 'Address 1', 'Address 2', 'Pincode', 'City'].map((field, index) => (
          <TextField
            key={index}
            label={field}
            value={sectorDetails[field.toLowerCase().replace(' ', '')]}
            onChange={(e) => handleInputChange(field.toLowerCase().replace(' ', ''), e.target.value)}
            // helperText={`Enter ${field.toLowerCase()}..`}
            fullWidth
            InputProps={{
              sx: {
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                mb: '7px',
              },
            }}
          />
        ))}

        {/* Delivery Person */}
        <TextField
          select
          label="Delivery Person"
          value={sectorDetails.deliveryPerson}
          onChange={(e) => handleInputChange('deliveryPerson', e.target.value)}
        //   helperText="Enter delivery person name.."
          fullWidth
          InputProps={{
            sx: {
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              mb: '7px',
            },
          }}
        >
          {deliveryPersons.map((person, index) => (
            <MenuItem key={index} value={person}>
              {person}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={handleSubmit}
          sx={{
            borderRadius: '15px',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#45c162',
            },
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Paper>
  );
}

export default SectorDetailsForm;
