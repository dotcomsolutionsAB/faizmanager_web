// import React, { useState, useEffect } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   CircularProgress,
//   Typography,
//   Box,
//   Button,
//   Card,
// } from '@mui/material';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import CssBaseline from '@mui/material/CssBaseline';
// import AppTheme from '../../styles/AppTheme';
// import { useUser } from '../../UserContext';
// import divider from '../../assets/divider.png';

// // Progress Bar Component (For Done vs Pending)
// const ProgressBar = ({ done, pending, total }) => {
//   const donePercentage = total > 0 ? Math.min((done / total) * 100, 100) : 0;
//   const pendingPercentage = total > 0 ? Math.min((pending / total) * 100, 100) : 0;

//   return (
//     <Box>
//       {/* Progress Bar */}
//       <Box
//         sx={{
//           position: 'relative',
//           width: '100%',
//           height: 40,
//           borderRadius: 5,
//           overflow: 'hidden',
//           backgroundColor: '#e0e0e0',
//           marginBottom: 1,
//         }}
//       >
//         {/* Done Section */}
//         <Box
//           sx={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: `${donePercentage}%`,
//             height: '100%',
//             backgroundColor: '#3CB371', // Green for Done
//           }}
//         >
//           <Typography
//             variant="body2"
//             sx={{
//               color: 'white',
//               fontWeight: 'bold',
//               fontSize: 12,
//               textAlign: 'center',
//               lineHeight: '40px',
//             }}
//           >
//             {`${Math.round(donePercentage)}%`}
//           </Typography>
//         </Box>

//         {/* Pending Section */}
//         <Box
//           sx={{
//             position: 'absolute',
//             top: 0,
//             left: `${donePercentage}%`,
//             width: `${pendingPercentage}%`,
//             height: '100%',
//             backgroundColor: '#FF7043', // Orange for Pending
//           }}
//         >
//           <Typography
//             variant="body2"
//             sx={{
//               color: 'white',
//               fontWeight: 'bold',
//               fontSize: 12,
//               textAlign: 'center',
//               lineHeight: '40px',
//             }}
//           >
//             {`${Math.round(pendingPercentage)}%`}
//           </Typography>
//         </Box>
//       </Box>

//       {/* Done and Pending Text */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
//         <Typography
//           variant="body2"
//           sx={{
//             color: '#3CB371',
//             fontWeight: 'bold',
//             fontSize: 14,
//           }}
//         >
//           Done: {done}
//         </Typography>
//         <Typography
//           variant="body2"
//           sx={{
//             color: '#FF7043',
//             fontWeight: 'bold',
//             fontSize: 14,
//           }}
//         >
//           Pending: {pending}
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// // Main Table Component
// const MohallaWiseStats = ({ year, sector, subSector }) => {
//   const { token } = useUser();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('https://api.fmb52.com/api/mohalla_wise', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ sector, sub_sector: subSector }),
//       });

//       const result = await response.json();
//       console.log("API Response:", result);

//       if (response.ok && result.status) {
//         setData(result.data || []);
//       } else {
//         throw new Error(result.message || "Failed to fetch");
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchData();
//     }
//   }, [token]);

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   // Calculate total done and pending across all Mohallas
//   const totalDone = data.reduce((sum, row) => sum + parseInt(row.done || "0", 10), 0);
//   const totalPending = data.reduce((sum, row) => sum + parseInt(row.pending || "0", 10), 0);
//   const totalHof = data.reduce((sum, row) => sum + parseInt(row.total_hof || "0", 10), 0);

//   return (
//     <AppTheme>
//       <CssBaseline />
//       <Card
//         sx={{
//           width: '100%',
//           boxShadow: 3,
//           borderRadius: 2,
//           backgroundColor: '#FAFAFA',
//           padding: 2,
//           display: 'flex',
//           flexDirection: 'column',
//           gap: 2,
//         }}
//       >
//         {/* Header Section */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography variant="h6">Mohalla Wise Stats</Typography>
//           <Button
//             variant="outlined"
//             color="primary"
//             onClick={fetchData}
//             disabled={loading}
//             sx={{
//               borderRadius: '50%',
//               padding: 1.5,
//               minWidth: 'auto',
//               height: { xs: 35, sm: 40 },
//               width: { xs: 35, sm: 40 },
//             }}
//           >
//             {loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
//           </Button>
//         </Box>

//         {/* Divider */}
//         <Box
//           sx={{
//             width: '100vw',
//             position: 'relative',
//             left: 'calc(-50vw + 50%)',
//             height: 15,
//             backgroundImage: `url(${divider})`,
//             backgroundSize: 'contain',
//             backgroundRepeat: 'repeat-x',
//             backgroundPosition: 'center',
//           }}
//         />

//         {/* Table Section */}
//         <TableContainer component={Paper} sx={{ boxShadow: 0, borderRadius: 2 }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell><strong>Sector</strong></TableCell>
//                 <TableCell><strong>Total HOF</strong></TableCell>
//                 <TableCell><strong>Progress</strong></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {data.map((row) => (
//                 <TableRow key={row.mohalla}>
//                   <TableCell sx={{ width: '200px' }}>{row.mohalla}</TableCell>
//                   <TableCell sx={{ width: '150px' }}>{row.total_hof}</TableCell>
//                   <TableCell>
//                     <ProgressBar total={row.total_hof} done={row.done} pending={row.pending} />
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//             <TableBody>
//               {/* Total row for all Mohallas */}
//               <TableRow>
//                 <TableCell><strong>Total</strong></TableCell>
//                 <TableCell sx={{ textAlign: 'right' }}>{totalHof}</TableCell>
//                 <TableCell>
//                   <ProgressBar total={totalHof} done={totalDone} pending={totalPending} />
//                 </TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Card>
//     </AppTheme>
//   );
// };

// export default MohallaWiseStats;

import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useUser } from "../../contexts/UserContext";
import divider from "../../assets/divider.png";
import MohallaWiseDialog from "./MohallaWiseStatsDialog";

export default function MohallaWiseStats({ year, sector, subSector }) {
  const { token, currency } = useUser(); // Fetch currency from context
  const [mohallaData, setMohallaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSectorId, setSelectedSectorId] = useState(null);
  const [selectedType, setSelectedType] = useState("done");

  const fetchMohallaStats = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.fmb52.com/api/dashboard/mohalla_wise", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sector, sub_sector: subSector, year }),
      });

      if (!response.ok) throw new Error("Failed to fetch Mohalla stats");

      const data = await response.json();
      setMohallaData(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching Mohalla stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && year) {
      fetchMohallaStats();
    }
  }, [year, token]);

  // Format currency dynamically based on user’s currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency?.currency_code || 'INR', // Use user’s currency or default to INR
      minimumFractionDigits: 0, // No decimal places
      maximumFractionDigits: 0, // No decimal places
    }).format(value);
  };

  const handleOpenDialog = (sectorId, type) => {
    setSelectedSectorId(sectorId);
    setSelectedType(type);
    setDialogOpen(true);
  };


  return (
    <Box
      sx={{
        minWidth: { xs: 250, sm: 350, md: 500 },
        width: "100%",
        height: { xs: 'auto', md: 500 },
        backgroundColor: "#FAFAFA",
        borderRadius: 2,
        boxShadow: 3,
        padding: 2,
      }}
    >
      {/* Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Takhmeen 1446 - 1447H (Sector Wise)</Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={fetchMohallaStats}
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

      {/* Decorative Divider */}
      <Box
        sx={{
          width: 'calc(100% + 32px)', // Expands beyond container padding
          marginLeft: '-16px', // Counteracts default padding
          marginRight: '-16px', // Counteracts default padding
          height: { xs: 10, sm: 15, md: 15 },
          backgroundImage: `url(${divider})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center',
          my: 2,
        }}
      />

      {/* Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", padding: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Sector</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Total HOF</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Hub</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Paid</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Due</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mohallaData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontWeight: "bold" }}>{item.sector}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{item.total_hof}</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>{formatCurrency(item.amount)}</TableCell>

                  <TableCell sx={{ color: "#F4A261", fontWeight: "bold", textAlign: "center", cursor: 'pointer' }} onClick={() => handleOpenDialog(item.sector_id, "done")}>
                    {formatCurrency(item.done)}
                  </TableCell>
                  <TableCell sx={{ color: "#E76F51", fontWeight: "bold", textAlign: "center", cursor: 'pointer' }} onClick={() => handleOpenDialog(item.sector_id, "pending")}>
                    {formatCurrency(item.pending)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

       {/* Mohalla Wise Dialog */}
       {dialogOpen && (
        <MohallaWiseDialog
          open={dialogOpen}
          handleClose={() => setDialogOpen(false)}
          sectorId={selectedSectorId}
          type={selectedType}
        />
      )}
    </Box>
  );
}
