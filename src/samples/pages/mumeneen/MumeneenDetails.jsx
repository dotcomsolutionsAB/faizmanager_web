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
import HofDetailsTable from '../../components/mumeneen/MumeneenDetailsTable';
import bg3 from '../../../assets/bg3.jpg'
import Copyright from '../../components/commons/footer/Copyright';
import MumeneenDetailsTable from '../../components/mumeneen/MumeneenDetailsTable';


const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function MumeneenDetails(props) {
  const location = useLocation();
  const username = location.state?.username || 'User';
  const [isSideMenuOpen, setIsSideMenuOpen] = React.useState(true);

  console.log('Dashboard received username:', username);
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu open={isSideMenuOpen} setOpen={setIsSideMenuOpen} />
        <AppNavbar username={username} />
        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            // backgroundColor: theme.vars
            //   ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            //   : alpha(theme.palette.background.default, 1),
            backgroundImage: `url(${bg3})`, // Replace with the actual path to your image
            backgroundSize: 'cover', // Ensures the image covers the entire area
            backgroundRepeat: 'no-repeat', // Prevents tiling of the image
            backgroundPosition: 'center', // Centers the image
          }}
        >
          <Header  open={isSideMenuOpen} setOpen={setIsSideMenuOpen} />

          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 2,
              pt: {xs: 2, md: 2},
              mt: { xs: 8, md: 2 },
              minHeight: '1050px',

            }}
          >
            {/* <SubHeader /> */}
            <MumeneenDetailsTable />
            {/* <MainGrid /> */}
          </Stack>
          <Copyright />

        </Box>
      </Box>
    </AppTheme>
  );
}