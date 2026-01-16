import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  CardContent,
  Checkbox,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { styled } from '@mui/system';
import { yellow } from '../../styles/ThemePrimitives';
import { useUser } from '../../contexts/UserContext';
import { useOutletContext } from "react-router-dom";
import { useAppStore } from '../../appStore';
import { formatDateToDDMMYYYY } from '../../util';

// Styled stat box
const StatBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'small',
})(({ bg, color, small }) => ({
  backgroundColor: bg || '#eee',
  padding: small ? '6px 12px' : '10px 18px',
  borderRadius: 8,
  fontWeight: 600,
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  color,
  minWidth: small ? 120 : 140,
}));

// ReceiptCard component
const ReceiptCard = ({ data, compact = false, onPrint, checked, onCheckboxChange }) => {
  const { currency } = useUser();

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency?.currency_code || 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const formatDate = (dateString) => {
    return formatDateToDDMMYYYY(dateString);
  };

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: `1px solid ${yellow[400]}`,
        display: 'flex',
        overflow: 'hidden',
        width: compact ? 360 : 445,
        boxShadow: 1,
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Checkbox
            checked={checked}
            onChange={() => onCheckboxChange(data.hashed_id)}
            inputProps={{ 'aria-label': `select receipt ${data.receipt_no}` }}
          />
          <Typography fontWeight={600}>{data.receipt_no}</Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDate(data.date)}
          </Typography>
        </Box>

        <Typography mt={1}>{data.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          ITS : {data.its}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.sector}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontWeight: 600, fontSize: 13, color: yellow[400] }}>
            {data.mode.toUpperCase()}
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#16a34a' }}>
            {formatCurrency(data.amount)}
          </Typography>
        </Box>
      </CardContent>

      {/* Red bar at right */}
      <Box
        sx={{
          width: 40,
          backgroundColor: '#ef4444',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <IconButton
          sx={{
            color: '#fff',
            border: 'none',
            backgroundColor: '#ef4444',
            '&:hover': {
              backgroundColor: '#f87171',
            },
          }}
          onClick={() => onPrint && onPrint(data.hashed_id)}
          aria-label={`Print receipt ${data.receipt_no}`}
        >
          <PrintIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

// Main Component
const OverviewTable = ({ familyId }) => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, currency } = useUser();
  const { selectedYear } = useOutletContext();
  const year = selectedYear.length ? selectedYear[0] : "1445-1446";
  const [hubData, setHubData] = useState([]);
  const isSidebarOpen = useAppStore((state) => state.dopen);

  // State to track selected receipt IDs (hashed_id)
  const [selectedReceiptIds, setSelectedReceiptIds] = useState([]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency?.currency_code || 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  useEffect(() => {
    if (!token || !familyId) {
      setLoading(false);
      return;
    }
    const fetchReceipts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.fmb52.com/api/receipts/by_family_ids`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ family_ids: [familyId] }),
        });
        if (!response.ok) throw new Error(`Error fetching receipts: ${response.statusText}`);
        const data = await response.json();
        setReceipts(data?.data || []);
        // Reset selected on new data load:
        setSelectedReceiptIds([]);
      } catch (err) {
        setError('The data is currently unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchReceipts();
  }, [familyId, token]);

  useEffect(() => {
    const fetchHubData = async () => {
      try {
        const response = await fetch(`https://api.fmb52.com/api/mumeneen/hub_details/${familyId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data?.message === "Hub details fetched successfully!") {
          const filteredHubData = data.data.filter((item) => item.year === year);
          setHubData(filteredHubData);
        }
      } catch (err) {
        setError("Error fetching hub data.");
      }
    };
    fetchHubData();
  }, [token, year]);

  // Handle print icon click for single receipt
  const handlePrint = (receiptId) => {
    const printUrl = `https://api.fmb52.com/api/receipt_print/${receiptId}`;
    window.open(printUrl, '_blank', 'noopener,noreferrer');
  };

  // Handle checkbox change: toggle selected receipt
  const handleCheckboxChange = (hashed_id) => {
    setSelectedReceiptIds((prevSelected) => {
      if (prevSelected.includes(hashed_id)) {
        // Unselect
        return prevSelected.filter((id) => id !== hashed_id);
      } else {
        // Select
        return [...prevSelected, hashed_id];
      }
    });
  };

  // Handle "Print Selected" button click
  const handlePrintSelected = () => {
    if (selectedReceiptIds.length === 0) {
      alert('Please select at least one receipt to print.');
      return;
    }
    // Compose print URL with selected receipt IDs as query param, comma-separated
    const idsParam = selectedReceiptIds.join(',');
    const printUrl = `https://api.fmb52.com/api/receipt_print?receipt_ids=${encodeURIComponent(idsParam)}`;

    // Open in new tab/window
    window.open(printUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box>
      {/* Top Summary Row */}
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} md={9.5}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <StatBox bg="#e0f2fe" color="#0284c7" small={isSidebarOpen}>
              <Typography variant="h4" fontWeight={600} color="primary">
                HUB
              </Typography>
              <Typography variant="h4" fontWeight={600} color="primary">
                {formatCurrency(hubData[0]?.hub_amount || 0)}
              </Typography>
            </StatBox>
            <StatBox bg="#dcfce7" color="#15803d" small={isSidebarOpen}>
              <Typography variant="h4" fontWeight={600} color="success.main">
                PAID
              </Typography>
              <Typography variant="h4" fontWeight={600} color="success.main">
                {formatCurrency(hubData[0]?.paid_amount || 0)}
              </Typography>
            </StatBox>
            <StatBox bg="#fee2e2" color="#dc2626" small={isSidebarOpen}>
              <Typography variant="h4" fontWeight={600} color="error">
                DUE
              </Typography>
              <Typography variant="h4" fontWeight={600} color="error">
                {formatCurrency(hubData[0]?.due_amount || 0)}
              </Typography>
            </StatBox>
          </Box>
        </Grid>

        {/* Right Column: Print Selected Button */}
        <Grid item xs={12} md={2.5}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              // disabled={selectedReceiptIds.length === 0}
              onClick={handlePrintSelected}
              sx={{
                mr: 4,
                whiteSpace: 'nowrap',
                textTransform: 'none',
                padding: isSidebarOpen ? '20px 20px' : '25px 30px',
                borderRadius: 1,
                fontSize: isSidebarOpen ? '14px' : '16px',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: yellow[400],
                '&:hover': {
                  backgroundColor: yellow[100],
                  color: '#000',
                },
                '&:disabled': {
                  backgroundColor: '#ddd',
                  color: '#999',
                },
              }}
            >
              Print Selected
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Cards Section */}
      <Box mt={1} sx={{ minHeight: '595px' }}>
        <Grid container spacing={3}>
          {receipts.map((receipt) => (
            <Grid item key={receipt.id}>
              <ReceiptCard
                data={receipt}
                compact={isSidebarOpen}
                onPrint={handlePrint}
                checked={selectedReceiptIds.includes(receipt.hashed_id)}
                onCheckboxChange={handleCheckboxChange}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default OverviewTable;
