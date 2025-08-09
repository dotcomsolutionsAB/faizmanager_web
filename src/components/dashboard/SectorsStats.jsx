import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Button,
  Card,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../styles/AppTheme';
import { useUser } from '../../contexts/UserContext';
import divider from '../../assets/divider.png';


// Progress bar component
const ProgressBar = ({ deposited, inHand, cash, formatCurrency }) => {
  const depositedPercentage = cash > 0 ? Math.min((deposited / cash) * 100, 100) : 0;
  const inHandPercentage = cash > 0 ? Math.min((inHand / cash) * 100, 100) : 0;

  return (
    <Box>
      {/* Progress Bar */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 40,
          borderRadius: 5,
          overflow: 'hidden',
          backgroundColor: '#e0e0e0',
          marginBottom: 1,
        }}
      >
        {/* Deposited Section */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${depositedPercentage}%`,
            height: '100%',
            backgroundColor: '#3CB371',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 12,
              textAlign: 'center',
              lineHeight: '40px',
            }}
          >
            {`${Math.round(depositedPercentage)}%`}
          </Typography>
        </Box>

        {/* In Hand Section */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: `${depositedPercentage}%`,
            width: `${inHandPercentage}%`,
            height: '100%',
            backgroundColor: '#FF7043',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 12,
              textAlign: 'center',
              lineHeight: '40px',
            }}
          >
            {`${Math.round(inHandPercentage)}%`}
          </Typography>
        </Box>
      </Box>

      {/* Deposited and Cash in Hand Text */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
        <Typography
          variant="body2"
          sx={{
            color: '#3CB371',
            fontWeight: 'bold',
            fontSize: 14,
          }}
        >
          Deposited: {formatCurrency(deposited)}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#FF7043',
            fontWeight: 'bold',
            fontSize: 14,
          }}
        >
          Cash in Hand: {formatCurrency(inHand)}
        </Typography>
      </Box>
    </Box>
  );
};

// Main Table component
const SectorsStats = ({ year, sector, subSector }) => {
  const { token, currency } = useUser();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const sectorParams = sector.map((s) => `sector[]=${encodeURIComponent(s)}`).join("&");
      const subSectorParams = subSector.map((s) => `sub_sector[]=${encodeURIComponent(s)}`).join("&");

      const url = `https://api.fmb52.com/api/dashboard/cash-summary?${sectorParams}&${subSectorParams}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok && result.success) {
        setData(result.data || []);
      } else {
        throw new Error(result.message || "Failed to fetch");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     if (token && year && sector?.length > 0 && subSector?.length > 0) {
       fetchData();
     }
   }, [year, sector, subSector, token]);

   const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency?.currency_code || 'INR', // Use dynamic currency or default to INR
      minimumFractionDigits: 0, // Remove decimal points
      maximumFractionDigits: 0,
    }).format(value);
   

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Calculate total cash in hand and total deposited across all sectors
  const totalCashInHand = data.reduce((sum, row) => sum + parseInt(row.in_hand || "0", 10), 0);
  const totalDeposited = data.reduce((sum, row) => sum + parseInt(row.deposited || "0", 10), 0);
  const totalCash = data.reduce((sum, row) => sum + parseInt(row.cash || "0", 10), 0);

  return (
    <AppTheme>
      <CssBaseline />
      <Card
        sx={{
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Sectors Stats</Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={fetchData}
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

        <TableContainer component={Paper} sx={{ boxShadow: 0, borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Sector</strong></TableCell>
                <TableCell><strong>Cash</strong></TableCell>
                <TableCell><strong>Progress</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => {
                const cash = parseInt(row.cash || "0", 10);
                const deposited = parseInt(row.deposited || "0", 10);
                const inHand = parseInt(row.in_hand || "0", 10);

                return (
                  <TableRow key={row.sector_id}>
                    <TableCell sx={{width: '200px'}}>{row.sector_name}</TableCell>
                    <TableCell sx={{ width: '150px', textAlign: 'right'}}>{formatCurrency(cash)}</TableCell>
                    <TableCell>
                      <ProgressBar cash={cash} deposited={deposited} inHand={inHand} formatCurrency={formatCurrency} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableBody>
              {/* Total row for all sectors */}
              <TableRow>
                <TableCell><strong>Total</strong></TableCell>
                <TableCell sx={{textAlign: 'right'}}>{formatCurrency(totalCash)}</TableCell>
                <TableCell>
                  <ProgressBar
                    cash={totalCash}
                    deposited={totalDeposited}
                    inHand={totalCashInHand}
                    formatCurrency={formatCurrency}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </AppTheme>
  );
};

export default SectorsStats;

