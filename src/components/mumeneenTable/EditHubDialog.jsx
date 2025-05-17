import React, { useContext, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    Typography,
    Box,
    Button,
    Divider,
    Grid,
    Paper,
    TextField,
    Snackbar,
    Alert,
} from '@mui/material';
import { useUser } from '../../UserContext'; // Assuming this is the context for user info
import divider from '../../assets/divider.png';
import Avatar from '@mui/material/Avatar';


const EditHubDialog = ({ open, onClose, row, onSave, formatCurrency, year }) => {
    // console.log("Year in edit", year);
    // year = "1445-1446";
    const [hubAmount, setHubAmount] = useState('');
    const [hubAmountError, setHubAmountError] = useState(false)
    const [thaliStatus, setThaliStatus] = useState('');
    const [image, setImage] = useState(null); // State to store the uploaded image file
    const { token, currency } = useUser(); // Get currency info from context
    const currencySymbol = currency?.currency_symbol || '₹';
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const thaliStatusOptions = {
        "taking": "Taking",
        "not_taking": "Not Taking",
        "once_a_week": "Once a Week",
        "joint": "Joint",
        "other_centre": "Other Centre"
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    console.log("Year in edit", year)

    console.log("token in edit", token);

    React.useEffect(() => {
        if (row) {
            setHubAmount(row.hub_amount || ''); // Set the initial hub amount when the row changes
            setThaliStatus(row.thali_status || '');
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

    const handleFileChange = (event) => {
        setImage(event.target.files[0]); // Store the selected file in state
    };

    const handleSave = async () => {

        if (!hubAmount) {
            setHubAmountError(true);
            return;
        }
        // Create a JSON payload instead of FormData
        const payload = {
            year: year, // Pass the year
            hub_amount: hubAmount, // Pass the selected hub amount
            thali_status: thaliStatus,
        };

        console.log(JSON.stringify(payload))
        try {
            const response = await fetch(`https://api.fmb52.com/api/hub/update/${row.family_id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token
                    'Content-Type': 'application/json', // Set Content-Type to JSON
                },
                body: JSON.stringify(payload), // Convert the payload to JSON
            });

            const result = await response.json();


            if (response.ok) {
                console.log('API Response:', result); // Log the response for debugging
                setSnackbar({ open: true, message: result.message, severity: 'success' }); // Show success message
                onSave(result.data); // Pass updated data back to the parent
                onClose(); // Close the dialog
            } else {
                console.error('Failed to update hub amount:', response.statusText);
                setSnackbar({ open: true, message: result.message || 'Failed to update hub amount', severity: 'error' });
            }
        } catch (error) {
            console.error('Error during API call:', error);
            setSnackbar({ open: true, message: 'An error occurred while saving', severity: 'error' });
        }
    };


    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>Edit Hub Amount</DialogTitle>
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
  {/* Avatar Image */}
  <Avatar
    src={row.photo?.file_url || ''}
    alt={row.name}
    variant="square"
    sx={{
      width: 82,
      height: 86,
      border: '2px solid #eee',
      borderRadius: 1, // square with slight rounding
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
          <strong>Year:</strong> {year || 'N/A'}
        </Typography>
      </Grid>
    </Grid>
  </Box>
</Box>

                        

                        <Divider sx={{ my: 1 }} />

                        {/* <Box >
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            <strong>Update Hub Amount</strong>
                        </Typography>
                        <Select
                            value={hubAmount}
                            onChange={(e) => setHubAmount(e.target.value)}
                            fullWidth
                            renderValue={(selected) => {
                                const matchedItem = [172000, 129000, 86000, 57500, 43000, 34500].includes(selected);
                                return matchedItem ? formatCurrency(selected) : `${formatCurrency(selected)}`;
                            }}
                        >
                            {[172000, 129000, 86000, 57500, 43000, 34500].map((amount) => (
                                <MenuItem key={amount} value={amount}>
                                    {formatCurrency(amount)}
                                </MenuItem>
                            ))}
                        </Select>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1, ml: 1 }}>
                            {hubAmount ? numberToWords(hubAmount, currencySymbol) : 'Please enter the amount in numbers'}
                        </Typography>
                    </Box> */}

                      <Grid container spacing={2}>
  {/* Hub Amount */}
  <Grid item xs={12} md={6}>
    <Typography variant="body2" color="textSecondary" gutterBottom>
      <strong>Update Hub Amount</strong>
    </Typography>
    <TextField
      type="number"
      value={hubAmount}
      onChange={(e) => {
        setHubAmount(e.target.value);
        setHubAmountError(false);
      }}
      fullWidth
      placeholder="Enter amount"
      error={hubAmountError}
      helperText={hubAmountError ? "Hub Amount is required" : ""}
    />
    <Typography variant="body2" color="textSecondary" sx={{ mt: 1, ml: 1 }}>
      {hubAmount ? numberToWords(hubAmount, currencySymbol) : 'Please enter the amount in numbers'}
    </Typography>
  </Grid>

  {/* Thali Status */}
  <Grid item xs={12} md={6}>
    <Typography variant="body2" color="textSecondary" gutterBottom>
      <strong>Thali Status</strong>
    </Typography>
    <Select
      value={thaliStatus || ""}
      onChange={(e) => setThaliStatus(e.target.value)}
      displayEmpty
      sx={{ pt: 1.7, pb: 1.7 }}
      fullWidth
      renderValue={(selected) => {
        if (!selected) {
          return <Typography color="textSecondary">Select Thali Status</Typography>;
        }
        return thaliStatusOptions[selected] || selected;
      }}
      MenuProps={{
        disablePortal: true,
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
        transformOrigin: { vertical: "top", horizontal: "left" },
        PaperProps: {
          sx: {
            mt: 1,
            maxHeight: 200,
            overflowY: "auto",
          }
        }
      }}
    >
      <MenuItem value="" disabled>
        Select Thali Status
      </MenuItem>
      {Object.entries(thaliStatusOptions).map(([value, label]) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </Select>
  </Grid>
</Grid>

                        {/* <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                <strong>Attach Image (Optional)</strong>
                            </Typography>
                            <TextField
                                type="file"
                                onChange={handleFileChange}
                                inputProps={{ accept: 'image/*' }}
                                fullWidth
                            />
                        </Box> */}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} color="primary" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary" variant="contained" disabled={!hubAmount}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default EditHubDialog;
