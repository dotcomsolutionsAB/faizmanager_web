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
import Avatar from '@mui/material/Avatar';
import { useUser } from '../../contexts/UserContext';
import divider from '../../assets/divider.png';

const EditHubDialog = ({ open, onClose, row, onSave, formatCurrency, year }) => {
  const [hubAmount, setHubAmount] = useState('');
  const [hubAmountError, setHubAmountError] = useState(false);

  const [overdueAmount, setOverdueAmount] = useState('');
  const [overdueAmountError, setOverdueAmountError] = useState(false);

  const [zabihatCount, setZabihatCount] = useState('');
  const [zabihatCountError, setZabihatCountError] = useState(false);

  const [attachments, setAttachments] = useState([]); // File[]
  const [attachmentInputKey, setAttachmentInputKey] = useState(0);

  const [thaliStatus, setThaliStatus] = useState('');

  const { token, currency } = useUser();
  const currencySymbol = currency?.currency_symbol || '₹';

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

  const handleSnackbarClose = () => setSnackbarOpen(false);

  useEffect(() => {
    if (row) {
      setHubAmount(row.hub_amount ?? '');
      setThaliStatus(row.thali_status ?? '');
      setOverdueAmount(row.overdue ?? row.overdue_amount ?? '');
      setZabihatCount(row.zabihat_count ?? row.zabihat ?? '');
      setAttachments([]);
      setAttachmentInputKey((k) => k + 1);
      setHubAmountError(false);
      setOverdueAmountError(false);
      setZabihatCountError(false);
    }
  }, [row]);

  if (!row) return null;

  const numberToWords = (num, currencySymbol) => {
    if (num === 0 || num === '0') return 'Zero';

    const nInt = parseInt(num, 10);
    if (Number.isNaN(nInt)) return '';

    const a = [
      '',
      'One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
      'Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen',
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const helper = (n) => {
      let str = '';
      if (n > 99) {
        str += a[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      if (n > 19) {
        str += b[Math.floor(n / 10)] + ' ';
        n %= 10;
      }
      if (n > 0) str += a[n] + ' ';
      return str.trim();
    };

    let numVal = nInt;
    let result = '';

    const crore = Math.floor(numVal / 10000000);
    numVal %= 10000000;

    const lakh = Math.floor(numVal / 100000);
    numVal %= 100000;

    const thousand = Math.floor(numVal / 1000);
    numVal %= 1000;

    const hundreds = numVal;

    if (crore > 0) result += helper(crore) + ' Crore ';
    if (lakh > 0) result += helper(lakh) + ' Lakh ';
    if (thousand > 0) result += helper(thousand) + ' Thousand ';
    if (hundreds > 0) result += helper(hundreds);

    return `${currencySymbol === '₹' ? 'Rupees' : ''} ${result.trim()}`;
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachments(files);
  };

  const removeFileAt = (idx) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const validateNonNegativeNumber = (val) => {
    if (val === '' || val === null || typeof val === 'undefined') return true;
    return Number(val) >= 0;
  };

  const validateNonNegativeInteger = (val) => {
    if (val === '' || val === null || typeof val === 'undefined') return true;
    const n = Number(val);
    return Number.isInteger(n) && n >= 0;
  };

  const handleSave = async () => {
    if (!hubAmount) {
      setHubAmountError(true);
      return;
    }

    if (!validateNonNegativeNumber(overdueAmount)) {
      setOverdueAmountError(true);
      return;
    }

    if (!validateNonNegativeInteger(zabihatCount)) {
      setZabihatCountError(true);
      return;
    }

    const formData = new FormData();
    formData.append('year', year);
    formData.append('hub_amount', hubAmount);
    formData.append('thali_status', thaliStatus || '');

    formData.append('overdue_amount', overdueAmount !== '' ? overdueAmount : '');
    formData.append('zabihat_count', zabihatCount !== '' ? zabihatCount : '');

    attachments.forEach((file) => {
      formData.append('attachments[]', file);
    });

    try {
      const response = await fetch(`https://api.fmb52.com/api/hub/update/${row.family_id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      let result = null;
      try {
        result = await response.json();
      } catch (e) {}

      if (response.ok) {
        setSnackbarMessage(result?.message || 'Updated successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        if (onSave) onSave(result?.data);
        onClose();
      } else {
        setSnackbarMessage(result?.message || 'Failed to update hub amount');
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
            height: { xs: 10, sm: 15, md: 15, lg: 15, xl: 15 },
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
              p: 2,
              borderRadius: 2,
              backgroundColor: '#F7F4F1',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            {/* Header */}
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

            <Divider />

            {/* ✅ MAIN FORM GRID (this is the fix) */}
            <Grid container spacing={2} pr={3} >
              {/* Row 1: Hub Amount (6) + Thali Status (6) */}
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

                <Typography variant="body2" color="textSecondary" sx={{ mt: 1, ml: 1 }}>
                  {hubAmount ? numberToWords(hubAmount, currencySymbol) : 'Please enter the amount in numbers'}
                </Typography>
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
                    if (!selected) return <Typography color="textSecondary">Select Thali Status</Typography>;
                    return thaliStatusOptions[selected] || selected;
                  }}
                  MenuProps={{
                    disablePortal: true,
                    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                    transformOrigin: { vertical: 'top', horizontal: 'left' },
                    PaperProps: { sx: { mt: 1, maxHeight: 200, overflowY: 'auto' } },
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

              {/* Row 2: Overdue (6) + Zabihat (6) */}
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
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
                  placeholder="Enter overdue amount"
                  error={overdueAmountError}
                  helperText={overdueAmountError ? 'Overdue amount cannot be negative' : ''}
                />

                <Typography variant="body2" color="textSecondary" sx={{ mt: 1, ml: 1 }}>
                  {overdueAmount ? numberToWords(overdueAmount, currencySymbol) : 'If any overdue, enter here'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>Zabihat</strong>
                </Typography>

                <TextField
                  type="number"
                  value={zabihatCount}
                  onChange={(e) => {
                    setZabihatCount(e.target.value);
                    setZabihatCountError(false);
                  }}
                  fullWidth
                  placeholder="Enter zabihat count"
                  error={zabihatCountError}
                  helperText={zabihatCountError ? 'Zabihat must be a non-negative integer' : ''}
                  inputProps={{ min: 0, step: 1 }}
                />

                <Typography variant="body2" color="textSecondary" sx={{ mt: 1, ml: 1 }}>
                  {zabihatCount !== '' ? `Count: ${zabihatCount}` : 'Enter zabihat count (number)'}
                </Typography>
              </Grid>

              {/* Row 3: Attachments (12) */}
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>Attachments</strong>
                </Typography>

                <Button variant="outlined" component="label" fullWidth>
                  Choose files
                  <input
                    key={attachmentInputKey}
                    hidden
                    multiple
                    type="file"
                    onChange={handleFilesChange}
                  />
                </Button>

                {attachments.length > 0 && (
                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.5,
                      borderRadius: 1,
                      backgroundColor: '#fff',
                      border: '1px solid #eee',
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                      Selected files
                    </Typography>

                    {attachments.map((f, idx) => (
                      <Box
                        key={`${f.name}-${idx}`}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 2,
                          py: 0.5,
                        }}
                      >
                        <Typography variant="body2" color="textSecondary" sx={{ wordBreak: 'break-all' }}>
                          {f.name} ({Math.ceil(f.size / 1024)} KB)
                        </Typography>
                        <Button size="small" color="error" onClick={() => removeFileAt(idx)}>
                          Remove
                        </Button>
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
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
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditHubDialog;
