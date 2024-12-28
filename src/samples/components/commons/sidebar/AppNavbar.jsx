import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MuiToolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import SideMenuMobile from './SideMenuMobile';
import MenuButton from './MenuButton';
import { useUser } from '../../../UserContext';
import { yellow } from '../../login/ThemePrimitives'; 
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

// Define Toolbar styles
const Toolbar = styled(MuiToolbar)({
  width: '100%',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '12px',
  flexShrink: 0,
});

export default function AppNavbar() {
  const [open, setOpen] = React.useState(false);
  const { user } = useUser();
  const location = useLocation();

  const sectors = ['Sector 1', 'Sector 2', 'Sector 3'];
  const subSectors = ['Sub Sector 1', 'Sub Sector 2', 'Sub Sector 3'];
  const years = ['2023', '2024', '2025'];

  const [selectedSector, setSelectedSector] = React.useState('');
  const [selectedSubSector, setSelectedSubSector] = React.useState('');
  const [selectedYear, setSelectedYear] = React.useState('');

  // Map route titles and icons
  const routeTitles = {
    '/dashboard': { title: 'Dashboard', icon: <DashboardRoundedIcon /> },
    '/thali-information/mumeneen': { title: 'Mumeneen', icon: <PeopleRoundedIcon /> },
    '/settings': { title: 'Settings', icon: <SettingsRoundedIcon /> },
  };

  // Get the current title and icon
  const currentRoute = routeTitles[location.pathname] || { title: 'App', icon: <DashboardRoundedIcon /> };
  const { title, icon } = currentRoute;

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  console.log('AppNavbar received user:', user?.name);

  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: 'auto', md: 'none' },
        boxShadow: 0,
        bgcolor: 'background.paper',
        backgroundImage: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        top: 'var(--template-frame-height, 0px)',
      }}
    >
      <Toolbar variant="regular">
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flexGrow: 1,
            width: '100%',
            gap: 1,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: 'center', mr: 'auto' }}
          >
            <Box
              sx={{
                width: '1.5rem',
                height: '1.5rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                color: yellow[300],
              }}
            >
              {icon}
            </Box>
            <Typography variant="h4" component="h1" sx={{ color: 'text.primary' }}>
              {title}
            </Typography>
            
          </Stack>
           {/* Sector Select */}
      <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
        <TextField
          select
          label="Select Sector"
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1 }}
        >
          {sectors.map((sector, index) => (
            <MenuItem key={index} value={sector}>
              {sector}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>

       {/* Sub-Sector Select */}
       <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
        <TextField
          select
          label="Select Sub-Sector"
          value={selectedSubSector}
          onChange={(e) => setSelectedSubSector(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1 }}
        >
          {subSectors.map((subSector, index) => (
            <MenuItem key={index} value={subSector}>
              {subSector}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
       {/* Year Select */}
       <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
        <TextField
          select
          label="Select Year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1 }}
        >
          {years.map((year, index) => (
            <MenuItem key={index} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
          <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuRoundedIcon />
          </MenuButton>
          <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

AppNavbar.propTypes = {
  username: PropTypes.string, // Add PropTypes validation
};
