import * as React from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '../../components/commons/sidebar/AppNavbar';
import Header from '../../components/commons/header/Header';
import MainGrid from '../../components/dashboard/dashboard-components/MainGrid';
import SideMenu from '../../components/commons/sidebar/SideMenu';
import SubHeader from '../../components/commons/header/SubHeader';
import AppTheme from '../../../styles/AppTheme';
import { chartsCustomizations } from '../../components/dashboard/customizations/Charts';
import { dataGridCustomizations } from '../../components/dashboard/customizations/DataGrid';
import { datePickersCustomizations } from '../../components/dashboard/customizations/DatePicker';
import { treeViewCustomizations } from '../../components/dashboard/customizations/TreeView';
import { useLocation } from 'react-router-dom';
import MumeneenTable from '../../components/mumeneen/MumeneenTable';
import bg3 from '../../../assets/bg3.jpg';
import Copyright from '../../components/commons/footer/Copyright';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import { useState, useEffect } from 'react';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props) {
  const location = useLocation();
  const username = location.state?.username || 'User';
  const [loading, setLoading] = React.useState(true);
  const [isSideMenuOpen, setIsSideMenuOpen] = React.useState(true);


  const [selectedSector, setSelectedSector] = useState('');
  const [selectedSubSector, setSelectedSubSector] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const handleFilterChange = (sector, subSector, year) => {
    console.log('Filters Updated:', { sector, subSector, year });
    setSelectedSector(sector);
    setSelectedSubSector(subSector);
    setSelectedYear(year);

  };

  // Simulate loading state for demonstration
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Simulate loading complete
    }, 2000); // Set a timeout or use actual data fetch logic
  }, []);

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', width: '100%' }}>
        <SideMenu open={isSideMenuOpen} setOpen={setIsSideMenuOpen} />
        <AppNavbar username={username} />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => {
            return ({
              flexGrow: 1,
              backgroundImage: `url(${bg3})`, // Replace with the actual path to your image
              backgroundSize: 'cover', // Ensures the image covers the entire area
              backgroundRepeat: 'no-repeat', // Prevents tiling of the image
              backgroundPosition: 'center', // Centers the image
            });
          }}
        >
          <Header 
           open={isSideMenuOpen} setOpen={setIsSideMenuOpen}
          selectedSector={selectedSector}
        selectedSubSector={selectedSubSector}
        selectedYear={selectedYear}
        handleFilterChange={handleFilterChange}/>
          {loading ? (
            <Stack
              spacing={2}
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
              }}
            >
              <CircularProgress /> {/* Displaying the loading icon */}
            </Stack>
          ) : (
            <Stack
              spacing={2}
              sx={{
                alignItems: 'center',
                mx: 3,
                pb: 2,
                mt: { xs: 8, md: 1 },
                minHeight: '700px',
              }}
            >
              {/* <SubHeader /> */}
              <MainGrid
              selectedSector={selectedSector.length > 0 ? selectedSector : ['all']} 
              selectedSubSector={selectedSubSector.length > 0 ? selectedSubSector : ['all']}
              selectedYear={selectedYear || 'all'}
              />
            </Stack>
          )}
          <Copyright />
        </Box>
      </Box>
    </AppTheme>
  );
}
