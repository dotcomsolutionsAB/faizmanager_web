import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Stack,
} from '@mui/material';
import { yellow } from '../../styles/ThemePrimitives';
import { useUser } from '../../contexts/UserContext';

function SectorDetailsForm({familyId}) {  // default user ID or pass as prop
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
 
  const {token} =  useUser();

  const sectors = ['BURHANI', 'SAIFEE', 'TAHREEQ'];
  const subSectors = ['AA', 'BB', 'CC'];
  const deliveryPersons = ['Person 1', 'Person 2', 'Person 3'];

  const handleInputChange = (field, value) => {
    setSectorDetails((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`https://api.fmb52.com/api/mumeneen/user/${familyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        if (result.status && result.data) {
          const data = result.data;

          setSectorDetails({
            sector: data.sector_name || '',
            subSector: data.sub_sector_name || '',
            folio: data.folio_no || '',
            building: data.building || '',
            flatNo: data.flat_no || '',
            address1: data.address1 || '',
            address2: data.address2 || '',
            pincode: data.pincode || '',
            city: data.city || '',
            deliveryPerson: data.delivery_person || '',
          });
        } else {
          console.error('Failed to fetch user data:', result.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();
  }, [familyId, token]);

  const handleSubmit = () => {
    console.log(sectorDetails);
    // Here you can call API to save/update sectorDetails
  };

  return (
    <Paper
      sx={{
        mt: 2,
        p: 4,
        borderRadius: '8px',
        backgroundColor: '#F7F4F1',
        minHeight: '595px'
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          {/* Optional header */}
        </Box>
      </Stack>

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
          fullWidth
          InputProps={{
            sx: {
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              mb: '7px',
              border: `1px solid ${yellow[400]}`,
            },
          }}
        >
          {sectors.map((sec) => (
            <MenuItem key={sec} value={sec}>{sec}</MenuItem>
          ))}
        </TextField>

        {/* Sub Sector */}
        <TextField
          select
          label="Sub Sector"
          value={sectorDetails.subSector}
          onChange={(e) => handleInputChange('subSector', e.target.value)}
          fullWidth
          InputProps={{
            sx: {
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              mb: '7px',
              border: `1px solid ${yellow[400]}`,
            },
          }}
        >
          {subSectors.map((sub) => (
            <MenuItem key={sub} value={sub}>{sub}</MenuItem>
          ))}
        </TextField>

        {/* Folio */}
        <TextField
          label="Folio"
          value={sectorDetails.folio}
          onChange={(e) => handleInputChange('folio', e.target.value)}
          fullWidth
          InputProps={{
            sx: {
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              mb: '7px',
              border: `1px solid ${yellow[400]}`,
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
            fullWidth
            InputProps={{
              sx: {
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                mb: '7px',
                border: `1px solid ${yellow[400]}`,
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
          fullWidth
          InputProps={{
            sx: {
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              mb: '7px',
              border: `1px solid ${yellow[400]}`,
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

      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'bold',
            backgroundColor: yellow[400],
            '&:hover': {
              backgroundColor: yellow[100],
              color: '#000',
            },
          }}
        >
          Save
        </Button>
      </Box>
    </Paper>
  );
}

export default SectorDetailsForm;
