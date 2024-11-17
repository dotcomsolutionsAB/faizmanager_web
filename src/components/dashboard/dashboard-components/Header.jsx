import * as React from 'react';
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import CustomDatePicker from './CustomDatePicker';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import MenuButton from './MenuButton';
import { useTheme } from '@mui/material/styles';
import { useUser } from '../../../UserContext';
import { Box, Typography, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import UserMenu from './UserMenu';


// import Search from './Search';

const UserBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1), // Consistent spacing
  color: theme.palette.primary.main, // Align text color with theme primary
}));

export default function Header() {
  const { user } = useUser();
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '103.95%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        backgroundColor: theme.palette.background.paper, // Use color matching the login page
        color: theme.palette.text.primary, // Ensure text color contrasts well
        boxShadow: theme.shadows[2], // Add slight shadow for separation
        borderRadiusBottomright: 1, // Optional: round the edges slightly
        borderRadiusBottomleft: 1, // Optional: round the edges slightly
        px: 2, // Optional padding on the left and right
        pt: 2, // Increase top padding
        pb: 2, // Increase bottom padding
        minHeight: '64px',
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs />
      <Stack direction="row" sx={{ gap: 1 }}>
        {/* <Search /> */}

        <CustomDatePicker />

        <MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton>
        {/* <ColorModeIconDropdown /> */}
        {user && (
        <UserBox>
          <Typography variant="h6" color="text.primary" fontSize="1rem">
            Hi, {user.name.split(' ')[0]}
          </Typography>
          <UserMenu user={user} />
          {/* <Avatar
            sx={{
              bgcolor: theme.palette.primary.main, // Primary theme color for avatar background
              width: 32, // Smaller size for avatar
              height: 32, // Smaller size for avatar
              fontSize: '0.9rem', // Adjust font size to fit smaller avatar
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar> */}
        </UserBox>
      )}
      </Stack>
    </Stack>
  );
}