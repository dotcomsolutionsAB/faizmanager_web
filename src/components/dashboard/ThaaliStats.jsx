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
import { useUser } from '../../UserContext';
import { useState, useEffect } from 'react';
import divider from '../../assets/divider.png';

export default function ThaaliStats({ year, sector, subSector }) {
  const { token } = useUser();
  console.log("year in thaalistats", year);
  console.log("sector in thaalistats", sector)
  console.log("seub sector in thaalistats", subSector)

  const [thaaliStats, setThaaliStats] = useState({
    total_houses: 0,
    thaali_taking: 0,
    hub_not_set: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchThaaliStats = async () => {
    setLoading(true);
    try {
      const sectorParams = sector.map((s) => `sector[]=${encodeURIComponent(s)}`).join("&");
      const subSectorParams = subSector.map((s) => `sub_sector[]=${encodeURIComponent(s)}`).join("&");

      const url = `https://api.fmb52.com/api/dashboard/stats?year=${year}&${sectorParams}&${subSectorParams}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // Include Bearer token in headers
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error fetching data");

      const data = await response.json();
      console.log("Full api response:", data)
      setThaaliStats(data);
    } catch (error) {
      console.error("Error fetching Thaali stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && year && sector?.length > 0 && subSector?.length > 0) {
      fetchThaaliStats();
    }
  }, [year, sector, subSector, token]);
  
  // console.log("thaali stats", thaaliStats.total_houses)
  const validTotalHouses = Number(thaaliStats.total_houses);
  const validThaaliTaking = Number(thaaliStats.thaali_taking);

  const notTaking = !isNaN(validTotalHouses) && !isNaN(validThaaliTaking)
    ? validTotalHouses - validThaaliTaking
    : 0;

  // Handle cases where total is 0 to avoid division by zero
  const total = validTotalHouses > 0 ? validTotalHouses : 1;
  const takingPercentage = ((validThaaliTaking / total) * 100).toFixed(2);
  const notTakingPercentage = ((notTaking / total) * 100).toFixed(2);
  console.log("taking percentage", takingPercentage)
  console.log("not taking percentage", notTakingPercentage)

  const data = [
    { name: 'Taking', value: validThaaliTaking, color: '#2A9D8F', percentage: takingPercentage }, // Green for 'Taking'
    { name: 'Not Taking', value: notTaking, color: '#E9C46A', percentage: notTakingPercentage },  // Blue for 'Not Taking'
  ];

  // Value formatter to display only the percentage
  // Fixed valueFormatter
  const valueFormatter = (value, datum) => {
    console.log("datum:", datum); // Log datum
    console.log("value:", value); // Log value
    
    if (!value || !value.value) return '0%'; // Ensure value exists
    const percentage = value.percentage || ((value.value / total) * 100).toFixed(2); // Calculate percentage if not pre-calculated
    return `${percentage}%`;
  };
  
  

  console.log("Data being passed to PieChart:", data);

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
      Thaali Distribution
    </Typography>
    <Button
      variant="outlined"
      color="primary"
      onClick={fetchThaaliStats}
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
            '@media (min-width: 1100px) and (max-width: 1170px)': {
              height: 250, // Reduced height for the chart in this range
            },
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
            sx={{
              '@media (min-width: 1100px) and (max-width: 1170px)': {
                height: 250, // Reduced height for the chart
              },
            }}
            
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
                  md: 1.5, // Normal padding
                },
                '@media (min-width: 1100px) and (max-width: 1260px)': {
                  padding: 1.28, // Reduced padding for the 1100px to 1260px range
                },
                marginBottom: 2
              }}
            >
              <CardContent>
                <Typography
                  gutterBottom
                  sx={{ color: 'text.secondary', fontSize: { xs: 12, sm: 14 }, textAlign: 'center' }}
                >
                  Total Houses
                </Typography>
                <Typography variant="h6" align="center">
                  {thaaliStats.total_houses}
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
                  md: 1.5, // Normal padding
                },
                '@media (min-width: 1100px) and (max-width: 1260px)': {
                  padding: 1.28, // Reduced padding for the 1100px to 1260px range
                },
                marginBottom: 2

              }}
            >
              <CardContent>
                <Typography
                  gutterBottom
                  sx={{ color: 'text.secondary', fontSize: { xs: 12, sm: 14 }, textAlign: 'center' }}
                >
                  Taking Thaali
                </Typography>
                <Typography variant="h6" align="center">
                  {thaaliStats.thaali_taking}
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
                  md: 1.5, // Normal padding
                },
                '@media (min-width: 1100px) and (max-width: 1260px)': {
                  padding: 1.28, // Reduced padding for the 1100px to 1260px range
                },
                marginBottom: 2

              }}
            >
              <CardContent>
                <Typography
                  gutterBottom
                  sx={{ color: 'text.secondary', fontSize: { xs: 12, sm: 14 }, textAlign: 'center' }}
                >
                  Not Taking Thaali
                </Typography>
                <Typography variant="h6" align="center">
                  {notTaking}
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
                  md: 1.5, // Normal padding
                },
                '@media (min-width: 1100px) and (max-width: 1260px)': {
                  padding: 1.28, // Reduced padding for the 1100px to 1260px range
                },
                
              }}
            >
              <CardContent>
                <Typography
                  gutterBottom
                  sx={{ color: 'text.secondary', fontSize: { xs: 12, sm: 14 }, textAlign: 'center' }}
                >
                  Hub Not Set
                </Typography>
                <Typography variant="h6" align="center">
                  {thaaliStats.hub_not_set}
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
    // <Card
    //   sx={{
    //     minWidth: { xs: 250, sm: 350, md: 500 },
    //     width: '100%',
    //     height: 500,
    //     boxShadow: 3,
    //     display: 'flex',
    //     flexDirection: { xs: 'column', md: 'row' },
    //     justifyContent: 'space-between',
    //     // padding: { xs: 2, sm: 3 },
    //     borderRadius: 2, // Smooth rounded corners
    //     backgroundColor: '#FAFAFA', // Subtle background color

    //   }}
    // >
    //   <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    //     <Grid item xs={12} sm={6} md={7}>
    //       <Box
    //         sx={{
    //           display: 'flex',
    //           justifyContent: 'flex-start', // Centering horizontally
    //           alignItems: 'center',      // Centering vertically
    //           width: '100%',
    //           marginBottom: 2,
    //         }}
    //       >
    //         <Typography variant="h6" gutterBottom align="center">
    //           Thaali Distribution
    //         </Typography>
    //       </Box>
    //       <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
    //         <Box
    //           sx={{
    //             display: 'flex',
    //             justifyContent: 'center', // Center the chart horizontally
    //             alignItems: 'center',      // Center the chart vertically
    //             width: '100%',           // Ensure the container spans full width
    //             height: '100%',
    //             margin: 6
    //           }}
    //         >
    //           <PieChart
    //             series={[
    //               {
    //                 data: data,
    //                 highlightScope: { fade: 'global', highlight: 'item' },
    //                 faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
    //                 valueFormatter, // Pass the valueFormatter function here
    //               }
    //             ]}
    //             height={200}
    //           // sx={{ 
    //           //   width: { xs: 200, sm: 250, md: 200 },  // Adjust width for different screen sizes
    //           //   margin: '0 auto',  // Center the chart horizontally
    //           // }}
    //           />
    //         </Box>

    //         {/* Custom Legend */}
    //         <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
    //           {data.map((entry, index) => (
    //             <Box key={index} sx={{ display: 'flex', marginRight: 3, alignItems: 'center' }}>
    //               <Box sx={{
    //                 width: 12,
    //                 height: 12,
    //                 backgroundColor: entry.color,
    //                 marginRight: 1
    //               }} />
    //               <Typography variant="body2" sx={{ fontSize: 14 }}>
    //                 {entry.name} {entry.percentage}%
    //               </Typography>
    //             </Box>
    //           ))}
    //         </Box>
    //       </Card>
    //     </Grid>

    //     {/* Right side with stats cards */}
    //     <Grid item xs={12} sm={4} md={5}>
    //       <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
    //         <Button
    //           variant="outlined"
    //           color="primary"
    //           onClick={fetchThaaliStats} disabled={loading}
    //           sx={{
    //             borderRadius: 2,
    //             padding: '8px',
    //             marginRight: 1,
    //             minWidth: 'auto',
    //             display: 'flex',
    //             justifyContent: 'center',
    //           }}
    //         >
    //           {loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
    //         </Button>
    //       </Box>
    //       <CardContent sx={{ paddingRight: 2 }}>
    //         <Grid container spacing={2} direction="column">
    //           {/* Individual stat cards */}
    //           <Grid item xs={12} sm={4}>
    //             <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 1.8 }}>
    //               <CardContent>
    //                 <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: { xs: 12, sm: 14 }, textAlign: 'center' }}>
    //                   Total Houses
    //                 </Typography>
    //                 <Typography variant="h6" align="center">{thaaliStats.total_houses}</Typography>
    //               </CardContent>
    //             </Card>
    //           </Grid>

    //           <Grid item xs={12} sm={4}>
    //             <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 1.8 }}>
    //               <CardContent>
    //                 <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: { xs: 12, sm: 14 }, textAlign: 'center' }}>
    //                   Taking Thaali
    //                 </Typography>
    //                 <Typography variant="h6" align="center">{thaaliStats.thaali_taking}</Typography>
    //               </CardContent>
    //             </Card>
    //           </Grid>

    //           <Grid item xs={12} sm={4}>
    //             <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 1.8 }}>
    //               <CardContent>
    //                 <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: { xs: 12, sm: 14 }, textAlign: 'center' }}>
    //                   Not Taking Thaali
    //                 </Typography>
    //                 <Typography variant="h6" align="center">{notTaking}</Typography>
    //               </CardContent>
    //             </Card>
    //           </Grid>

    //           <Grid item xs={12} sm={4}>
    //             <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 1.8 }}>
    //               <CardContent>
    //                 <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: { xs: 12, sm: 14 }, textAlign: 'center' }}>
    //                   Hub Not Set
    //                 </Typography>
    //                 <Typography variant="h6" align="center">{thaaliStats.hub_not_set}</Typography>
    //               </CardContent>
    //             </Card>
    //           </Grid>
    //         </Grid>
    //       </CardContent>
    //     </Grid>
    //   </Grid>
    // </Card>
{/* <Card
      sx={{
        height: 500,
        width: '100%',
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: '#FAFAFA',
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* Heading and Refresh Button 
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Typography variant="h6">Thaali Distribution</Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={fetchThaaliStats}
          disabled={loading}
          sx={{ borderRadius: 2, padding: '8px' }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
        </Button>
      </Box>

      {/* Full-width Divider 
      <Box
        sx={{
          width: 'calc(100% + 32px)',
          height: '10px',
          backgroundImage: `url(${divider})`,
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          marginLeft: '-16px', // Adjust for padding of the Card
        }}
      />

      {/* Content Section 
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flex: 1,
        }}
      >
        {/* Pie Chart Section 
        <Card
          sx={{
            flex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 2,
            marginRight: 3
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              marginLeft: 8
            }}
          >
            <PieChart
              series={[{
                data: data,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
              }]}
              height={285}
            />
          </Box>

          {/* Custom Legend 
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

        {/* Info Cards Section 
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            flex: 1,  
            paddingRight: 0.5, // Maintain padding for info cards
          }}
        >
          {[
            { label: 'Total Houses', value: thaaliStats.total_houses },
            { label: 'Taking Thaali', value: thaaliStats.thaali_taking },
            { label: 'Not Taking Thaali', value: notTaking },
            { label: 'Hub Not Set', value: thaaliStats.hub_not_set },
          ].map((stat, index) => (
            <Card
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center', // Maintain consistent alignment
                padding: 1, // Match the original padding
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                {stat.label}
              </Typography>
              <Typography variant="h6" align="center">
                {stat.value}
              </Typography>
            </Card>
          ))}
        </Box>
      </Box>
    </Card> */}