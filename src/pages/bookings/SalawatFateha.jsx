import React from 'react';
import { Box, CssBaseline, Typography } from '@mui/material';
import underConstruction from '../../assets/underConstruction.svg'; // Replace with your actual image path
import AppTheme from '../../styles/AppTheme';

export default function SalawatFateha() {
  
  return (
    <AppTheme>
        <CssBaseline />
        <Box sx={{ width: "100%",  mt: 11, pt: 9, pr: 3, pb: 3 , pl: 3}}>
        <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        padding: 2,
      }}
    >
      {/* Image */}
      <Box
        component="img"
        src={underConstruction}
        alt="Under Construction"
        sx={{
          width: '200px',
          marginBottom: 2,
        }}
      />

      {/* Title */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
        We’re working hard to bring this page to life.
      </Typography>

      {/* Message */}
      <Typography variant="body1" sx={{ color: '#555' }}>
        Thank you for your patience as we build something amazing. <br />
        Stay tuned!
      </Typography>
    </Box>
        </Box>
    </AppTheme>
  );
}
