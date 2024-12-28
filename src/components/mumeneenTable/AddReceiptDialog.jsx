import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  MenuItem,
  Select,
} from '@mui/material';
import divider from '../../assets/divider.png';

const AddReceiptDialog = ({ open, onClose, row, onSave, formatCurrency }) => {
  const [receiptAmount, setReceiptAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [receiptDate, setReceiptDate] = useState('');
  const [notes, setNotes] = useState('');
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    ifscCode: '',
    chequeNumber: '',
    chequeDate: '',
  });
  const [neftDetails, setNeftDetails] = useState({
    transactionId: '',
    transactionDate: '',
  });

  useEffect(() => {
    if (row) {
      setReceiptAmount('');
      setPaymentMethod('');
      setReceiptDate('');
      setNotes('');
      setBankDetails({
        bankName: '',
        ifscCode: '',
        chequeNumber: '',
        chequeDate: '',
      });
      setNeftDetails({
        transactionId: '',
        transactionDate: '',
      });
    }
  }, [row]);

  // If `row` is null or undefined, return null to prevent rendering
  if (!row) {
    return null;
  }

  const handleSave = () => {
    const receiptData = {
      receiptAmount,
      paymentMethod,
      receiptDate,
      notes,
      ...(paymentMethod === 'Cheque' && bankDetails),
      ...(paymentMethod === 'NEFT' && neftDetails),
    };
    onSave(receiptData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Receipt</DialogTitle>
      <Box
        sx={{
          width: 'calc(100% + 24px)',
          position: 'relative',
          height: {
            xs: 10,
            sm: 15,
            md: 15,
            lg: 15,
            xl: 15,
          },
          backgroundImage: `url(${divider})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center',
          marginLeft: '-24px',
          marginRight: '-24px',
        }}
      />
      <DialogContent>
        <Box
          component={Paper}
          elevation={1}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: '#F7F4F1',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Name</strong>
              </Typography>
              <Typography variant="h6">{row.name}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>ITS</strong>
              </Typography>
              <Typography variant="h6">{row.its}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Sector</strong>
              </Typography>
              <Typography variant="h6">
                {row.sector?.name || 'N/A'} - {row.sub_sector?.name || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Folio No</strong>
              </Typography>
              <Typography variant="h6">{row.folio_no}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Receipt Amount</strong>
            </Typography>
            <TextField
              type="number"
              fullWidth
              value={receiptAmount}
              onChange={(e) => setReceiptAmount(e.target.value)}
              placeholder="Enter receipt amount"
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, ml: 1 }}>
              {receiptAmount ? `(${formatCurrency(receiptAmount)})` : 'Enter a valid amount'}
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Payment Method</strong>
            </Typography>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              fullWidth
              displayEmpty
              sx={{
                '& .MuiSelect-select': {
                  padding: '7px 0px', // Match the padding of TextField
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px', // Match the border radius
                },
              }}
            >
              <MenuItem value="" disabled>
                Select Payment Method
              </MenuItem>
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Cheque">Cheque</MenuItem>
              <MenuItem value="NEFT">NEFT</MenuItem>
            </Select>
          </Box>

          

          {/* Conditional Fields for Cheque */}
          {paymentMethod === 'Cheque' && (
            <Box sx={{ mt: 2, gap: 2, display: 'flex', flexDirection: 'column' }}>
              <TextField
                label="Bank Name"
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                fullWidth
              />
              <TextField
                label="IFSC Code"
                value={bankDetails.ifscCode}
                onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                fullWidth
              />
              <TextField
                label="Cheque Number"
                value={bankDetails.chequeNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, chequeNumber: e.target.value })}
                fullWidth
              />
              <TextField
                label="Cheque Date"
                type="date"
                value={bankDetails.chequeDate}
                onChange={(e) => setBankDetails({ ...bankDetails, chequeDate: e.target.value })}
                fullWidth
              />
            </Box>
          )}

          {/* Conditional Fields for NEFT */}
          {paymentMethod === 'NEFT' && (
            <Box sx={{ mt: 2, gap: 2, display: 'flex', flexDirection: 'column' }}>
              <TextField
                label="Transaction ID"
                value={neftDetails.transactionId}
                onChange={(e) => setNeftDetails({ ...neftDetails, transactionId: e.target.value })}
                fullWidth
              />
              <TextField
                label="Transaction Date"
                type="date"
                value={neftDetails.transactionDate}
                onChange={(e) => setNeftDetails({ ...neftDetails, transactionDate: e.target.value })}
                fullWidth
              />
            </Box>
          )}


<Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Receipt Date</strong>
            </Typography>
            <TextField
              type="date"
              fullWidth
              value={receiptDate}
              onChange={(e) => setReceiptDate(e.target.value)}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Notes</strong>
            </Typography>
            <TextField
              fullWidth
              multiline
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes (optional)"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="outlined">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddReceiptDialog;
