// components/payments/ApprovePaymentDialog.jsx
import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
} from '@mui/material';

const ApprovePaymentDialog = ({
  open,
  onClose,
  onSuccess,       // optional callback after successful update
  token,           // Bearer token
  paymentId,       // required: payment id
}) => {
  const [status, setStatus] = useState('approved'); // default
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancelReceipts, setCancelReceipts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isCancelled = useMemo(() => status === 'cancelled', [status]);

  const resetForm = () => {
    setStatus('approved');
    setCancellationReason('');
    setCancelReceipts(false);
    setErrorMsg('');
  };

  const handleClose = () => {
    if (submitting) return;
    resetForm();
    onClose?.();
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setErrorMsg('');

      const payload = {
        payment_id: String(paymentId),
        status, // 'approved' | 'cancelled' | 'pending' (we expose only approved/cancelled here)
        cancellation_reason: isCancelled ? cancellationReason : '',
        cancel_receipts: isCancelled ? Boolean(cancelReceipts) : false,
      };

      const res = await fetch('https://api.fmb52.com/api/payments/update_status', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      if (!res.ok) {
        // show the server message if any
        setErrorMsg(text || `Failed with status ${res.status}`);
        setSubmitting(false);
        return;
      }

      // success
      resetForm();
      onSuccess?.(); // parent can refresh the table/snackbar
      onClose?.();
    } catch (e) {
      setErrorMsg(e?.message || 'Something went wrong.');
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Payment Status</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ color: 'text.secondary' }}>
            Are you sure you want to approve this payment?  
          </Box>

          <FormControl fullWidth>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="approved">Approve</MenuItem>
              <MenuItem value="cancelled">Cancel</MenuItem>
            </Select>
          </FormControl>

          {isCancelled && (
            <>
              <TextField
                label="Cancellation reason"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                fullWidth
                multiline
                minRows={2}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={cancelReceipts}
                    onChange={(e) => setCancelReceipts(e.target.checked)}
                  />
                }
                label="Cancel the receipts as well"
              />
            </>
          )}

          {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>Close</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || (isCancelled && !cancellationReason.trim())}
        >
          {submitting ? <CircularProgress size={20} /> : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApprovePaymentDialog;
