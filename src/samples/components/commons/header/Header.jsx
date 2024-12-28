import * as React from 'react';
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { useTheme } from '@mui/material/styles';
import { useUser } from '../../../UserContext';
import { Box, Typography, MenuItem, CircularProgress, FormControl, TextField, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import UserMenu from './UserMenu';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import MenuButton from '../sidebar/MenuButton';
import CloseIcon from '@mui/icons-material/Close';  // Import Close Icon
import { useEffect } from 'react';

// Styled components
const UserBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.primary.main,
}));

export default function Header({ open, setOpen, selectedSector,
  selectedSubSector,
  selectedYear,
  handleFilterChange,}) {
    console.log('Received handleFilterChange:', handleFilterChange);
  const context = useUser();
  const user = context?.user || {};
  const theme = useTheme();
  const userName = user?.name || 'User';
  const token = context?.token;

  const [sectors, setSectors] = React.useState([]);
  const [subSectors, setSubSectors] = React.useState([]);
  const [years, setYears] = React.useState([]);
  const [loadingSectors, setLoadingSectors] = React.useState(false);
  const [loadingSubSectors, setLoadingSubSectors] = React.useState(false);
  const [loadingYears, setLoadingYears] = React.useState(false);
  const selectedSectorArr = Array.isArray(selectedSector) ? selectedSector : [];
  const selectedSubSectorArr = Array.isArray(selectedSubSector) ? selectedSubSector : [];


  const handleSectorChange = (e) => {
    const newSectors = e.target.value;
    handleFilterChange(newSectors, selectedSubSectorArr, selectedYear);
  };

  const handleSubSectorChange = (e) => {
    const newSubSectors = e.target.value;
    handleFilterChange(selectedSectorArr, newSubSectors, selectedYear);
  };

  const handleYearChange = (e) => {
    const newYear = e.target.value;
    handleFilterChange(selectedSectorArr || 'all', selectedSubSectorArr || 'all', newYear || 'all');
  };

  // Reset individual filters
  const handleClearSector = () => handleFilterChange([], selectedSubSector, selectedYear);
  const handleClearSubSector = () => handleFilterChange(selectedSector, [], selectedYear);
  const handleClearYear = () => handleFilterChange(selectedSector, selectedSubSector, '');


  // Fetch sectors
  useEffect(() => {
    if (token) {
      const fetchSectors = async () => {
        setLoadingSectors(true);
        try {
          const response = await fetch('https://api.fmb52.com/api/sector', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch sectors');
          }

          const data = await response.json();
          if (data?.data) {
            const filteredSectors = data.data.filter((sector) => sector.name !== 'Annual Report');
            setSectors(filteredSectors);
          } else {
            console.error('No sectors found');
          }
        } catch (error) {
          console.error('Error fetching sectors:', error);
        } finally {
          setLoadingSectors(false);
        }
      };
      fetchSectors();
    }
  }, [token]);

  // Fetch sub-sectors based on selected sector
  useEffect(() => {
    console.log('Selected sector:', selectedSector);
    if (token && selectedSector && selectedSector.length > 0) {
      const fetchSubSectors = async () => {
        setLoadingSubSectors(true);
        try {
          const sectorToFetch = selectedSector[0];
          const response = await fetch(`https://api.fmb52.com/api/sub_sector?sector=${sectorToFetch}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch sub-sectors');
          }
  
          const data = await response.json();
  
          if (data?.data) {
            // Filter sub-sectors by selected sector
            const filteredSubSectors = data.data.filter((subSector) => 
              selectedSector.some(sector => subSector.sector.toUpperCase() === sector.toUpperCase())
            );
            setSubSectors(filteredSubSectors);
          } else {
            setSubSectors([]);
          }
        } catch (error) {
          console.error('Error fetching sub-sectors:', error);
          setSubSectors([]);
        } finally {
          setLoadingSubSectors(false);
        }
      };
  
      fetchSubSectors();
    } else {
      // Clear sub-sectors if no sector is selected
      setSubSectors([]);
    }
  }, [token, selectedSector]);

  // Fetch years
  useEffect(() => {
    if (token) {
      const fetchYears = async () => {
        setLoadingYears(true);
        try {
          const response = await fetch('https://api.fmb52.com/api/year', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch years');
          }

          const data = await response.json();
          if (data?.data) {
            const currentYear = data.data.find(year => year.is_current === '1');
            if (currentYear) {
              handleFilterChange(selectedSector, selectedSubSector, currentYear.year); // Set the default year
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
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        // maxWidth: { sm: '100%', md: '1700px' },
        backgroundColor: theme.palette.background.paper, // Use color matching the login page
        color: theme.palette.text.primary, // Ensure text color contrasts well
        boxShadow: theme.shadows[2], // Add slight shadow for separation
        borderRadiusBottomright: 1, // Optional: round the edges slightly
        borderRadiusBottomleft: 1, // Optional: round the edges slightly
        px: 2, // Optional padding on the left and right
        pt: 2, // Increase top padding
        pb: 2, // Increase bottom padding
        pl: 3,
        minHeight: '64px',
        // overflowX: 'hidden',
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs />
      <Stack direction="row" sx={{ gap: 1 }}>
        {/* Sector Select */}
        <FormControl sx={{ width: { xs: '100%', md: '20ch' }, position: 'relative' }} variant="outlined">
          <TextField
            select
            label="Select Sector"
            value={selectedSector || []}
            onChange={handleSectorChange}
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1 }}
            SelectProps={{
              multiple: true,  // Enable multiple selection
              renderValue: (selected) => (Array.isArray(selected) ? selected.join(', ') : 'Select Sector'),
             // Show selected sectors as a comma-separated list
            }}
          >
            {loadingSectors ? (
              <MenuItem disabled>
                <CircularProgress size={24} />
              </MenuItem>
            ) : sectors.length > 0 ? (
              sectors.map((sector) => (
                <MenuItem key={`${sector.jamiat_id}-${sector.name}`} value={sector.name}>
                  {sector.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No sectors available</MenuItem>
            )}
          </TextField>
          {selectedSectorArr.length > 0  && (
            <IconButton onClick={handleClearSector} color="primary" sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: '14px',
              padding: '9px', // Reduce the padding around the icon button
              height: '10px', // Make the button height smaller
              width: '10px', // Make the button width smaller'
              marginRight: 3  }} aria-label="Clear sector">
              <CloseIcon sx={{ fontSize: 'inherit' }} />
            </IconButton>
          )}
        </FormControl>

        {/* Sub-Sector Select */}
        <FormControl sx={{ width: { xs: '100%', md: '20ch' }, position: 'relative' }} variant="outlined">
          <TextField
            select
            label="Select Sub-Sector"
            value={selectedSubSector || []}
            onChange={handleSubSectorChange}
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1 }}
            SelectProps={{
              multiple: true,  // Enable multiple selection
              renderValue: (selected) => (Array.isArray(selected) ? selected.join(', ') : 'Select Sub-Sector'),// Show selected sub-sectors as a comma-separated list
            }}
            disabled={loadingSubSectors || subSectors.length === 0 || !selectedSector}
          >
            {loadingSubSectors ? (
              <MenuItem disabled>
                <CircularProgress size={24} />
              </MenuItem>
            ) : subSectors.length > 0 ? (
              subSectors.map((subSector) => (
                <MenuItem key={`${subSector.sector}-${subSector.name}`} value={subSector.name}>
                  {subSector.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No sub-sectors available</MenuItem>
            )}
          </TextField>
          {selectedSubSectorArr.length > 0 &&  (
            <IconButton onClick={handleClearSubSector} color="primary" sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: '14px',
              padding: '9px', // Reduce the padding around the icon button
              height: '10px', // Make the button height smaller
              width: '10px', // Make the button width smaller'
              marginRight: 3  }} aria-label="Clear sub-sector">
              <CloseIcon sx={{ fontSize: 'inherit' }} />
            </IconButton>
          )}
        </FormControl>

        {/* Year Select */}
        <FormControl sx={{ width: { xs: '100%', md: '20ch' }, position: 'relative' }} variant="outlined">
          <TextField
            select
            label="Select Year"
            value={selectedYear || ''}
            onChange={handleYearChange}
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1 }}
            disabled={loadingYears || years.length === 0}
          >
            {loadingYears ? (
              <MenuItem disabled>
                <CircularProgress size={24} />
              </MenuItem>
            ) : years.length > 0 ? (
              years.map((yearData) => (
                <MenuItem key={yearData.jamiat_id} value={yearData.year}>
                  {yearData.year}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No years available</MenuItem>
            )}
          </TextField>
          {selectedYear && (
            <IconButton onClick={handleClearYear} color="primary" sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: '14px',
              padding: '9px', // Reduce the padding around the icon button
              height: '10px', // Make the button height smaller
              width: '10px', // Make the button width smaller'
              marginRight: 3   }} aria-label="Clear year">
              <CloseIcon sx={{ fontSize: 'inherit' }} />
            </IconButton>
          )}
        </FormControl>

        {/* Notifications Icon */}
        <MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton>

        {/* User Menu */}
        {user && (
          <UserBox>
            <Typography variant="h6" color="text.primary" fontSize="0.9rem" // Responsive font size
            >
              Hi, {userName.split(' ')[0]}
            </Typography>
            <UserMenu user={userName} />
          </UserBox>
        )}
      </Stack>
    </Stack>
  );
}
