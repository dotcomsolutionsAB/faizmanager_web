// src/components/mumeneenTable/MarkAsInactive.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import divider from '../../assets/divider.png';
import { useUser } from '../../contexts/UserContext';

const MarkAsInactive = ({ open, onClose, row, onSuccess }) => {
  const { token } = useUser();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const handleSave = async () => {
    if (!row || !row.id || !token) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.fmb52.com/api/mumeneen/deactivate/${row.id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      const json = await response.json();

      if (!response.ok || json.success === false) {
        throw new Error(json.message || 'Failed to mark as inactive.');
      }

      setSnackbar({
        open: true,
        message: json.message || 'This FM has been marked as in_active.',
        severity: 'success',
      });

      // Let parent refresh
      if (onSuccess) onSuccess(json);

      // Close dialog
      onClose();
    } catch (error) {
      console.error('Deactivate error:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Something went wrong while deactivating.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Mark Mumin as Inactive</DialogTitle>
        <Box
          sx={{
            width: 'calc(100% + 24px)',
            position: 'relative',
            height: 15,
            backgroundImage: `url(${divider})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'center',
            marginLeft: '-24px',
            marginRight: '-24px',
          }}
        />
        <DialogContent>
          <Box
            component={Paper}
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: '#F7F4F1',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
              Are you sure you want to mark this mumin as inactive?
            </Typography>
            {row && (
              <Typography variant="body1" sx={{ color: '#555' }}>
                <strong>Name:</strong> {row.name} <br />
                <strong>ITS:</strong> {row.its}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="primary" variant="outlined" disabled={loading}>
            No
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained" disabled={loading || !row}>
            {loading ? 'Processing...' : 'Yes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        sx={{ height: '100%' }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        autoHideDuration={4000}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MarkAsInactive;
