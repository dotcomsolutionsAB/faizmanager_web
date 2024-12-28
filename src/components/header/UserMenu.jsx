import React, { useState } from 'react';
import { Menu, MenuItem, IconButton, Avatar, Typography, Button, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings'; // Icon for Profile Settings
import LogoutIcon from '@mui/icons-material/Logout'; // Icon for Logout
import { useNavigate } from 'react-router-dom'; // For navigation
import { useUser } from '../../UserContext'; // Import your UserContext
import AppTheme from '../../styles/AppTheme';

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
    backgroundColor: 'transparent', // Ensure the background is transparent
    padding: 0, // Remove default padding
    '&:hover': {
      backgroundColor: 'transparent', // Prevent background on hover
    },
  }));

export default function UserMenu() {
  // console.log("Usermenu received:", user)

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const navigate = useNavigate();
  const { logout, user } = useUser(); // Access the logout function from UserContext
  const userName = user?.name || ''; // Default to an empty string if name is undefined
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U'; // Fallback to 'U' if no name
  const userPhoto = user?.photo; // Retrieve photo URL if available
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout(); // Clear user and token from context and localStorage
    navigate('/'); // Redirect to the login page
  };

  console.log("user initial", userInitial)
  return (

    <AppTheme>
      <CssBaseline />
    <div>
      <IconButton onClick={handleClick}>
      <Avatar
  src={userPhoto && userPhoto !== 'null' && userPhoto !== '' ? userPhoto : undefined}
  sx={{
    bgcolor: '#8B5E3C', // Brown background color
    color: '#FFFFFF',   // White text color for initials
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
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleClose}>
          <SettingsIcon sx={{ marginRight: 1 }} /> {/* Icon for Profile Settings */}
          <Typography variant="body1">Profile Settings</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <StyledLogoutButton startIcon={<LogoutIcon />}>
            Logout
          </StyledLogoutButton>
        </MenuItem>
      </StyledMenu>
    </div>
    </AppTheme>
  );
}
