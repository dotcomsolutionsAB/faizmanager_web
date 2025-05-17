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
import { yellow } from '../../styles/ThemePrimitives';


function ThaliDetails() {


  return (
    <AppTheme>
      <CssBaseline />
      <Paper
        sx={{
          mt: 2,
          p: 4,
          borderRadius: '8px',
          // boxShadow: 3,
          backgroundColor: '#F7F4F1',
          // maxWidth: '800px',
          // margin: '20px auto',
          minHeight: '595px',
        }}
      >
        {/* <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        HOF Details
      </Typography> */}
        {/* <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
        You can view and update HOF details over here.
      </Typography> */}
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

          {/* Name */}
          <TextField
            label="Current Hub"

            //   helperText="Enter HOF full name.."
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

          {/* ITS */}
          <TextField
            label="Previous Tanzeem Hub"

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
          <TextField
            select
            label="Thali Status"
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

          </TextField>


        </Box>
        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 'bold',
              backgroundColor: yellow[400], // Apply yellow theme color
              '&:hover': {
                backgroundColor: yellow[100], // Hover effect color
                color: '#000',
              },
            }}
          >
            Save
          </Button>
        </Box>
      </Paper>
    </AppTheme>
  );
}

export default ThaliDetails;
