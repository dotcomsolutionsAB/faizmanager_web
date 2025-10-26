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

  // store selected access_role_id (string/number ok; we compare as string)
  const [selectedRole, setSelectedRole] = useState('');
  const [switchingRole, setSwitchingRole] = useState(false);

  const showYearSelect = ['/dashboard', '/receipts', '/payments', '/expenses'].includes(location.pathname);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // Role change -> switch using access_role_id
  const handleRoleChange = async (event) => {
    const selectedAccessRoleId = event.target.value; // this is access_role_id
    setSelectedRole(selectedAccessRoleId);
    try {
      setSwitchingRole(true);
      await switchRole(selectedAccessRoleId); // pass access_role_id to context
    } catch (err) {
      console.error('Failed to switch role:', err);
    } finally {
      setSwitchingRole(false);
    }
  };

  // Default to first role's access_role_id
  useEffect(() => {
    if (roles && roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0].access_role_id);
    }
  }, [roles, selectedRole]);

  // Keep selector in sync with accessRoleId from context (e.g., restored from storage)
  useEffect(() => {
    if (accessRoleId == null || !(roles && roles.length)) return;
    const match = roles.find((r) => String(r.access_role_id) === String(accessRoleId));
    if (match && String(selectedRole) !== String(match.access_role_id)) {
      setSelectedRole(match.access_role_id);
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
          top: 64,
          width: '100%',
          zIndex: 1100,
          padding: 1,
          pr: 10,
          backgroundColor: theme.palette.background.default,
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[1],
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

          {/* Role Selector (uses access_role_id) */}
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
                  value={selectedRole ?? ''}          // access_role_id
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
