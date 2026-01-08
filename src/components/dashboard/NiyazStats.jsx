// import React, { useState, useEffect } from 'react';
// import { Box, Button, Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
// import { PieChart } from '@mui/x-charts/PieChart';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import { useUser } from '../../UserContext';
// import divider from '../../assets/divider.png';

// export default function NiyazStats({ year, sector, subSector }) {
//   const { token } = useUser();
//   const [niyazStats, setNiyazStats] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchNiyazStats = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('https://api.fmb52.com/api/niyaz_stats', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ sector, sub_sector: subSector }),
//       });

//       if (!response.ok) throw new Error('Failed to fetch Niyaz Stats');

//       const data = await response.json();
//       setNiyazStats(Array.isArray(data.data) ? data.data : []);

//     } catch (error) {
//       console.error('Error fetching Niyaz Stats:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchNiyazStats();
//     }
//   }, [token]);

//   const totalCount = niyazStats.reduce((acc, item) => acc + Number(item.count), 0) || 1; // Prevent division by zero

//   const chartData = niyazStats.map((item, index) => ({
//     name: item.slab,
//     value: parseInt(item.count, 10) || 1, // Ensure it's an integer
//     // Ensure it's a number
//     color: ["#14213d", "#fca311", "#e63946", "#a8dadc", "#457b9d", "#1d3557"][index % 6], // Assign fixed colors
//     percentage: `${((Number(item.count) / totalCount) * 100).toFixed(2)}%`,
//   }));
  
//   console.log("Chart Data: ", chartData);
  
//   // Ensure there's at least one valid entry
//   const safeChartData = chartData.length > 0 ? chartData : [{ name: "No Data", value: 1, color: "#ccc", percentage: "100%" }];

  

//   return (
//     <Card
//       sx={{
//         minWidth: { xs: 250, sm: 350, md: 500 },
//         width: '100%',
//         height: { xs: 'auto', md: 500 },
//         boxShadow: 3,
//         display: 'flex',
//         flexDirection: 'column',
//         borderRadius: 2,
//         backgroundColor: '#FAFAFA',
//         padding: { xs: 1, sm: 2, md: 2 },
//       }}
//     >
//       {/* Header & Refresh Button */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'left' }}>
//           Niyaz Stats
//         </Typography>
//         <Button
//           variant="outlined"
//           color="primary"
//           onClick={fetchNiyazStats}
//           disabled={loading}
//           sx={{
//             borderRadius: '50%',
//             padding: 1.5,
//             minWidth: 'auto',
//             height: { xs: 35, sm: 40, md: 40 },
//             width: { xs: 35, sm: 40, md: 40 },
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}
//         >
//           {loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
//         </Button>
//       </Box>

//       {/* Divider Image */}
      // <Box
      //   sx={{
      //     width: '100vw',
      //     position: 'relative',
      //     left: 'calc(-50vw + 50%)',
      //     height: { xs: 10, sm: 15, md: 15, lg: 15, xl: 15 },
      //     backgroundImage: `url(${divider})`,
      //     backgroundSize: 'contain',
      //     backgroundRepeat: 'repeat-x',
      //     backgroundPosition: 'center',
      //   }}
      // />

//       {/* Main Grid Content */}
//       <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         {/* Left: Pie Chart */}
//         <Grid item xs={12} sm={8} md={7} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//           <Card sx={{ display: 'flex', flexDirection: 'column', padding: 1, alignItems: 'center', width: '100%', }}>
//             {/* Pie Chart */}
//             <Box sx={{ width: '100%', height: '220px', display: 'flex', justifyContent: 'center', marginLeft: 10 }}>
//               <PieChart
//                 series={[
//                   {
//                     data: safeChartData,
//                     highlightScope: { fade: 'global', highlight: 'item' },
//                     faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
//                     valueFormatter: (_, datum) => datum.percentage,
//                   },
//                 ]}
//                 height={220} // Reduced size
//               />
//             </Box>

//             {/* Legends Section BELOW the Pie Chart */}
//             <Box
//               sx={{
//                 display: 'flex',
//                 flexWrap: 'wrap',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 gap: 1.5,
//                 marginTop: 2,
//                 width: '100%',
//               }}
//             >
//               {chartData.map((entry, index) => (
//                 <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <Box sx={{ width: 12, height: 12, backgroundColor: entry.color, borderRadius: '50%' }} />
//                   <Typography variant="body2" sx={{ fontSize: 12 }}>
//                     {entry.name} - {entry.percentage}
//                   </Typography>
//                 </Box>
//               ))}
//             </Box>
//           </Card>
//   </Grid>

//         {/* Right: Niyaz Details */}
//         <Grid item xs={12} sm={4} md={5}>
//           <CardContent sx={{ paddingRight: 0.5, paddingLeft: 3 }}>
//             <Grid container direction="column">
//               {niyazStats.map((item, index) => (
//                 <Grid item xs={12} sm={4} key={index}>
//                   <Card
//                     sx={{
//                       display: 'flex',
//                       flexDirection: 'column',
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       padding: { xs: 1.5, md: 1.6 },
//                       marginBottom: 0.4,
//                       mt:0.5
//                     }}
//                   >
//                     <CardContent>
//                       {/* <Typography
//                         gutterBottom
//                         sx={{ color: 'text.secondary', fontSize: { xs: 12, sm: 12 }, textAlign: 'center' }}
//                       >
//                         {item.slab}
//                       </Typography> */}
//                       <Typography
//                         variant="h6"
//                         align="center"
//                         sx={{
//                           whiteSpace: 'nowrap',
//                           overflow: 'hidden',
//                           textOverflow: 'ellipsis',
//                           fontSize: 12
//                         }}
//                       >
//                         {item.slab}/{item.amount} : {item.count} | {item.total}
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           </CardContent>
//         </Grid>
//       </Grid>
//     </Card>
//   );
// }


import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useUser } from '../../contexts/UserContext';
import divider from '../../assets/divider.png';
import NiyazStatsDialog from './NiyazStatsDialog';

export default function NiyazStats({ year, sector, subSector }) {
  const { token, currency } = useUser(); // Fetch currency from context
  const [niyazStats, setNiyazStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSlab, setSelectedSlab] = useState(null);

  const fetchNiyazStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.fmb52.com/api/dashboard/niyaz_stats', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sector, sub_sector: subSector, year }),
      });

      if (!response.ok) throw new Error('Failed to fetch Niyaz Stats');

      const data = await response.json();
      setNiyazStats(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error('Error fetching Niyaz Stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && year) {
      fetchNiyazStats();
    }
  }, [token, year]);

  const handleOpenDialog = (slab) => {
    setSelectedSlab(slab);
    setOpenDialog(true);
  };


  // Format currency based on user preference
  const formatCurrency = (value) => {
    if (!value || Number(value) === 0) return "N/A"; // Display 'N/A' for zero values
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency?.currency_code || 'INR', // Use user’s currency or default to INR
      minimumFractionDigits: 0, // No decimal places
      maximumFractionDigits: 0, // No decimal places
    }).format(value);
  };

  // Calculate Total Amount
  const totalAmount = niyazStats.reduce((sum, item) => sum + Number(item.total || 0), 0);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: '#FAFAFA',
        padding: 2,
    height: { xs: 'auto', md: 500 },

      }}
    >
      {/* Header & Refresh Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Niyaz Stats</Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={fetchNiyazStats}
          disabled={loading}
          sx={{
            borderRadius: '50%',
            padding: 1.5,
            minWidth: 'auto',
            height: { xs: 35, sm: 40 },
            width: { xs: 35, sm: 40 },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
        </Button>
      </Box>

      {/* Divider Image */}
      <Box
        sx={{
          width: 'calc(100% + 32px)', // Expands beyond container padding
          marginLeft: '-16px', // Counteracts default padding
          marginRight: '-16px', // Counteracts default padding
          position: 'relative',
          minHeight: 15,
          height: {
            xs: 10, // Height for extra-small screens
            sm: 15, // Height for small screens
            md: 15, // Height for medium screens
            lg: 15, // Height for large screens
            xl: 15, // Height for extra-large screens
          },
          backgroundImage: `url(${divider})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center',
          my: 2,
        }}
      />
      

      {/* Table Content */}
      <TableContainer component={Paper} sx={{ boxShadow: 0, borderRadius: 2, width: '100%' }}>
        <Table>
          {/* Table Header */}
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Niyaz Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Count</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Total</TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {niyazStats.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.slab}</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>{formatCurrency(item.amount)}</TableCell>
                <TableCell sx={{ textAlign: 'center', color: '#fca311', cursor: 'pointer' }} onClick={() => handleOpenDialog(item)}>
                  {item.count}
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>{formatCurrency(item.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>

          {/* Total Row */}
          <TableBody>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Total</TableCell>
              <TableCell colSpan={2}></TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'right', color: '#fca311' }}>
                {formatCurrency(totalAmount)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

       {/* Dialog for Viewing Users */}
       {selectedSlab && (
        <NiyazStatsDialog
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
          slabId={selectedSlab.slab_id}
          slabName={selectedSlab.slab}
        />
      )}

    </Box>
  );
}
