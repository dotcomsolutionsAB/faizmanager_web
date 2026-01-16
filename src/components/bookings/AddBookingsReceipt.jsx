// AddBookingsReceipt.jsx
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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import divider from "../../assets/divider.png"

const AddBookingsReceipt = ({ open, onClose, row, onSuccess }) => {
    const { token } = useUser();

    const [amount, setAmount] = useState("");
    const [mode, setMode] = useState("cash");
    const [name, setName] = useState("");
    const [comments, setComments] = useState("");
    const [bankDetails, setBankDetails] = useState({
        bankName: "",
        chequeNumber: "",
        chequeDate: "",
    });
    const [neftDetails, setNeftDetails] = useState({
        transactionId: "",
        transactionDate: "",
    });
    const [bankList, setBankList] = useState([]);

    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // Fetch bank list
    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await fetch("https://api.fmb52.com/api/banks", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok && data.status && Array.isArray(data.data)) {
                    setBankList(data.data);
                }
            } catch (err) {
                console.error("Error fetching banks:", err);
            }
        };

        if (open) {
            fetchBanks();
        }
    }, [open, token]);

    useEffect(() => {
        if (row) {
            // Do NOT preload amount – keep it empty
            setAmount("");
            setMode("cash");
            setName(row.name || "");
            setComments("");
            setBankDetails({
                bankName: "",
                chequeNumber: "",
                chequeDate: "",
            });
            setNeftDetails({
                transactionId: "",
                transactionDate: "",
            });
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

        // Validate cheque fields if mode is cheque
        if (mode === "cheque") {
            if (!bankDetails.bankName || !bankDetails.chequeNumber || !bankDetails.chequeDate) {
                setSnackbar({
                    open: true,
                    message: "Bank name, cheque number, and cheque date are required for cheque payment.",
                    severity: "error",
                });
                return;
            }
        }

        // Validate neft fields if mode is neft (transaction ID is optional)
        if (mode === "neft") {
            if (!neftDetails.transactionDate) {
                setSnackbar({
                    open: true,
                    message: "Transaction date is required for NEFT payment.",
                    severity: "error",
                });
                return;
            }
        }

        // Validate name when mode is cheque or neft
        if (mode === "cheque" || mode === "neft") {
            if (!name || name.trim().length === 0) {
                setSnackbar({
                    open: true,
                    message: "Name is required for cheque and NEFT payments.",
                    severity: "error",
                });
                return;
            }
            if (name.length > 100) {
                setSnackbar({
                    open: true,
                    message: "Name must be 100 characters or less.",
                    severity: "error",
                });
                return;
            }
        }

        // Determine the name to send - use editable name for cheque/neft, row.name for cash
        const receiptName = (mode === "cheque" || mode === "neft") ? name.trim() : row.name;

        const payload = {
            name: receiptName,
            its: row.its ? String(row.its) : null,
            commitment_id: row.id,      // 👈 commitment row id
            amount: Number(amount),
            mode: mode.toLowerCase(),
            bank_name: mode === "cheque" ? bankDetails.bankName : null,
            cheque_no: mode === "cheque" ? bankDetails.chequeNumber : null,
            cheque_date: mode === "cheque" ? bankDetails.chequeDate : null,
            transaction_id: mode === "neft" ? neftDetails.transactionId : null,
            transaction_date: mode === "neft" ? neftDetails.transactionDate : null,
            comments: comments || null,
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

    // Get dialog title based on booking type
    const getDialogTitle = () => {
        if (!row?.type) return "Add Receipt";
        const typeMap = {
            extra_niyaz_in_thaali: "Add Extra Niyaz in Faiz Thaali Receipt",
            zabihat: "Add Zabihat Receipt",
            salwat: "Add Salawat Receipt",
            fateha: "Add Fateha Receipt",
            miqaat_niyaz: "Add Miqaat Niyaz Receipt",
        };
        return typeMap[row.type] || "Add Receipt";
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>{getDialogTitle()}</DialogTitle>

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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                                {mode === "cheque" || mode === "neft" ? (
                                    <TextField
                                        label="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                        inputProps={{ maxLength: 100 }}
                                    />
                                ) : (
                                    <Typography variant="h6" fontWeight="bold">
                                        {row.name}
                                    </Typography>
                                )}
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
                                    <MenuItem value="cheque">Cheque</MenuItem>
                                    <MenuItem value="neft">NEFT</MenuItem>
                                </Select>
                            </Grid>

                            {/* Cheque fields */}
                            {mode === "cheque" && (
                                <>
                                    <Grid item xs={12} md={4}>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            gutterBottom
                                        >
                                            <strong>Bank Name</strong>
                                        </Typography>
                                        <Select
                                            value={bankDetails.bankName}
                                            onChange={(e) =>
                                                setBankDetails({ ...bankDetails, bankName: e.target.value })
                                            }
                                            fullWidth
                                            sx={{ pt: 1.7, pb: 1.7 }}
                                            displayEmpty
                                        >
                                            <MenuItem value="" disabled>
                                                Select Bank
                                            </MenuItem>
                                            {bankList.map((bank) => (
                                                <MenuItem key={bank.code} value={bank.name}>
                                                    {bank.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            gutterBottom
                                        >
                                            <strong>Cheque Number</strong>
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={bankDetails.chequeNumber}
                                            onChange={(e) =>
                                                setBankDetails({ ...bankDetails, chequeNumber: e.target.value })
                                            }
                                            placeholder="Enter cheque number"
                                            inputProps={{ maxLength: 6 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            gutterBottom
                                        >
                                            <strong>Cheque Date</strong>
                                        </Typography>
                                        <DatePicker
                                            label="Cheque Date"
                                            format="DD/MM/YYYY"
                                            value={bankDetails.chequeDate ? dayjs(bankDetails.chequeDate) : null}
                                            onChange={(newValue) => {
                                                if (newValue?.isValid()) {
                                                    setBankDetails({
                                                        ...bankDetails,
                                                        chequeDate: newValue.format("YYYY-MM-DD"),
                                                    });
                                                }
                                            }}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    sx: {
                                                        "& .MuiIconButton-root": {
                                                            border: "none",
                                                            padding: 0,
                                                            margin: 0,
                                                            backgroundColor: "transparent",
                                                        },
                                                    },
                                                    onClick: (e) => {
                                                        e.currentTarget.querySelector("button")?.click();
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>
                                </>
                            )}

                            {/* NEFT fields */}
                            {mode === "neft" && (
                                <>
                                    <Grid item xs={12} md={6}>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            gutterBottom
                                        >
                                            <strong>Transaction ID</strong>
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={neftDetails.transactionId}
                                            onChange={(e) =>
                                                setNeftDetails({ ...neftDetails, transactionId: e.target.value })
                                            }
                                            placeholder="Enter transaction ID"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            gutterBottom
                                        >
                                            <strong>Transaction Date</strong>
                                        </Typography>
                                        <DatePicker
                                            label="Transaction Date"
                                            format="DD/MM/YYYY"
                                            value={neftDetails.transactionDate ? dayjs(neftDetails.transactionDate) : null}
                                            onChange={(newValue) => {
                                                if (newValue?.isValid()) {
                                                    setNeftDetails({
                                                        ...neftDetails,
                                                        transactionDate: newValue.format("YYYY-MM-DD"),
                                                    });
                                                }
                                            }}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    sx: {
                                                        "& .MuiIconButton-root": {
                                                            border: "none",
                                                            padding: 0,
                                                            margin: 0,
                                                            backgroundColor: "transparent",
                                                        },
                                                    },
                                                    onClick: (e) => {
                                                        e.currentTarget.querySelector("button")?.click();
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>
                                </>
                            )}

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
                    </LocalizationProvider>
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
