import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';
import { Select, InputLabel, OutlinedInput, CssBaseline } from '@mui/material';
import AppTheme from '../../styles/AppTheme';
import { useUser } from '../../contexts/UserContext';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';

export default function SubHeader({ selectedYear, setSelectedYear }) {
  const theme = useTheme();
  const { token, roles, switchRole, accessRoleId } = useUser();
  const location = useLocation();

  const [years, setYears] = useState([]);
  const [loadingYears, setLoadingYears] = useState(false);

  const [selectedRole, setSelectedRole] = useState('');
  const [switchingRole, setSwitchingRole] = useState(false);

  // Show year selector only on specific pages
  const showYearSelect = ['/dashboard', '/receipts', '/payments', '/expenses'].includes(location.pathname);

  // Year change (bug fix: use `event`, not `even`)
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // Role change -> switchRole (gets new token + access ids)
  const handleRoleChange = async (event) => {
    const selectedRoleId = event.target.value;
    setSelectedRole(selectedRoleId);
    try {
      setSwitchingRole(true);
      await switchRole(selectedRoleId); // refresh auth + access on backend
    } catch (err) {
      console.error('Failed to switch role:', err);
    } finally {
      setSwitchingRole(false);
    }
  };

  // Set first role as default in UI when roles load (no forced switch if already set)
  useEffect(() => {
    if (roles && roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0].id);
    }
  }, [roles, selectedRole]);

  // Keep selector in sync with accessRoleId from context (e.g., restored from storage)
  useEffect(() => {
    if (!accessRoleId || !(roles && roles.length)) return;
    const match = roles.find((r) => String(r.id) === String(accessRoleId));
    if (match && String(selectedRole) !== String(match.id)) {
      setSelectedRole(match.id);
    }
  }, [accessRoleId, roles, selectedRole]);

  // Fetch financial years
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
          top: 64, // height of your main header (adjust if needed)
          width: '100%',
          zIndex: 1100,
          padding: 1,
          pr: 10,
          backgroundColor: theme.palette.background.default,
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[1],
        }}
      >
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

          {/* Role Selector */}
          {roles && roles.length > 0 && (
            <div>
              <FormControl
                sx={{
                  m: 1,
                  width: { xs: '100%', sm: '22ch', md: '22ch' },
                  maxWidth: '100%',
                }}
                fullWidth
              >
                <InputLabel id="role-select-label">Select Role</InputLabel>
                <Select
                  label="Select Role"
                  labelId="role-select-label"
                  value={selectedRole ?? ''}     // keep controlled
                  onChange={handleRoleChange}
                  input={<OutlinedInput label="Role" />}
                  disabled={switchingRole}       // disable while switching
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.access_role_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}

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
            </div>
          )}
        </Box>
      </Box>
    </AppTheme>
  );
}
