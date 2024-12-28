import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import WarningIcon from '@mui/icons-material/Warning';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PaymentsIcon from '@mui/icons-material/Payments';
import MoneyIcon from '@mui/icons-material/Money';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StatCard from './StatCard';
import { useUser } from '../../../UserContext'; // Import UserContext to access the token
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { brown, yellow } from '../../login/ThemePrimitives';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));
export default function ThaaliStats({ selectedSector, selectedSubSector, selectedYear }) {

    const { user } = useUser(); // Get user data from context
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
      // Use filters to fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        // Ensure sectors and subSectors are arrays, and join them if they are.
        // Format sectors and sub-sectors as arrays for the URL query string
        const sectors = Array.isArray(selectedSector) ? selectedSector : [selectedSector];
        const subSectors = Array.isArray(selectedSubSector) ? selectedSubSector : [selectedSubSector];
        const year = encodeURIComponent(selectedYear || 'all').toLowerCase();

        // Construct the URL with multiple 'sector' and 'sub_sector' parameters
        const params = new URLSearchParams();

        sectors.forEach(sector => params.append('sector[]', encodeURIComponent(sector)));
        subSectors.forEach(subSector => params.append('sub_sector[]', encodeURIComponent(subSector)));
        params.append('year', year);

        console.log('API Request URL: ', `https://api.fmb52.com/api/dashboard-stats?${params.toString()}`); // Log the API URL

        const response = await fetch(`https://api.fmb52.com/api/dashboard-stats?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`, // Include the bearer token
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response Data: ', data);
        setApiData(data);
      } catch (error) {
        console.error('Error fetching API data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSector, selectedSubSector, selectedYear, user?.token]);

  const thaaliTaking = apiData.thaali_taking || 0;
  const totalHouses = apiData.total_houses || 0; // Using total houses instead of total_thaali
  const notTaking = totalHouses - thaaliTaking; // Calculate not taking based on total houses - thaali taking
  const takingPercentage = totalHouses ? Math.round((thaaliTaking / totalHouses) * 100) : 0;
  const notTakingPercentage = totalHouses ? Math.round((notTaking / totalHouses) * 100) : 0;

  const pieData1 = [
    { name: 'Not Taking', value: notTakingPercentage, fill: '#FF6347' },
    { name: 'Taking', value: takingPercentage, fill: '#32CD32' },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !apiData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h6" color="error">
          Error loading data. Please try again later.
        </Typography>
      </Box>
    );
  }
    return (
        <Grid size={6}>
        <Item>
          <Typography variant="h6" sx={{ color: brown[700] }}>Thaali Stats</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            {/* Left section: Cards */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, padding: 2 }}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <RestaurantIcon fontSize="large" color="primary" />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h6">{apiData.thaali_taking || '0'}</Typography>
                    <Typography variant="body1">Thaali Taking</Typography>
                  </Box>
                  
                </CardContent>
              </Card>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <WarningIcon fontSize="large" color="warning" />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h6">{apiData.notTaking || '0'}</Typography>
                    <Typography variant="body1">Not Taking</Typography>
                  </Box>
                </CardContent>
              </Card>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <HourglassEmptyIcon fontSize="large" color="secondary" />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h6">{apiData.hub_due || '0'}</Typography>
                    <Typography variant="body1">Hub Due</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Right section: Pie Chart */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <PieChart width={200} height={200}>
                <Pie data={pieData1} dataKey="value" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                  {pieData1.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Box>
          </Box>
          <IconButton 
        // onClick={fetchData} 
        disabled={loading} 
        color="primary" 
        sx={{ marginLeft: 2 }}
      >
        <RefreshIcon />
      </IconButton>
{/* Loading and Error States */}
{loading && <Typography variant="body1">Loading...</Typography>}
      {error && <Typography variant="body1" color="error">Error loading data. Please try again.</Typography>}

        </Item>
      </Grid>
    )
}
