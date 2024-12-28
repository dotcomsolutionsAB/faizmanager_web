import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  CssBaseline,
} from '@mui/material';
import AppTheme from '../../styles/AppTheme';

function HofDetailsForm() {
  const [hofDetails, setHofDetails] = useState({
    title: '',
    name: '',
    its: '',
    gender: '',
    mobile: '',
    email: '',
    dob: '',
  });

  const titles = ['Mr.', 'Mrs.', 'Dr.', 'Shaikh','Mulla'];
  const genders = ['Male', 'Female'];

  const handleInputChange = (field, value) => {
    setHofDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Add your submit logic here
    console.log(hofDetails);
  };

  return (
    <AppTheme>
        <CssBaseline />
        <Paper
      sx={{
        p: 4,
        borderRadius: '8px',
        // boxShadow: 3,
        backgroundColor: '#F7F4F1',
        // maxWidth: '800px',
        // margin: '20px auto',
      }}
    >
      {/* <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        HOF Details
      </Typography> */}
      <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
        You can view and update HOF details over here.
      </Typography>
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
        {/* Title */}
        <TextField
          select
          label="Title"
          value={hofDetails.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
        //   helperText="Enter HOF title.."
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
          {titles.map((title, index) => (
            <MenuItem key={index} value={title}>
              {title}
            </MenuItem>
          ))}
        </TextField>

        {/* Name */}
        <TextField
          label="Name"
          value={hofDetails.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        //   helperText="Enter HOF full name.."
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

        {/* ITS */}
        <TextField
          label="ITS"
          value={hofDetails.its}
          onChange={(e) => handleInputChange('its', e.target.value)}
        //   helperText="Enter HOF ITS.."
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

        {/* Gender */}
        <TextField
          select
          label="Gender"
          value={hofDetails.gender}
          onChange={(e) => handleInputChange('gender', e.target.value)}
        //   helperText="Enter HOF gender.."
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
          {genders.map((gender, index) => (
            <MenuItem key={index} value={gender}>
              {gender}
            </MenuItem>
          ))}
        </TextField>

        {/* Mobile */}
        <TextField
          label="Mobile"
          value={hofDetails.mobile}
          onChange={(e) => handleInputChange('mobile', e.target.value)}
        //   helperText="Enter HOF mobile number.."
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

        {/* Email */}
        <TextField
          label="Email"
          value={hofDetails.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
        //   helperText="Enter HOF email address.."
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

        {/* DOB */}
        <TextField
          label="DOB"
          type="date"
          value={hofDetails.dob}
          onChange={(e) => handleInputChange('dob', e.target.value)}
        //   helperText="Enter HOF date of birth.."
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            sx: {
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              mb: '7px',
            },
          }}
          fullWidth
        />
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
                backgroundColor: '#4caf50', // Adjusted hover color to a slightly darker green
              },
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Paper>
    </AppTheme>
  );
}

export default HofDetailsForm;
