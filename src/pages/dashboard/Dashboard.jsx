import * as React from 'react';

import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '../../components/dashboard/dashboard-components/AppNavbar';
import Header from '../../components/dashboard/dashboard-components/Header';
import MainGrid from '../../components/dashboard/dashboard-components/MainGrid';
import SideMenu from '../../components/dashboard/dashboard-components/SideMenu';
import SubHeader from '../../components/dashboard/dashboard-components/SubHeader';
import AppTheme from '../../components/login/AppTheme';
import { chartsCustomizations } from '../../components/dashboard/customizations/Charts';
import { dataGridCustomizations } from '../../components/dashboard/customizations/DataGrid';
import { datePickersCustomizations } from '../../components/dashboard/customizations/DatePicker';
import { treeViewCustomizations } from '../../components/dashboard/customizations/TreeView';
import { useLocation } from 'react-router-dom';
import MumeneenTable from '../../components/dashboard/dashboard-components/MumeneenTable';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props) {
  const location = useLocation();
  const username = location.state?.username || 'User';
  console.log('Dashboard received username:', username);
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar username={username} />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            // backgroundColor: theme.vars
            //   ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            //   : alpha(theme.palette.background.default, 1),
            backgroundColor: '#f8ecd7',
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
            //   pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <SubHeader />
            <MumeneenTable />
            <MainGrid />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}