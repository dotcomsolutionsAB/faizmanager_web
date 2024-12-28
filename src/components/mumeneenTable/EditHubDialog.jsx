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
} from '@mui/material';
import { useUser } from '../../UserContext'; // Assuming this is the context for user info
import divider from '../../assets/divider.png';

const EditHubDialog = ({ open, onClose, row, onSave, formatCurrency }) => {
    const [hubAmount, setHubAmount] = useState('');
    const [image, setImage] = useState(null); // State to store the uploaded image file
    const { currency } = useUser(); // Get currency info from context
    const currencySymbol = currency?.currency_symbol || '₹';

    React.useEffect(() => {
        if (row) {
            setHubAmount(row.hub_amount || ''); // Set the initial hub amount when the row changes
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
        const c = ['Hundred', 'Thousand', 'Lakh', 'Crore'];

        let result = '';

        const getHundreds = (n) => {
            let str = '';
            if (n > 99) {
                str += a[Math.floor(n / 100)] + ' ' + c[0] + ' ';
                n %= 100;
            }
            if (n > 19) {
                str += b[Math.floor(n / 10)] + ' ' + a[n % 10] + ' ';
            } else if (n > 0) {
                str += a[n] + ' ';
            }
            return str.trim();
        };

        const numStr = num.toString();
        const n = numStr.split('').reverse().join('');
        const chunks = n.match(/.{1,2}/g).map((chunk) => chunk.split('').reverse().join('')).reverse();

        for (let i = 0; i < chunks.length; i++) {
            if (chunks[i] > 0) {
                result += getHundreds(parseInt(chunks[i], 10)) + ' ' + (c[i + 1] || '') + ' ';
            }
        }

        // Add the currency symbol and terms
        result = `${currencySymbol === '₹' ? 'Rupees' : ''} ${result.trim()}`;
        return result.trim();
    };

    const handleFileChange = (event) => {
        setImage(event.target.files[0]); // Store the selected file in state
    };

    const handleSave = () => {
        const payload = {
            hubAmount,
            image, // Include the optional image in the payload
        };
        onSave(payload);
        onClose();
    };

    return (
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
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                <strong>Year</strong>
                            </Typography>
                            <Typography variant="h6">{row.year || 'N/A'}</Typography>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 1 }} />

                    <Box >
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
                    </Box>

                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            <strong>Attach Image (Optional)</strong>
                        </Typography>
                        <TextField
                            type="file"
                            onChange={handleFileChange}
                            inputProps={{ accept: 'image/*' }}
                            fullWidth
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

export default EditHubDialog;
