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
  TextField,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import divider from '../../assets/divider.png';
import { useUser } from '../../contexts/UserContext';

const ChangePasswordDialog = ({
  open,
  onClose,
  setSnackbarOpen,
  setSnackbarMessage,
  setSnackbarSeverity,
  endpoint,
}) => {
  const { token } = useUser();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [logoutOthers, setLogoutOthers] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



const validate = () => {
  if (!password || !confirm) return 'Please fill both fields.';

  if (password.length < 8) return 'Password must be at least 8 characters.';

  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';

  if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';

  if (password !== confirm) return 'Passwords do not match.';

  return null;
};


const handleSave = async () => {
  const v = validate();
  if (v) {
    setError(v);
    return;
  }
  setError(null);
  setLoading(true);

  try {
    const payload = {
      password,
      confirm_password: confirm,
      logout_others: logoutOthers,
    };
    const res = await fetch(`https://api.fmb52.com/api/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      },
       body: JSON.stringify(payload), 
    });

    const data = await res.json();

    if (!res.ok || data.success === false) {
      const message = data?.message || 'Failed to change password.';
      throw new Error(message);
    }

    setSnackbarSeverity('success');
    setSnackbarMessage(data?.message || 'Password updated successfully.');
    setSnackbarOpen(true);

    // reset state and close
    setPassword('');
    setConfirm('');
    setLogoutOthers(false);
    onClose?.();
  } catch (e) {
    const msg = e.message || 'Failed to change password.';
    setError(msg);
    setSnackbarSeverity('error');
    setSnackbarMessage(msg);
    setSnackbarOpen(true);
  } finally {
    setLoading(false);
  }
};


  const handleClose = () => {
    if (loading) return;
    setError(null);
    setPassword('');
    setConfirm('');
    setLogoutOthers(false);
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change Password</DialogTitle>

      <Box
        sx={{
          width: 'calc(100% + 24px)',
          position: 'relative',
          height: 15,
          backgroundImage: `url(${divider})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center',
          ml: '-24px',
          mr: '-24px',
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
            gap: 2.5,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
            Set a new password
          </Typography>

          <TextField
            label="New Password"
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            size="small"
            autoFocus
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPw((p) => !p)} edge="end" disableRipple
  sx={{
    border: 'none',
    backgroundColor: 'transparent',
     '&:hover': { backgroundColor: 'transparent' },
    p: 0
  }}>
                    {showPw ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirm New Password"
            type={showConfirm ? 'text' : 'password'}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm((p) => !p)} edge="end" disableRipple
  sx={{
    border: 'none',
    backgroundColor: 'transparent',
     '&:hover': { backgroundColor: 'transparent' },
    p: 0
  }}>
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={logoutOthers}
                onChange={(e) => setLogoutOthers(e.target.checked)}
              />
            }
            label="Log out other devices after password change"
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} color="primary" variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained" disabled={loading}>
          {loading ? 'Updating…' : 'Update Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordDialog;
