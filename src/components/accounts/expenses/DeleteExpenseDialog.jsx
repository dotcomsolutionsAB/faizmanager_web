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
} from '@mui/material';
import divider from '../../../assets/divider.png';
import { useUser } from '../../../UserContext';

const DeleteExpenseDialog = ({ open,
  onClose,
  receiptId,
  onConfirm,
  setSnackbarOpen,
  setSnackbarMessage,
  setSnackbarSeverity, }) => {
  const { token } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!receiptId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.fmb52.com/api/receipts/${receiptId}`, {
        method: 'DELETE',  // Assuming DELETE is used to cancel receipt; if POST or PUT, change accordingly
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to cancel receipt: ${errorText || response.statusText}`);
      }

      // Show success snackbar
      setSnackbarMessage('Expense deleted successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      onConfirm(receiptId);
      onClose();
    } catch (err) {
      setError(err.message);

      // Show error snackbar
      setSnackbarMessage(`Error: ${err.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Expense</DialogTitle>
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
            gap: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
            Are you sure you want to delete this expense?
          </Typography>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="primary" variant="outlined" disabled={loading}>
          No
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained" disabled={loading}>
          {loading ? 'Cancelling...' : 'Yes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteExpenseDialog;
