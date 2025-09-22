import React, { useState } from 'react';
import {
  Menu, MenuItem, IconButton, Avatar, Typography, Button, CssBaseline, Snackbar, Alert
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import AppTheme from '../../styles/AppTheme';

import ChangePasswordDialog from './ChangePasswordDialog'; // <- import your dialog

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(1),
  },
}));

const StyledLogoutButton = styled(Button)(({ theme }) => ({
  color: theme.palette.error.main,
  fontWeight: 'bold',
  textTransform: 'none',
  backgroundColor: 'transparent',
  padding: 0,
  '&:hover': { backgroundColor: 'transparent' },
}));

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const navigate = useNavigate();
  const { logout, user } = useUser();

  const userName = user?.name || '';
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';
  const userPhoto = user?.photo;

  // Change Password dialog + snackbars
  const [cpOpen, setCpOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' | 'error' | 'warning' | 'info'

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleOpenChangePassword = () => {
    // close menu then open dialog
    handleClose();
    setCpOpen(true);
  };

  return (
    <AppTheme>
      <CssBaseline />
      <div>
        <IconButton onClick={handleClick}>
          <Avatar
            src={userPhoto && userPhoto !== 'null' && userPhoto !== '' ? userPhoto : undefined}
            sx={{
              bgcolor: '#8B5E3C',
              color: '#FFFFFF',
              width: 30,
              height: 30,
              fontSize: '0.9rem',
            }}
          >
            {!userPhoto || userPhoto === 'null' || userPhoto === '' ? userInitial : null}
          </Avatar>
        </IconButton>

        <StyledMenu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleClose}>
            <SettingsIcon sx={{ mr: 1 }} />
            <Typography variant="body1">Profile Settings</Typography>
          </MenuItem>

          <MenuItem onClick={handleOpenChangePassword}>
            <LockResetIcon sx={{ mr: 1 }} />
            <Typography variant="body1">Change Password</Typography>
          </MenuItem>

          <MenuItem onClick={handleLogout}>
            <StyledLogoutButton startIcon={<LogoutIcon />}>Logout</StyledLogoutButton>
          </MenuItem>
        </StyledMenu>

        {/* Change Password Dialog */}
        <ChangePasswordDialog
          open={cpOpen}
          onClose={() => setCpOpen(false)}
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarSeverity={setSnackbarSeverity}
          // Optional: override endpoint via prop (defaults inside dialog)
          // endpoint={`${import.meta.env.VITE_API_URL}/auth/change-password`}
        />

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </AppTheme>
  );
}
