import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; // For navigation
import { useUser } from '../../../UserContext'; // For user context

import MenuButton from './MenuButton';
import MenuContent from '../../../../components/sidebar/MenuContent';
import CardAlert from '../../dashboard/dashboard-components/CardAlert'

function SideMenuMobile({ open, toggleDrawer }) {
  const context = useUser(); // Get the user context
  const user = context?.user || {}; // Fallback to an empty object if context or user is null/undefined
  const logout = context?.logout; // Get the logout function from context
  const theme = useTheme();
  const navigate = useNavigate(); // For navigation

  const userName = user?.name || 'User'; // Default to 'User' if name is null or undefined
  const userAvatar = user?.avatar || '/static/images/avatar/7.jpg'; // Default avatar if avatar is null

  const handleLogout = () => {
    if (logout) {
      logout(); // Clear the user session
    }
    navigate('/'); // Redirect to the login page
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: '70dvw',
          height: '100%',
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
          >
            <Avatar
              alt={userName}
              src={userAvatar || "/static/images/avatar/7.jpg"} // Placeholder if no avatar is provided
              sx={{
                width: 36,
                height: 36,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}
            >
              {userName[0].toUpperCase()}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Hi, {userName.split(' ')[0]}
            </Typography>
          </Stack>
          <MenuButton showBadge>
            <NotificationsRoundedIcon />
          </MenuButton>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent open={true} />
          <Divider />
        </Stack>
        <Stack sx={{ p: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutRoundedIcon />}
            onClick={handleLogout} // Logout functionality
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}

SideMenuMobile.propTypes = {
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func.isRequired,
};

export default SideMenuMobile;
