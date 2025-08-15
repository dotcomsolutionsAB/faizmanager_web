import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  Grid,
  Paper,
  Divider,
  Avatar
} from "@mui/material";
import divider from '../../../assets/divider.png';



/**
 * Props:
 * - open: bool
 * - onClose: () => void
 * - receipt: the row object (must include { id, hashed_id, name, amount, comments, mode })
 * - token: auth token
 * - onSaved: (updatedReceipt) => void   // parent updates the table row
 * - setSnackbarOpen, setSnackbarMessage, setSnackbarSeverity: for UX feedback
 */
export default function EditReceiptDialog({
  open,
  onClose,
  receipt,
  token,
  onSaved,
  setSnackbarOpen,
  setSnackbarMessage,
  setSnackbarSeverity,
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [comments, setComments] = useState("");
  const [saving, setSaving] = useState(false);
  const mode = receipt?.mode || "";

  console.log(receipt)

  useEffect(() => {
    if (open && receipt) {
      setName(receipt.name || "");
      setAmount(receipt.amount ?? "");
      setComments(receipt.comments || "");
    }
  }, [open, receipt]);

  // --- validation ---
  const errors = useMemo(() => {
    const e = {};
    if (!name.trim()) e.name = "Name is required.";

    // number & positive
    const amt = parseFloat(String(amount).toString().replace(/,/g, ""));
    if (isNaN(amt)) e.amount = "Enter a valid number.";
    else if (amt <= 0) e.amount = "Amount must be greater than 0.";

    // cash rule
    if (/^cash$/i.test(mode) && !e.amount) {
      if (amt > 10000) e.amount = "For Cash mode, max amount is ₹10,000.";
    }

    if (comments.length > 250) e.comments = "Comments cannot exceed 250 characters.";
    return e;
  }, [name, amount, comments, mode]);

  const hasErrors = Object.keys(errors).length > 0;

  const handleSave = async () => {
    if (hasErrors || !receipt) return;

    try {
      setSaving(true);

      // NOTE: adjust URL & payload to match your API.
      // Using a conservative endpoint design with hashed_id.
      const resp = await fetch(`https://api.fmb52.com/api/receipts/update/${receipt.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          amount: parseFloat(String(amount).toString().replace(/,/g, "")),
          comments: comments.trim(),
        }),
      });

      const json = await resp.json();

      if (!resp.ok) {
        throw new Error(json?.message || `Update failed (HTTP ${resp.status})`);
      }

      // Expect the API returns updated receipt data. If not, merge locally.
      const updated = json?.data
        ? json.data
        : {
            ...receipt,
            name: name.trim(),
            amount: parseFloat(String(amount).toString().replace(/,/g, "")),
            comments: comments.trim(),
          };

      // notify parent to update the row in the grid
      onSaved?.(updated);

      setSnackbarSeverity?.("success");
      setSnackbarMessage?.("Receipt updated successfully.");
      setSnackbarOpen?.(true);

      onClose?.();
    } catch (err) {
      setSnackbarSeverity?.("error");
      setSnackbarMessage?.(err.message || "Failed to update receipt.");
      setSnackbarOpen?.(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Receipt</DialogTitle>
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
                            <Avatar
                                src={receipt?.photo_url  || ''}
                                alt={receipt?.name}
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
                                    {receipt?.name}
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>ITS:</strong> {receipt?.its}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Sector:</strong> {receipt?.sector?.name || 'N/A'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Sub Sector:</strong> {receipt?.sub_sector?.name || 'N/A'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Folio:</strong> {receipt?.folio_no || 'N/A'}
                                        </Typography>
                                    </Grid>
                                    {/* <Grid item xs={12} sm={6} md={4}>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Year:</strong> {year || 'N/A'}
                                        </Typography>
                                    </Grid> */}
                                </Grid>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 1 }} />
        <Box mt={1} display="grid" gap={2}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name || " "}
            autoFocus
            fullWidth
          />

          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={!!errors.amount}
            helperText={errors.amount || (/^cash$/i.test(mode) ? "Cash receipts must be ≤ ₹10,000." : " ")}
            fullWidth
            inputMode="decimal"
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />

          <Box>
            <TextField
              label="Comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              error={!!errors.comments}
              helperText={errors.comments}
              fullWidth
              multiline
              minRows={2}
              inputProps={{ maxLength: 250 }}
            />
            <Box mt={0.5} display="flex" justifyContent="flex-end">
              <Typography variant="caption">{comments.length}/250</Typography>
            </Box>
          </Box>

          <TextField
            label="Mode"
            value={mode}
            fullWidth
            InputProps={{ readOnly: true }}
            helperText="Mode cannot be edited here."
          />
        </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving || hasErrors} variant="contained">
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
