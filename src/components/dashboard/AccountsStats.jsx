import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { PieChart } from '@mui/x-charts/PieChart';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from '@mui/material/CircularProgress';
import { useUser } from '../../contexts/UserContext';
import { useState, useEffect } from 'react';
import divider from '../../assets/divider.png';

export default function AccountStats({ year, sector, subSector }) {
  const { token,  currency, accessRoleId } = useUser();


  const [accountStats, setAccountStats] = useState({
    total_hub_amount: 0,
    total_paid_amount: 0,
    total_due_amount: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchAccountStats = async () => {
    setLoading(true);
    try {
      const sectorParams = sector.map((s) => `sector[]=${encodeURIComponent(s)}`).join("&");
      const subSectorParams = subSector.map((s) => `sub_sector[]=${encodeURIComponent(s)}`).join("&");
     


      const url = `https://api.fmb52.com/api/dashboard/stats?year=${year}&${sectorParams}&${subSectorParams}&role_id=${accessRoleId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // Include Bearer token in headers
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error fetching data");
  

      const data = await response.json();

   
      setAccountStats({
        total_hub_amount: Number(data?.total_hub_amount) || 0,
      total_paid_amount: Number(data?.total_paid_amount) || 0,
      total_due_amount: Number(data?.total_due_amount) || 0,
      });
    } catch (error) {
      console.error("Error fetching Account stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     if (token && year && sector?.length > 0 && subSector?.length > 0) {
       fetchAccountStats();
     }
   }, [year, sector, subSector, token]);

  // Function to format numbers with commas for Indian numbering system
  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency?.currency_code || 'INR', // Default to INR if currency is not available
      minimumFractionDigits: 0, // No decimal places
      maximumFractionDigits: 0, // No decimal places
    }).format(value);

//   console.log("thaali stats", accountStats.total_houses)
  const validTotalPaidAmount = Number(accountStats.total_paid_amount);
  const validTotalDueAmount = Number(accountStats.total_due_amount);

  const totalAmount = validTotalDueAmount + validTotalPaidAmount || 1;

  const data = [
    { name: 'Paid', value: validTotalPaidAmount, color: '#14213d', percentage: ((validTotalPaidAmount / totalAmount) * 100).toFixed(2)   },  // Green for 'Taking'
    { name: 'Due', value: validTotalDueAmount, color: '#fca311',  percentage: ((validTotalDueAmount / totalAmount) * 100).toFixed(2)  }      // Blue for 'Not Taking'
  ];


    // Value formatter for PieChart
    const valueFormatter = (value, datum) => {

        
        if (!value || !value.value) return '0%'; // Ensure value exists
        const percentage = value.percentage || ((value.value / totalAmount) * 100).toFixed(2); // Calculate percentage if not pre-calculated
        return `${percentage}%`;
      };
    

  return (
    <Card
  sx={{
    minWidth: { xs: 250, sm: 350, md: 500 },
    width: '100%',
    height: { xs: 'auto', md: 500 },
    boxShadow: 3,
    display: 'flex',
    flexDirection: 'column', // Ensure everything stacks properly
    borderRadius: 2, // Smooth rounded corners
    backgroundColor: '#FAFAFA', // Subtle background color
    padding: { xs: 1, sm: 2, md: 2 },
  }}
>
  {/* Thaali Stats Heading and Refresh Button */}
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' , flexDirection: { xs: 'column', sm: 'row' }, // Stack for small screens
      gap: { xs: 2, sm: 0 }, // Add gap for smaller screens
      }}>
    <Typography variant="h6" sx={{ fontWeight: 'bold',  textAlign: { xs: 'center', sm: 'left' }  }}>
      Account Stats
    </Typography>
    <Button
      variant="outlined"
      color="primary"
      onClick={fetchAccountStats}
      disabled={loading}
      sx={{
        borderRadius: '50%',
        padding: 1.5,
        minWidth: 'auto',
        height: { xs: 35, sm: 40,md: 40 }, // Adjust button size
        width: { xs: 35, sm: 40, md: 40 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
    </Button>
  </Box>

  {/* Divider Image */}
  <Box
  sx={{
    width: '100vw', // Full screen width
    position: 'relative',
    left: 'calc(-50vw + 50%)', // Align with the screen edges
    height: {
      xs: 10, // Height for extra-small screens
      sm: 15, // Height for small screens
      md: 15, // Height for medium screens
      lg: 15, // Height for large screens
      xl: 15, // Height for extra-large screens
    },
    backgroundImage: `url(${divider})`, // Replace with your image path
    backgroundSize: 'contain', // Ensure the divider image scales correctly
    backgroundRepeat: 'repeat-x', // Repeat horizontally
    backgroundPosition: 'center',
    // my: { xs: 1.5, sm: 2, md: 2.5 }, // Vertical margin adjusted for different screen sizes
  }}
/>



  {/* Main Grid Content */}
  <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {/* Left Section: Chart */}
    <Grid item xs={12} sm={6} md={8}   sx={{
        order: { xs: 2, sm: 1 }, // Place chart below cards for smaller screens
      }}>
      <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 2, }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            marginLeft: 6,
            // '@media (min-width: 1100px) and (max-width: 1170px)': {
            //   height: 250, // Reduced height for the chart in this range
            // },
          }}
        >
          <PieChart
            series={[
              {
                data: data,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                valueFormatter,
              },
            ]}
            height={280}
            // sx={{
            //   '@media (min-width: 1100px) and (max-width: 1170px)': {
            //     height: 250, // Reduced height for the chart
            //   },
            // }}
            
          />
        </Box>

        {/* Custom Legend */}
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
          {data.map((entry, index) => (
            <Box key={index} sx={{ display: 'flex', marginRight: 3, alignItems: 'center' }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: entry.color,
                  marginRight: 1,
                }}
              />
              <Typography variant="body2" sx={{ fontSize: 14 }}>
                {entry.name} {entry.percentage}%
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>
    </Grid>

    {/* Right Section: Stats Cards */}
    <Grid item xs={12} sm={4} md={4}  sx={{
        order: { xs: 1, sm: 2 }, // Place cards above chart for small screens
      }}>
      <CardContent sx={{ paddingRight: 0.5 , paddingLeft: 3}}>
        <Grid container direction="column">
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: {
                  xs: 1.5, // Default padding for smaller screens
                  md: 3.6, // Normal padding
                },
                '@media (min-width: 1100px) and (max-width: 1260px)': {
                  paddingTop: 4, // Reduced padding for the 1100px to 1260px range
                  paddingBottom: 4,
                  paddingRight: 1,
                  paddingLeft: 1
                },
                '@media (min-width: 1260px) and (max-width: 1375px)': {
                  paddingTop: 3.5, // Reduced padding for the 1100px to 1260px range
                  paddingBottom: 3.5,
                  paddingRight: 0.5,
                  paddingLeft: 0.5
                },
                marginBottom: 2
              }}
            >
              <CardContent>
                <Typography
                  gutterBottom
                  sx={{ color: 'text.secondary', fontSize: { xs: 12, sm: 14 }, textAlign: 'center' }}
                >
                  Total Hub
                </Typography>
                <Typography variant="h6" align="center"  sx={{
                      whiteSpace: 'nowrap', // Prevent text wrapping
                      overflow: 'hidden', // Prevent overflow
                      textOverflow: 'ellipsis', // Handle long amounts gracefully
                      '@media (min-width: 1100px) and (max-width: 1260px)': {
                        fontSize: 14 // Reduced padding for the 1100px to 1260px range
                      },
                    }}>
               {formatCurrency(accountStats.total_hub_amount)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: {
                  xs: 1.5, // Default padding for smaller screens
                  md: 3.6, // Normal padding
                },
                '@media (min-width: 1100px) and (max-width: 1260px)': {
                  paddingTop: 4, // Reduced padding for the 1100px to 1260px range
                  paddingBottom: 4,
                  paddingRight: 1,
                  paddingLeft: 1
                },
                '@media (min-width: 1260px) and (max-width: 1375px)': {
                  paddingTop: 3.5, // Reduced padding for the 1100px to 1260px range
                  paddingBottom: 3.5,
                  paddingRight: 0.5,
                  paddingLeft: 0.5
                },
                marginBottom: 2

              }}
            >
              <CardContent>
                <Typography
                  gutterBottom
                  sx={{ color: 'text.secondary', fontSize: { xs: 12, sm: 14 }, textAlign: 'center' }}
                >
                  Total Received
                </Typography>
                <Typography variant="h6" align="center"  sx={{
                      whiteSpace: 'nowrap', // Prevent text wrapping
                      overflow: 'hidden', // Prevent overflow
                      textOverflow: 'ellipsis', // Handle long amounts gracefully
                      '@media (min-width: 1100px) and (max-width: 1260px)': {
                        fontSize: 14 // Reduced padding for the 1100px to 1260px range
                      },
                    }}>
                {formatCurrency(accountStats.total_paid_amount)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: {
                  xs: 1.5, // Default padding for smaller screens
                  md: 3.6, // Normal padding
                },
                '@media (min-width: 1100px) and (max-width: 1260px)': {
                  paddingTop: 4, // Reduced padding for the 1100px to 1260px range
                  paddingBottom: 4,
                  paddingRight: 1,
                  paddingLeft: 1
                },
                '@media (min-width: 1260px) and (max-width: 1375px)': {
                  paddingTop: 3.5, // Reduced padding for the 1100px to 1260px range
                  paddingBottom: 3.5,
                  paddingRight: 0.5,
                  paddingLeft: 0.5
                },
                // marginBottom: 2

              }}
            >
              <CardContent>
                <Typography
                  gutterBottom
                  sx={{ color: 'text.secondary', fontSize: { xs: 12, sm: 14 }, textAlign: 'center' }}
                >
                  Total Due
                </Typography>
                <Typography variant="h6" align="center"  sx={{
                      whiteSpace: 'nowrap', // Prevent text wrapping
                      // overflow: 'hidden', // Prevent overflow
                      textOverflow: 'ellipsis', // Handle long amounts gracefully
                      '@media (min-width: 1100px) and (max-width: 1260px)': {
                        fontSize: 14 // Reduced padding for the 1100px to 1260px range
                      },
                    }}>
                {formatCurrency(accountStats.total_due_amount)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Grid>
  </Grid>
</Card>

  );
}
