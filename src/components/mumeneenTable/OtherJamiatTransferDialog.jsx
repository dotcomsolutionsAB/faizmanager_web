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

const OtherJamiatTransferDialog = ({ open, onClose, row }) => {
    const {token} = useUser();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const familyId = row?.family_id;

  const handleSave = async () => {
    if (!row || !familyId) {
  setSnackbar({ open: true, message: 'Family ID is missing.', severity: 'error' });
  return;
}


    setLoading(true);
    try {
      const response = await fetch(`https://api.fmb52.com/api/mumeneen/transfer_out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header here if required, e.g.
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ family_id: familyId }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show error from API
        setSnackbar({ open: true, message: data.message || 'Failed to transfer family.', severity: 'error' });
      } else {
        // Success: optionally call onSave or close dialog
        setSnackbar({ open: true, message: 'Family transferred successfully.', severity: 'success' });
        onClose();
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Network error. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Other Jamiat Transfer</DialogTitle>
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
              Are you sure you want to transfer this family out of jamiat?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="primary" variant="outlined" disabled={loading}>
            No
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained" disabled={loading}>
            {loading ? 'Transferring...' : 'Yes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        sx={{ height: "100%"}}
   anchorOrigin={{
      vertical: "top",
      horizontal: "center"
   }}

      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default OtherJamiatTransferDialog;
