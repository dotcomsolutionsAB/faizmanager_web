import React, { useEffect, useState } from 'react';
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
  Snackbar,
  Alert,
} from '@mui/material';
import divider from '../../assets/divider.png';
import Avatar from '@mui/material/Avatar';
import { useUser } from '../../UserContext';

const AddReceiptDialog = ({ open, onClose, familyId,row, onSave, formatCurrency }) => {
  const { token } = useUser();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState(false);
  const [receiptAmount, setReceiptAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [receiptName, setReceiptName] = useState('');
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
      setReceiptName(row.name || '');
    }
  }, [row]);

  if (!row) {
    return null;
  }

  const numberToWords = (num, currencySymbol) => {
    if (num === 0) return 'Zero';

    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const c = ['', 'Thousand', 'Lakh', 'Crore'];

    const numberToWordsHelper = (n) => {
      let str = '';
      if (n > 99) {
        str += a[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      if (n > 19) {
        str += b[Math.floor(n / 10)] + ' ';
        n %= 10;
      }
      if (n > 0) {
        str += a[n] + ' ';
      }
      return str.trim();
    };

    let result = '';
    let crore = Math.floor(num / 10000000);
    num %= 10000000;

    let lakh = Math.floor(num / 100000);
    num %= 100000;

    let thousand = Math.floor(num / 1000);
    num %= 1000;

    let hundreds = num;

    if (crore > 0) {
      result += numberToWordsHelper(crore) + ' Crore ';
    }
    if (lakh > 0) {
      result += numberToWordsHelper(lakh) + ' Lakh ';
    }
    if (thousand > 0) {
      result += numberToWordsHelper(thousand) + ' Thousand ';
    }
    if (hundreds > 0) {
      result += numberToWordsHelper(hundreds);
    }

    result = result.trim();
    return `${currencySymbol === '₹' ? 'Rupees' : ''} ${result}`;
  };

    console.log(familyId)


  const handleSave = async () => {
    console.log('Saving receipt, row:', row);

    if (!familyId) {
      setSnackbar({ open: true, message: 'Family ID is required.', severity: 'error' });
      return;
    }
    if (!receiptName || receiptName.length > 100) {
      setSnackbar({ open: true, message: 'Name is required and max 100 chars.', severity: 'error' });
      return;
    }
    if (!receiptAmount || isNaN(receiptAmount)) {
      setSnackbar({ open: true, message: 'Valid amount is required.', severity: 'error' });
      return;
    }
    if (!paymentMethod) {
      setSnackbar({ open: true, message: 'Please select a payment method.', severity: 'error' });
      return;
    }


    const payload = {
      family_id: familyId, // ensure max 10 chars and string
      name: receiptName,
      amount: Number(receiptAmount),
      mode: paymentMethod.toLowerCase(),
      bank_name: paymentMethod === 'Cheque' ? bankDetails.bankName : '',
      cheque_no: paymentMethod === 'Cheque' ? bankDetails.chequeNumber : '',
      cheque_date: paymentMethod === 'Cheque' ? bankDetails.chequeDate : '',
      transaction_id: paymentMethod === 'NEFT' ? neftDetails.transactionId : '',
      transaction_date: paymentMethod === 'NEFT' ? neftDetails.transactionDate : '',
      comments: notes,
    };

    setLoading(true);
    try {
      const response = await fetch('https://api.fmb52.com/api/receipts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (response.ok) {
        setSnackbar({ open: true, message: data.message || 'Receipt added successfully!', severity: 'success' });
        if (onSave) onSave(data);
        onClose();
      } else {
        setSnackbar({ open: true, message: data.message || 'Failed to add receipt.', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: `Error: ${error.message}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                backgroundColor: '#fff',
                padding: 2,
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Avatar
                src={row.photo?.file_url || ''}
                alt={row.name}
                variant="square"
                sx={{
                  width: 82,
                  height: 86,
                  border: '2px solid #eee',
                  borderRadius: 1,
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  {row.name}
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>ITS:</strong> {row.its}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Sector:</strong> {row.sector?.name || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Sub Sector:</strong> {row.sub_sector?.name || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Folio:</strong> {row.folio_no || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Contact:</strong> {row.mobile || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            <Divider />

            <Grid container spacing={1} sx={{ pr: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  fullWidth
                  value={receiptName}
                  onChange={(e) => setReceiptName(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container spacing={1} sx={{ pr: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  type="number"
                  label="Receipt Amount"
                  sx={{ mr: 2 }}
                  fullWidth
                  value={receiptAmount}
                  onChange={(e) => setReceiptAmount(e.target.value)}
                  placeholder="Enter receipt amount"
                />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1, ml: 1 }}>
                  {receiptAmount ? `${numberToWords(receiptAmount)}` : 'Enter a valid amount'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Select
                  fullWidth
                  displayEmpty
                  value={paymentMethod}
                  sx={{
                    '& .MuiSelect-select': {
                      padding: '4px 0px',
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '4px',
                    },
                  }}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  renderValue={(selected) =>
                    selected ? selected : <span style={{ color: '#aaa' }}>Select Payment Method</span>
                  }
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Cheque">Cheque</MenuItem>
                  <MenuItem value="NEFT">NEFT</MenuItem>
                </Select>
              </Grid>
            </Grid>

            {paymentMethod === 'Cheque' && (
              <Grid container spacing={1} sx={{ pr: 1 }}>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Bank Name"
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Cheque Number"
                    value={bankDetails.chequeNumber}
                    onChange={(e) => setBankDetails({ ...bankDetails, chequeNumber: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Cheque Date"
                    type="date"
                    value={bankDetails.chequeDate}
                    onChange={(e) => setBankDetails({ ...bankDetails, chequeDate: e.target.value })}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            )}

            {paymentMethod === 'NEFT' && (
              <Grid container spacing={1} sx={{ pr: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Transaction ID"
                    value={neftDetails.transactionId}
                    onChange={(e) => setNeftDetails({ ...neftDetails, transactionId: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Transaction Date"
                    type="date"
                    value={neftDetails.transactionDate}
                    onChange={(e) => setNeftDetails({ ...neftDetails, transactionDate: e.target.value })}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            )}

            <Grid container sx={{ pl: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  fullWidth
                  multiline
                  minRows={1}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes (optional)"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="primary" variant="outlined" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddReceiptDialog;
