import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon /> },
  { text: 'Analytics', icon: <AnalyticsRoundedIcon /> },
  { text: 'Clients', icon: <PeopleRoundedIcon /> },
  { text: 'Tasks', icon: <AssignmentRoundedIcon /> },
  { text: 'Settings', icon: <SettingsRoundedIcon /> },
  { text: 'About', icon: <InfoRoundedIcon /> },
  { text: 'Feedback', icon: <HelpRoundedIcon /> },
];

export default function MenuContent({ open }) {
  return (
    <Stack
      sx={{
        flexGrow: 1,
        p: open ? 2 : 1, // Padding adjustments based on open state
        justifyContent: 'space-between',
      }}
    >
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block', pt: open ? 1 : 2 }}>
            <ListItemButton 
              selected={index === 0} 
              sx={{
                px: 2,
                justifyContent: open ? 'flex-start' : 'center', // Center icons when closed
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0, // Remove default padding around icon
                  mr: open ? '2' : '2', // Add spacing only when open
                  justifyContent: 'center',
                  fontSize: open ? 'default' : '1.5rem', // Larger icon when closed
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} />} {/* Show text only when open */}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
