// AddZabihatReceipt.jsx
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    Select,
    MenuItem,
    Button,
    Snackbar,
    Alert,
    Divider
} from "@mui/material";
import { useUser } from "../../contexts/UserContext";
import divider from "../../assets/divider.png"

const AddBookingsReceipt = ({ open, onClose, row, onSuccess }) => {
    const { token } = useUser();

    const [amount, setAmount] = useState("");
    const [mode, setMode] = useState("cash");
    const [comments, setComments] = useState("");

    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

useEffect(() => {
    if (row) {
        // Do NOT preload amount – keep it empty
        setAmount("");
        setMode("cash");
        setComments("");
    }
}, [row]);


    const handleSnackbarClose = () =>
        setSnackbar((s) => ({ ...s, open: false }));

    if (!row) return null;

    const handleSave = async () => {
        if (!amount || !mode) {
            setSnackbar({
                open: true,
                message: "Amount and mode are required.",
                severity: "error",
            });
            return;
        }

        const payload = {
            name: row.name,
            its: String(row.its),
            commitment_id: row.id,      // 👈 commitment row id
            amount: Number(amount),
            mode,
            comments: comments || "",
        };

        try {
            setLoading(true);

            const response = await fetch(
                "https://api.fmb52.com/api/commitment_receipt/create",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.message || "Failed to create receipt.");
            }

            setSnackbar({
                open: true,
                message: json.message || "Commitment Receipt created successfully.",
                severity: "success",
            });

            // Let parent refresh list
            if (onSuccess) onSuccess(json);
            onClose();
        } catch (err) {
            console.error("Add receipt error:", err);
            setSnackbar({
                open: true,
                message: err.message || "Something went wrong.",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>Add Zabihat Receipt</DialogTitle>

                {/* Divider strip like other dialogs */}
                <Box
                    sx={{
                        width: "calc(100% + 24px)",
                        position: "relative",
                        height: { xs: 10, sm: 15, md: 15, lg: 15, xl: 15 },
                        backgroundImage: `url(${divider})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "repeat-x",
                        backgroundPosition: "center",
                        marginLeft: "-24px",
                        marginRight: "-24px",
                    }}
                />

                <DialogContent>
                    <Box
                        component={Paper}
                        elevation={1}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            backgroundColor: "#F7F4F1",
                            display: "flex",
                            flexDirection: "column",
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
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    {row.name}
                                </Typography>
                                <Grid container spacing={1} sx={{ mt: 1 }}>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>ITS:</strong> {row.its}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Type:</strong> {row.type}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Commitment Amount:</strong> {row.amount}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>

                        <Divider />


                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    gutterBottom
                                >
                                    <strong>Receipt Amount</strong>
                                </Typography>
                                <TextField
                                    type="number"
                                    fullWidth
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    gutterBottom
                                >
                                    <strong>Mode</strong>
                                </Typography>
                                <Select
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value)}
                                    fullWidth
                                    sx={{ pt: 1.7, pb: 1.7 }}
                                >
                                    <MenuItem value="cash">Cash</MenuItem>
                                    <MenuItem value="online">Online</MenuItem>
                                    <MenuItem value="cheque">Cheque</MenuItem>
                                    <MenuItem value="other">NEFT</MenuItem>
                                </Select>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    gutterBottom
                                >
                                    <strong>Comments</strong>
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={1}
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder="Any comments for this receipt (optional)"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={onClose}
                        color="primary"
                        variant="outlined"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        color="primary"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Receipt"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                onClose={handleSnackbarClose}
                autoHideDuration={4000}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AddBookingsReceipt;
