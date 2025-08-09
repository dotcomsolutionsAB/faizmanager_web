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
import { useUser } from '../../../contexts/UserContext';

const UserAccessDeleteDialog = ({ open,
  onClose,
  userId,
  onConfirm,
  setSnackbarOpen,
  setSnackbarMessage,
  setSnackbarSeverity, }) => {
  const { token } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const handleSave = async () => {
  setLoading(true);
  setError(null);
console.log(userId)
  try {
    const response = await fetch("https://api.fmb52.com/api/users/permissions/delete", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete permissions. Status: ${response.status}`);
    }

    const data = await response.json();

    // ✅ Show success snackbar
    setSnackbarMessage("Permissions deleted successfully.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);

    if (onConfirm) onConfirm(); // Optional: refresh parent table
    onClose(); // Close dialog
  } catch (err) {
    console.error("Delete error:", err);
    setError("Failed to delete user permissions.");
    setSnackbarMessage("Failed to delete permissions.");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  } finally {
    setLoading(false);
  }
};


  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Permissions</DialogTitle>
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
            Are you sure you want to delete this user's permissions?
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
          {loading ? 'Deleting...' : 'Yes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserAccessDeleteDialog;
