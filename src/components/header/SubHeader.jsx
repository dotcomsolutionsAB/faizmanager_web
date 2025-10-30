// SubHeader.jsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';
import { Select, InputLabel, OutlinedInput, CssBaseline, useMediaQuery } from '@mui/material';
import AppTheme from '../../styles/AppTheme';
import { useUser } from '../../contexts/UserContext';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import { useAppStore } from '../../appStore'; // ⬅️ ADD

export const SUBHEADER_HEIGHT = 64;       // ⬅️ you can tweak (64–72)
const DRAWER_WIDTH_OPEN = 240;

export default function SubHeader({ selectedYear, setSelectedYear }) {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm')); // ⬅️ for closed width calc
  const drawerOpen = useAppStore((s) => s.dopen);           // ⬅️ read drawer state

  // closed drawer widths match your Drawer styles (spacing(7)+1 on xs, spacing(8)+1 on sm+)
  const DRAWER_WIDTH_CLOSED = isSmUp ? 65 : 57;
  const leftOffset = drawerOpen ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED;

  const { token, roles, switchRole, accessRoleId } = useUser();
  const location = useLocation();

  const [years, setYears] = useState([]);
  const [loadingYears, setLoadingYears] = useState(false);

  const [selectedRole, setSelectedRole] = useState('');
  const [switchingRole, setSwitchingRole] = useState(false);

  const showYearSelect = ['/dashboard', '/receipts', '/payments', '/expenses'].includes(location.pathname);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleRoleChange = async (event) => {
    const selectedAccessRoleId = event.target.value;
    setSelectedRole(selectedAccessRoleId);
    try {
      setSwitchingRole(true);
      await switchRole(selectedAccessRoleId);
    } catch (err) {
      console.error('Failed to switch role:', err);
    } finally {
      setSwitchingRole(false);
    }
  };

  useEffect(() => {
    if (roles && roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0].access_role_id);
    }
  }, [roles, selectedRole]);

  useEffect(() => {
    if (accessRoleId == null || !(roles && roles.length)) return;
    const match = roles.find((r) => String(r.access_role_id) === String(accessRoleId));
    if (match && String(selectedRole) !== String(match.access_role_id)) {
      setSelectedRole(match.access_role_id);
    }
  }, [accessRoleId, roles, selectedRole]);

  useEffect(() => {
    if (!token) return;
    const fetchYears = async () => {
      setLoadingYears(true);
      try {
        const response = await fetch('https://api.fmb52.com/api/year', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          const t = await response.text();
          console.error('Fetch years failed:', response.status, t);
          throw new Error('Failed to fetch years');
        }

        const data = await response.json();
        if (data?.data) {
          const currentYear = data.data.find((year) => year.is_current === '1');
          if (currentYear) setSelectedYear(currentYear.year);
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
  }, [token, setSelectedYear]);

  return (
    <AppTheme>
      <CssBaseline />
      <Box
        sx={{
          position: 'fixed',
          top: 64,                            // below your main Header
          left: `${leftOffset}px`,            // ⬅️ key: shift by drawer width
          width: `calc(100% - ${leftOffset}px)`,
          zIndex: 1100,
          padding: 1,
          pr: 2,
          backgroundColor: theme.palette.background.default,
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[1],
          minHeight: SUBHEADER_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          transition: 'left 0.3s ease, width 0.3s ease', // ⬅️ animate with drawer
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
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

          {/* Role Selector */}
          {roles && roles.length > 0 && (
            <FormControl
              sx={{ m: 1, width: { xs: '100%', sm: '22ch', md: '22ch' }, maxWidth: '100%' }}
              fullWidth
            >
              <InputLabel id="role-select-label">Select Role</InputLabel>
              <Select
                label="Select Role"
                labelId="role-select-label"
                value={selectedRole ?? ''}
                onChange={handleRoleChange}
                input={<OutlinedInput label="Role" />}
                disabled={switchingRole}
              >
                {roles.map((r) => (
                  <MenuItem key={r.access_role_id} value={r.access_role_id}>
                    {r.access_role_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Year Selector */}
          {showYearSelect && (
            <FormControl
              sx={{ m: 1, width: { xs: '100%', sm: '22ch', md: '22ch' }, maxWidth: '100%' }}
              fullWidth
            >
              <InputLabel id="year-select-label">Select Year</InputLabel>
              <Select
                label="Select Year"
                labelId="year-select-label"
                value={selectedYear ?? ''}
                onChange={handleYearChange}
                input={<OutlinedInput label="Year" />}
                disabled={loadingYears}
              >
                {years.map((year) => (
                  <MenuItem key={year.year} value={year.year}>
                    {year.year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </Box>
    </AppTheme>
  );
}
