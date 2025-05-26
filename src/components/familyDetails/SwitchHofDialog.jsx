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
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import { useUser } from '../../UserContext'; // User context to get token
import divider from '../../assets/divider.png';

const SwitchHofDialog = ({ open, onClose, row, onSave }) => {
  const { token } = useUser();

  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false); // checkbox state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSave = async () => {
    if (!token || !row) return;

    setLoading(true);

    try {
      const response = await fetch('https://api.fmb52.com/api/mumeneen_switch_hof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          family_id: row.family_id,
          its: row.its,
          flag: flag ? 1 : 0,  // flag as 1 or 0
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Switch HOF failed');
      }

      const data = await response.json();

      setSnackbar({
        open: true,
        message: 'HOF switched successfully!',
        severity: 'success',
      });

      if (onSave) onSave(data);

      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'An error occurred',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Other Sector Transfer</DialogTitle>
        <Box
          sx={{
            width: 'calc(100% + 24px)',
            position: 'relative',
            height: { xs: 10, sm: 15, md: 15, lg: 15, xl: 15 },
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
              Are you sure you want to switch HOF?
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={flag}
                  onChange={(e) => setFlag(e.target.checked)}
                  name="removeHofFlag"
                />
              }
              label="Remove HOF along with switching"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="primary" variant="outlined" disabled={loading}>
            No
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained" disabled={loading}>
            {loading ? 'Switching...' : 'Yes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
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

export default SwitchHofDialog;
