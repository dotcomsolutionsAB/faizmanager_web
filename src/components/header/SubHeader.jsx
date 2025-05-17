import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import { useState, useEffect } from 'react';
import { Select, InputLabel, OutlinedInput, CssBaseline } from '@mui/material';
import AppTheme from '../../styles/AppTheme';
import { useUser } from '../../UserContext';
import { useLocation } from 'react-router-dom';

export default function SubHeader({ selectedYear, setSelectedYear }) {
  const theme = useTheme();
  const { token } = useUser();
  const location = useLocation(); // Hook to get the current route

  const [years, setYears] = useState([]);
  const [loadingYears, setLoadingYears] = useState(false);

  // const isDashboard = location.pathname === '/dashboard'; // Check if the current route is the dashboard
  const showYearSelect = ['/dashboard', '/receipts', '/payments', '/expenses'].includes(location.pathname);


  console.log("years", years);
const handleYearChange = (event) => {
  setSelectedYear(event.target.value); // now a string, not an array
};


  useEffect(() => {
    if (token) {
      const fetchYears = async () => {
        setLoadingYears(true);
        try {
          const response = await fetch('https://api.fmb52.com/api/year', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch years');
          }

          const data = await response.json();
          if (data?.data) {
            const currentYear = data.data.find((year) => year.is_current === '1');
            if (currentYear) {
              setSelectedYear(currentYear.year);
            }
            setYears(data.data);
          } else {
            console.error('No years found');
          }
        } catch (error) {
          console.error('Error fetching years:', error);
        } finally {
          setLoadingYears(false);
        }
      };
      fetchYears();
    }
  }, [token]);

  return (
    // <AppTheme>
    //   <CssBaseline />
    //   <Box
    //     sx={{
    //       mt: 8,
    //       p: 1,
    //       pl: 3,
    //       pr: 3,
    //       width: '96.5%',
    //       backgroundColor: theme.palette.background.paper,
    //       color: theme.palette.text.primary,
    //       boxShadow: theme.shadows[1],
    //       display: 'flex',
    //       flexDirection: 'row',
    //       alignItems: 'center',
    //       justifyContent: 'space-between',
    //       position: 'fixed',
    //       zIndex: 1100,
    //       '@media (max-width: 1100px)': {
    //         pr: 4, // Maintain consistent padding-right for smaller screens
    //       },
    //     }}
    //   >
        // <Typography
        //   variant="h6"
        //   sx={{
        //     fontWeight: 'bold',
        //     color: theme.palette.text.secondary,
        //     mr: 'auto',
        //   }}
        // >
        //   <NavbarBreadcrumbs />
        // </Typography>
    //     {/* Render Year Selection only on the dashboard */}
        // {isDashboard && (
        //   <div>
        //     <FormControl
        //       sx={{
        //         m: 1,
        //         width: { xs: '100%', sm: '22ch', md: '25ch' },
        //         maxWidth: '100%',
        //       }}
        //       fullWidth
        //     >
        //       <InputLabel id="demo-multiple-name-label">Select Year</InputLabel>
        //       <Select
        //         label="Select Year"
        //         labelId="year-select-label"
        //         multiple
        //         value={selectedYear}
        //         onChange={handleYearChange}
        //         input={<OutlinedInput label="Year" />}
        //       >
        //         {years.map((year) => (
        //           <MenuItem key={year.year} value={year.year}>
        //             {year.year}
        //           </MenuItem>
        //         ))}
        //       </Select>
        //     </FormControl>
        //   </div>
        // )}
    //   </Box>
    // </AppTheme>
    <AppTheme>
      <CssBaseline />
    <Box sx={{ position: 'fixed',
    top: 64, // height of your main header (adjust if needed)
    width: '100%',
    zIndex: 1100,
    padding: 1,
    pr: 10,
    backgroundColor: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[1] }}>
      {/* Breadcrumb and Year Selector Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Breadcrumbs */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.text.secondary,
            mr: 'auto',
          }}
        >
          <NavbarBreadcrumbs />
        </Typography>

        {/* Year Selector */}
        {showYearSelect && (
          <div>
            <FormControl
              sx={{
                m: 1,
                width: { xs: '100%', sm: '22ch', md: '22ch' },
                maxWidth: '100%',
              }}
              fullWidth
            >
              <InputLabel id="demo-multiple-name-label">Select Year</InputLabel>
              <Select
                label="Select Year"
                labelId="year-select-label"
                value={selectedYear}
                onChange={handleYearChange}
                input={<OutlinedInput label="Year" />}
              >
                {years.map((year) => (
                  <MenuItem key={year.year} value={year.year}>
                    {year.year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}
      </Box>
    </Box>
    </AppTheme>
  );
}
