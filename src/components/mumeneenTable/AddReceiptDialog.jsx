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
import Avatar from '@mui/material/Avatar';


const AddReceiptDialog = ({ open, onClose, row, onSave, formatCurrency }) => {
  const [receiptAmount, setReceiptAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [receiptDate, setReceiptDate] = useState('');
  const[receiptName, setReceiptName] = useState("")
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
      setReceiptName(row.name || '')
    }
  }, [row]);

  // If `row` is null or undefined, return null to prevent rendering
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

  const handleSave = () => {
    const receiptData = {
      receiptName,
      receiptAmount,
      paymentMethod,
      // receiptDate,
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
  {/* Avatar Placeholder */}
  {/* <Box
    sx={{
      width: 80,
      height: 80,
      borderRadius: '50%',
      backgroundColor: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#aaa',
    }}
  >
    {/* Optional: use initials or icon */}
    {/* <span>👤</span> */}
    {/*} <Avatar
    src={row.photo?.file_url || ''}
    alt={row.name}
    sx={{ width: 64, height: 64, border: '2px solid #eee', borderRadius: 1 }}
  />

  </Box> */}

  <Avatar
  src={row.photo?.file_url || ''}
  alt={row.name}
  variant="square"
  sx={{
    width: 82,
    height: 86,
    border: '2px solid #eee',
    borderRadius: 1, // or use 0 for sharp corners
  }}
/>


  {/* Details */}
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
          <strong>Contact:</strong>{' '}
          {row.mobile || 'N/A'}
        </Typography>
      </Grid>
    </Grid>
  </Box>
</Box>


          <Divider />

          {/* Row 1: Receipt Amount, Date, Payment Method */}

{/* Name Field Row */}
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

<Grid container spacing={1} sx={{pr: 1}}>
    {/* <Grid item xs={12} md={4}>
    <TextField
      label="Name"
      fullWidth
      value={receiptName}
       onChange={(e) => setReceiptName(e.target.value)}
    />
  </Grid> */}

  <Grid item xs={12} md={6}>
    <TextField
      type="number"
      label="Receipt Amount"
      sx={{mr: 2}}
      fullWidth
      value={receiptAmount}
      onChange={(e) => setReceiptAmount(e.target.value)}
      placeholder="Enter receipt amount"
    />
   <Typography variant="body2" color="textSecondary" sx={{ mt: 1, ml: 1 }}>
    {receiptAmount
      ? `${numberToWords(receiptAmount)}`
      : 'Enter a valid amount'}
  </Typography>
  </Grid>

  {/* <Grid item xs={12} md={4}>
    <TextField
      label="Receipt Date"
      type="date"
      fullWidth
      value={receiptDate}
      onChange={(e) => setReceiptDate(e.target.value)}
      InputLabelProps={{ shrink: true }}
    />
  </Grid> */}

  <Grid item xs={12} md={6}>
    <Select
      fullWidth
      displayEmpty
      value={paymentMethod}
       sx={{
                '& .MuiSelect-select': {
                  padding: '4px 0px', // Match the padding of TextField
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px', // Match the border radius
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

{/* Row 2: Conditional Fields */}
{paymentMethod === 'Cheque' && (
  <Grid container spacing={1} sx={{pr: 1}}>
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
        label="IFSC Code"
        value={bankDetails.ifscCode}
        onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
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
  <Grid container spacing={1} sx={{pr: 1}}>
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

{/* Row 3: Notes full width */}
<Grid container sx={{ pl: 1}}>
  <Grid item xs={12}>
    <TextField
      label="Notes"
      fullWidth
      multiline
      minRows={3}
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      placeholder="Additional notes (optional)"
    />
  </Grid>
</Grid>

        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
                            <Button onClick={onClose} color="primary" variant="outlined">
                                Cancel
                            </Button>
         <Button
                                onClick={handleSave}
                                color="primary"
                                variant="contained"
                            >
                                Save
                            </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddReceiptDialog;
