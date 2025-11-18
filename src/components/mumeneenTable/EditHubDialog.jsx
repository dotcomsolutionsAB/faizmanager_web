import React, { useState, useEffect } from 'react';
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
import { useUser } from '../../contexts/UserContext';
import divider from '../../assets/divider.png';
import Avatar from '@mui/material/Avatar';

const EditHubDialog = ({ open, onClose, row, onSave, formatCurrency, year }) => {
    const [hubAmount, setHubAmount] = useState('');
    const [hubAmountError, setHubAmountError] = useState(false);

    // 👇 NEW: overdue amount state
    const [overdueAmount, setOverdueAmount] = useState('');
    const [overdueAmountError, setOverdueAmountError] = useState(false);

    const [thaliStatus, setThaliStatus] = useState('');
    const [image, setImage] = useState(null); // For image upload if needed
    const { token, currency } = useUser(); // Get currency info from context
    const currencySymbol = currency?.currency_symbol || '₹';

    // Snackbar state variables separated
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const thaliStatusOptions = {
        taking: 'Taking',
        not_taking: 'Not Taking',
        once_a_week: 'Once a Week',
        joint: 'Joint',
        other_centre: 'Other Centre',
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        if (row) {
            setHubAmount(row.hub_amount || '');
            setThaliStatus(row.thali_status || '');
            // 👇 preload overdue if exists
            setOverdueAmount(row.overdue ?? '');
        }
    }, [row]);

    if (!row) {
        return null;
    }

    const numberToWords = (num, currencySymbol) => {
        if (num === 0 || num === '0') return 'Zero';

        const nInt = parseInt(num, 10);
        if (Number.isNaN(nInt)) return '';

        const a = [
            '',
            'One',
            'Two',
            'Three',
            'Four',
            'Five',
            'Six',
            'Seven',
            'Eight',
            'Nine',
            'Ten',
            'Eleven',
            'Twelve',
            'Thirteen',
            'Fourteen',
            'Fifteen',
            'Sixteen',
            'Seventeen',
            'Eighteen',
            'Nineteen',
        ];
        const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

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

        let numVal = nInt;
        let result = '';
        let crore = Math.floor(numVal / 10000000);
        numVal %= 10000000;

        let lakh = Math.floor(numVal / 100000);
        numVal %= 100000;

        let thousand = Math.floor(numVal / 1000);
        numVal %= 1000;

        let hundreds = numVal;

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

        return `${currencySymbol === '₹' ? 'Rupees' : ''} ${result.trim()}`;
    };

    const handleSave = async () => {
        if (!hubAmount) {
            setHubAmountError(true);
            return;
        }

        // optional: basic validation on overdue
        if (overdueAmount !== '' && Number(overdueAmount) < 0) {
            setOverdueAmountError(true);
            return;
        }

        const payload = {
            year: year,
            hub_amount: hubAmount,
            thali_status: thaliStatus,
            // 👇 send overdue as well (backend can ignore if not used)
            overdue_amount: overdueAmount === '' ? null : overdueAmount,
        };
        console.log("Edit", payload)

        try {
            const response = await fetch(
                `https://api.fmb52.com/api/hub/update/${row.family_id}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                }
            );

            const result = await response.json();

            if (response.ok) {
                setSnackbarMessage(result.message);
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                if (onSave) onSave(result.data);
                onClose();
            } else {
                setSnackbarMessage(result.message || 'Failed to update hub amount');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage('An error occurred while saving');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
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
                        {/* Header with avatar and details */}
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
                                            <strong>Year:</strong> {year || 'N/A'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <Grid container spacing={2}>
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
                                    helperText={hubAmountError ? 'Hub Amount is required' : ''}
                                />
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    sx={{ mt: 1, ml: 1 }}
                                >
                                    {hubAmount
                                        ? numberToWords(hubAmount, currencySymbol)
                                        : 'Please enter the amount in numbers'}
                                </Typography>

                                {/* 👇 Overdue field */}
                                <Box sx={{ mt: 3 }}>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        gutterBottom
                                    >
                                        <strong>Overdue Amount</strong>
                                    </Typography>
                                    <TextField
                                        type="number"
                                        value={overdueAmount}
                                        onChange={(e) => {
                                            setOverdueAmount(e.target.value);
                                            setOverdueAmountError(false);
                                        }}
                                        fullWidth
                                        placeholder="Enter overdue amount (if any)"
                                        error={overdueAmountError}
                                        helperText={
                                            overdueAmountError
                                                ? 'Overdue amount cannot be negative'
                                                : ''
                                        }
                                    />
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ mt: 1, ml: 1 }}
                                    >
                                        {overdueAmount
                                            ? numberToWords(overdueAmount, currencySymbol)
                                            : 'If there is any overdue amount, enter it here'}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    <strong>Thali Status</strong>
                                </Typography>
                                <Select
                                    value={thaliStatus || ''}
                                    onChange={(e) => setThaliStatus(e.target.value)}
                                    displayEmpty
                                    sx={{ pt: 1.7, pb: 1.7 }}
                                    fullWidth
                                    renderValue={(selected) => {
                                        if (!selected) {
                                            return (
                                                <Typography color="textSecondary">
                                                    Select Thali Status
                                                </Typography>
                                            );
                                        }
                                        return thaliStatusOptions[selected] || selected;
                                    }}
                                    MenuProps={{
                                        disablePortal: true,
                                        anchorOrigin: {
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        },
                                        transformOrigin: {
                                            vertical: 'top',
                                            horizontal: 'left',
                                        },
                                        PaperProps: {
                                            sx: {
                                                mt: 1,
                                                maxHeight: 200,
                                                overflowY: 'auto',
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Select Thali Status
                                    </MenuItem>
                                    {Object.entries(thaliStatusOptions).map(
                                        ([value, label]) => (
                                            <MenuItem key={value} value={value}>
                                                {label}
                                            </MenuItem>
                                        )
                                    )}
                                </Select>
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
                        disabled={!hubAmount}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default EditHubDialog;
