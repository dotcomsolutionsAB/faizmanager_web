import React from 'react';
import { useLocation } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '../../components/commons/sidebar/AppNavbar';
import SideMenu from '../../components/commons/sidebar/SideMenu';
import Header from '../../components/commons/header/Header';
import MumeneenTable from '../../components/mumeneen/MumeneenTable';
import AppTheme from '../../../styles/AppTheme';
import bg3 from '../../../assets/bg3.jpg';
import Copyright from '../../components/commons/footer/Copyright';
import CircularProgress from '@mui/material/CircularProgress'; // For loading state
import { useState } from 'react';

export default function Mumeneen(props) {
  const location = useLocation();
  const username = location.state?.username || 'User';
  const [loading, setLoading] = React.useState(true);
  const [isSideMenuOpen, setIsSideMenuOpen] = React.useState(true);

  const [selectedSector, setSelectedSector] = useState('');
  const [selectedSubSector, setSelectedSubSector] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Simulate loading state
  React.useEffect(() => {
    setTimeout(() => setLoading(false), 2000); // Replace with actual data fetching
  }, []);

  // Handlers for filter changes
  const handleFilterChange = (sector, subSector, year) => {
    console.log('Filters Updated:', { sector, subSector, year });
    setSelectedSector(sector);
    setSelectedSubSector(subSector);
    setSelectedYear(year);

  };

  const resetFilters = () => {
    setSelectedSector('all');
    setSelectedSubSector('all');
    setSelectedYear('all');
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
      <SideMenu open={isSideMenuOpen} setOpen={setIsSideMenuOpen} />
        <AppNavbar username={username} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundImage: `url(${bg3})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            // overflow: 'auto',
            // paddingTop:'60px'
          }}
        >
          <Header
          open={isSideMenuOpen} setOpen={setIsSideMenuOpen}
           selectedSector={selectedSector}
        selectedSubSector={selectedSubSector}
        selectedYear={selectedYear}
        handleFilterChange={handleFilterChange} />
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 2,
              pt: {xs: 2, md: 1},
              mt: { xs: 8, md: 2 },
              minHeight: '700px',
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              <MumeneenTable
              selectedSector={selectedSector.length > 0 ? selectedSector : ['all']} 
              selectedSubSector={selectedSubSector.length > 0 ? selectedSubSector : ['all']}
              selectedYear={selectedYear || 'all'}
                onFilterChange={handleFilterChange}
                onResetFilters={resetFilters}
              />
            )}
          </Stack>
          <Copyright />
        </Box>
      </Box>
    </AppTheme>
  );
}
