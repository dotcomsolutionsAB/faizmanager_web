// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Card from '@mui/material/Card';
// import Typography from '@mui/material/Typography';
// import CircularProgress from '@mui/material/CircularProgress';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import { PieChart } from '@mui/x-charts/PieChart';
// import { useUser } from '../../UserContext';
// import { useState, useEffect } from 'react';

// export default function AccountBreakupStats({ year, sector, subSector }) {
//   const { token } = useUser();

//   const [accountBreakupStats, setAccountBreakupStats] = useState({
//     payment_breakdown: {
//       cheque: 0,
//       cash: 0,
//       neft: 0,
//     },
//   });

//   const [loading, setLoading] = useState(false);

//   const fetchAccountBreakupStats = async () => {
//     setLoading(true);
//     try {
//       const sectorParams = sector.map((s) => `sector[]=${encodeURIComponent(s)}`).join("&");
//       const subSectorParams = subSector.map((s) => `sub_sector[]=${encodeURIComponent(s)}`).join("&");

//       const url = `https://api.fmb52.com/api/dashboard-stats?year=${year}&${sectorParams}&${subSectorParams}`;

//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) throw new Error("Error fetching data");

//       const data = await response.json();
//       setAccountBreakupStats({
//         payment_breakdown: {
//           cheque: Number(data.payment_breakdown.cheque.replace(/,/g, '')) || 0,
//           cash: Number(data.payment_breakdown.cash.replace(/,/g, '')) || 0,
//           neft: Number(data.payment_breakdown.neft.replace(/,/g, '')) || 0,
//         },
//       });
//     } catch (error) {
//       console.error("Error fetching account stats:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAccountBreakupStats();
//   }, [year, sector, subSector]);

//   const { cheque, cash, neft } = accountBreakupStats.payment_breakdown;

//   // Data for the pie chart
//   const total = cheque + cash + neft || 1; // Avoid division by zero
//   const chartData = [
//     { name: 'Cash', value: cash, color: '#3CB371', percentage: ((cash / total) * 100).toFixed(2) },
//     { name: 'Cheque', value: cheque, color: '#FF7043', percentage: ((cheque / total) * 100).toFixed(2) },
//     { name: 'NEFT', value: neft, color: '#FFCA28', percentage: ((neft / total) * 100).toFixed(2) },
//   ];

//   // Value formatter to show percentage
//   const valueFormatter = (value, datum) => {
//     console.log("datum:", datum); // Log datum
//     console.log("value:", value); // Log value
    
//     if (!value || !value.value) return '0%'; // Ensure value exists
//     const percentage = value.percentage || ((value.value / total) * 100).toFixed(2); // Calculate percentage if not pre-calculated
//     return `${percentage}%`;
//   };

//   return (
//     <Card
//       sx={{
//         minWidth: { xs: 250, sm: 350, md: 500 },
//         width: '100%',
//         height: 500,
//         boxShadow: 3,
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//         borderRadius: 2,
//         padding: { xs: 2, sm: 3 },
//         backgroundColor: '#FAFAFA',
//       }}
//     >
//       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
//         <Typography variant="h6" sx={{ fontWeight: 600 }}>
//           Payment Breakdown
//         </Typography>
//         <Button
//           variant="outlined"
//           color="primary"
//           onClick={fetchAccountBreakupStats}
//           disabled={loading}
//           sx={{
//             borderRadius: 2,
//             padding: '8px',
//             minWidth: 'auto',
//             display: 'flex',
//             justifyContent: 'center',
//           }}
//         >
//           {loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
//         </Button>
//       </Box>
//       <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>

//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' , marginLeft: 10}}>
//         <PieChart
//           series={[
//             {
//               data: chartData,
//               highlightScope: { fade: 'global', highlight: 'item' },
//               faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
//               valueFormatter, // Use valueFormatter to show percentages
//             },
//           ]}
//           height={300}
//         />
//       </Box>


//       {/* Custom Legend */}
//       <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
//         {chartData.map((entry, index) => (
//           <Box key={index} sx={{ display: 'flex', marginRight: 3, alignItems: 'center' }}>
//             <Box
//               sx={{
//                 width: 12,
//                 height: 12,
//                 backgroundColor: entry.color,
//                 marginRight: 1,
//               }}
//             />
//             <Typography variant="body2" sx={{ fontSize: 14 }}>
//               {entry.name}: {entry.percentage}%
//             </Typography>
//           </Box>
//         ))}
//       </Box>
//       </Card>
//     </Card>
//   );
// }


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


export default function AccountBreakupStats({ year, sector, subSector }) {
  const { token, currency } = useUser();

  const [accountBreakupStats, setAccountBreakupStats] = useState({
    payment_breakdown: {
      cheque: 0,
      cash: 0,
      neft: 0,
    },
  });
  const [loading, setLoading] = useState(false);

  const fetchAccountBreakupStats = async () => {
    setLoading(true);
    try {
      const sectorParams = sector.map((s) => `sector[]=${encodeURIComponent(s)}`).join("&");
      const subSectorParams = subSector.map((s) => `sub_sector[]=${encodeURIComponent(s)}`).join("&");

      const url = `https://api.fmb52.com/api/dashboard-stats?year=${year}&${sectorParams}&${subSectorParams}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error fetching data");

      const data = await response.json();
      setAccountBreakupStats({
        payment_breakdown: {
          cheque: Number(data.payment_breakdown.cheque.replace(/,/g, '')) || 0,
          cash: Number(data.payment_breakdown.cash.replace(/,/g, '')) || 0,
          neft: Number(data.payment_breakdown.neft.replace(/,/g, '')) || 0,
        },
      });
    } catch (error) {
      console.error("Error fetching account stats:", error);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
    if (token && year && sector?.length > 0 && subSector?.length > 0) {
      fetchAccountBreakupStats();
    }
  }, [year, sector, subSector, token]);

     // Function to format numbers with commas for Indian numbering system
  // Function to format numbers with commas for Indian numbering system
  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency?.currency_code || 'INR', // Default to INR if currency is not available
      minimumFractionDigits: 0, // No decimal places
      maximumFractionDigits: 0, // No decimal places
    }).format(value);

  const { cheque, cash, neft } = accountBreakupStats.payment_breakdown;

  // Data for the pie chart
  const total = cheque + cash + neft || 1; // Avoid division by zero
  const chartData = [
    { name: 'Cash', value: cash, color: '#ff0054', percentage: ((cash / total) * 100).toFixed(2) },
    { name: 'Cheque', value: cheque, color: '#ff5400', percentage: ((cheque / total) * 100).toFixed(2) },
    { name: 'NEFT', value: neft, color: '#ffbd00', percentage: ((neft / total) * 100).toFixed(2) },
  ];

  // Value formatter to show percentage
  const valueFormatter = (value, datum) => {
    console.log("datum:", datum); // Log datum
    console.log("value:", value); // Log value
    
    if (!value || !value.value) return '0%'; // Ensure value exists
    const percentage = value.percentage || ((value.value / total) * 100).toFixed(2); // Calculate percentage if not pre-calculated
    return `${percentage}%`;
  };
    
//   console.log("Data being passed to PieChart:", data);
console.log("Cash", accountBreakupStats.payment_breakdown.cash)

  return (
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
    //           Payment Stats
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
    //                 data: chartData,
    //                 highlightScope: { fade: 'global', highlight: 'item' },
    //                 faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
    //                 valueFormatter
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
    //           {chartData.map((entry, index) => (
    //             <Box key={index} sx={{ display: 'flex', marginRight: 3, alignItems: 'center' }}>
    //               <Box sx={{
    //                 width: 12,
    //                 height: 12,
    //                 backgroundColor: entry.color,
    //                 marginRight: 1
    //               }} />
    //               <Typography variant="body2" sx={{ fontSize: 14 }}>
    //                 {entry.name}: {entry.percentage}%
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
    //           onClick={fetchAccountBreakupStats} disabled={loading}
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
    //             <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 3.9 }}>
    //               <CardContent>
    //                 <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: { xs: 12, sm: 14 }, textAlign: 'center' }}>
    //                   Cash
    //                 </Typography>
    //                 <Typography variant="h6" align="center">₹ {formatNumber(accountBreakupStats.payment_breakdown.cash)} </Typography>
    //               </CardContent>
    //             </Card>
    //           </Grid>

    //           <Grid item xs={12} sm={4}>
    //             <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 3.9 }}>
    //               <CardContent>
    //                 <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: { xs: 12, sm: 14 }, textAlign: 'center' }}>
    //                   Cheque
    //                 </Typography>
    //                 <Typography variant="h6" align="center"> ₹ {formatNumber(accountBreakupStats.payment_breakdown.cheque)} </Typography>
    //               </CardContent>
    //             </Card>
    //           </Grid>

    //           <Grid item xs={12} sm={4}>
    //             <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 3.9 }}>
    //               <CardContent>
    //                 <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: { xs: 12, sm: 14 }, textAlign: 'center' }}>
    //                   NEFT
    //                 </Typography>
    //                 <Typography variant="h6" align="center">₹ {formatNumber(accountBreakupStats.payment_breakdown.neft)}  </Typography>
    //               </CardContent>
    //             </Card>
    //           </Grid>
    //         </Grid>
    //       </CardContent>
    //     </Grid>
    //   </Grid>
    // </Card>

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
        Payment Stats
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        onClick={fetchAccountBreakupStats}
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
              '@media (min-width: 1100px) and (max-width: 1470px)': {
                height: 250, // Reduced height for the chart in this range
              },
            }}
          >
            <PieChart
              series={[
                {
                  data: chartData,
                  highlightScope: { fade: 'global', highlight: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  valueFormatter,
                },
              ]}
              height={280}
              sx={{
                '@media (min-width: 1100px) and (max-width: 1470px)': {
                  height: 250, // Reduced height for the chart
                },
              }}
              
            />
          </Box>
  
          {/* Custom Legend */}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
            {chartData.map((entry, index) => (
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
                    paddingTop: 3.7, // Reduced padding for the 1100px to 1260px range
                    paddingBottom: 3.7,
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
                    Cash
                  </Typography>
                  <Typography variant="h6" align="center"  sx={{
                        whiteSpace: 'nowrap', // Prevent text wrapping
                        overflow: 'hidden', // Prevent overflow
                        textOverflow: 'ellipsis', // Handle long amounts gracefully
                        '@media (min-width: 1100px) and (max-width: 1260px)': {
                          fontSize: 14 // Reduced padding for the 1100px to 1260px range
                        },
                      }}>
                {formatCurrency(accountBreakupStats.payment_breakdown.cash)}
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
                    paddingTop: 3.7, // Reduced padding for the 1100px to 1260px range
                    paddingBottom: 3.7,
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
                    Cheque
                  </Typography>
                  <Typography variant="h6" align="center"  sx={{
                        whiteSpace: 'nowrap', // Prevent text wrapping
                        overflow: 'hidden', // Prevent overflow
                        textOverflow: 'ellipsis', // Handle long amounts gracefully
                        '@media (min-width: 1100px) and (max-width: 1260px)': {
                          fontSize: 14 // Reduced padding for the 1100px to 1260px range
                        },
                      }}>
                  {formatCurrency(accountBreakupStats.payment_breakdown.cheque)}
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
                    paddingTop: 3.7, // Reduced padding for the 1100px to 1260px range
                    paddingBottom: 3.7,
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
                    NEFT
                  </Typography>
                  <Typography variant="h6" align="center"  sx={{
                        whiteSpace: 'nowrap', // Prevent text wrapping
                        // overflow: 'hidden', // Prevent overflow
                        textOverflow: 'ellipsis', // Handle long amounts gracefully
                        '@media (min-width: 1100px) and (max-width: 1260px)': {
                          fontSize: 14 // Reduced padding for the 1100px to 1260px range
                        },
                      }}>
                  {formatCurrency(accountBreakupStats.payment_breakdown.neft)}
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
// sx={{
//   width: '100%',
//   boxShadow: 3,
//   borderRadius: 2,
//   backgroundColor: '#FAFAFA',
//   padding: 2,
//   display: 'flex',
//   flexDirection: 'column',
//   gap: 2,
//   height: 500
// }}
// >
// {/* Heading and Refresh Button */}
// <Box
//   sx={{
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//   }}
// >
//   <Typography variant="h6">Payment Breakdown</Typography>
//   <Button
//     variant="outlined"
//     color="primary"
//     onClick={fetchAccountBreakupStats}
//     disabled={loading}
//     sx={{ borderRadius: 2, padding: '8px' }}
//   >
//     {loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
//   </Button>
// </Box>

// {/* Full-width Divider */}
// <Box
//   sx={{
//     width: 'calc(100% + 32px)',
//     height: '10px',
//     backgroundImage: `url(${divider})`,
//     backgroundRepeat: 'repeat-x',
//     backgroundPosition: 'center',
//     backgroundSize: 'contain',
//     marginLeft: '-16px',
//   }}
// />

// {/* Content Section */}
// <Box
//   sx={{
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     flex: 1,
//   }}
// >
//   {/* Pie Chart Section */}
//   <Card
//     sx={{
//       flex: 2,
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center',
//       padding: 2,
//       marginRight: 3

//     }}
//   >
//     <Box
//       sx={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: '100%',
//         height: '100%',
//         marginLeft: 8
//       }}
//     >
//       <PieChart
//         series={[{
//           data: chartData,
//           highlightScope: { fade: 'global', highlight: 'item' },
//           faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
//         }]}
//         height={270}
//       />
//     </Box>

//     {/* Custom Legend */}
//     <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
//       {chartData.map((entry, index) => (
//         <Box key={index} sx={{ display: 'flex', marginRight: 3, alignItems: 'center'}}>
//           <Box
//             sx={{
//               width: 12,
//               height: 12,
//               backgroundColor: entry.color,
//               marginRight: 1,
//             }}
//           />
//           <Typography variant="body2" sx={{ fontSize: 14 }}>
//             {entry.name}: {entry.percentage}%
//           </Typography>
//         </Box>
//       ))}
//     </Box>
//   </Card>

//   {/* Info Cards Section */}
//   <Box
//     sx={{
//       display: 'flex',
//       flexDirection: 'column',
//       gap: 2,
//       flex: 1,
//     }}
//   >
//     {[
//       { label: 'Cash', value: `₹ ${formatNumber(cash)}` },
//       { label: 'Cheque', value: `₹ ${formatNumber(cheque)}` },
//       { label: 'NEFT', value: `₹ ${formatNumber(neft)}` },
//     ].map((stat, index) => (
//       <Card
//         key={index}
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           padding: 3.15,
//         }}
//       >
//         <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
//           {stat.label}
//         </Typography>
//         <Typography variant="h6" align="center">
//           {stat.value}
//         </Typography>
//       </Card>
//     ))}
//   </Box>
// </Box>
// </Card>