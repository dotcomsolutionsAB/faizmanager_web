import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Snackbar,
    Alert,
    CssBaseline,
    Grid,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Collapse,
} from "@mui/material";
import { yellow } from "../../../styles/ThemePrimitives";
import dividerImg from "../../../assets/divider.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useUser } from "../../../contexts/UserContext";

const INDIAN_STATES = [
    { code: "AN", name: "Andaman and Nicobar Islands" },
    { code: "AP", name: "Andhra Pradesh" },
    { code: "AR", name: "Arunachal Pradesh" },
    { code: "AS", name: "Assam" },
    { code: "BR", name: "Bihar" },
    { code: "CH", name: "Chandigarh" },
    { code: "CG", name: "Chhattisgarh" },
    { code: "DN", name: "Dadra and Nagar Haveli and Daman and Diu" },
    { code: "DL", name: "Delhi" },
    { code: "GA", name: "Goa" },
    { code: "GJ", name: "Gujarat" },
    { code: "HR", name: "Haryana" },
    { code: "HP", name: "Himachal Pradesh" },
    { code: "JK", name: "Jammu and Kashmir" },
    { code: "JH", name: "Jharkhand" },
    { code: "KA", name: "Karnataka" },
    { code: "KL", name: "Kerala" },
    { code: "LA", name: "Ladakh" },
    { code: "LD", name: "Lakshadweep" },
    { code: "MP", name: "Madhya Pradesh" },
    { code: "MH", name: "Maharashtra" },
    { code: "MN", name: "Manipur" },
    { code: "ML", name: "Meghalaya" },
    { code: "MZ", name: "Mizoram" },
    { code: "NL", name: "Nagaland" },
    { code: "OD", name: "Odisha" },
    { code: "PY", name: "Puducherry" },
    { code: "PB", name: "Punjab" },
    { code: "RJ", name: "Rajasthan" },
    { code: "SK", name: "Sikkim" },
    { code: "TN", name: "Tamil Nadu" },
    { code: "TS", name: "Telangana" },
    { code: "TR", name: "Tripura" },
    { code: "UP", name: "Uttar Pradesh" },
    { code: "UK", name: "Uttarakhand" },
    { code: "WB", name: "West Bengal" },
];

const BANKS = [
    "HDFC",
    "ICICI",
    "SBI",
    "Axis",
    "PNB",
    "Kotak",
    "Yes Bank",
    "IndusInd",
    "IDFC First",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank",
    "Other",
];

const safeText = (v) => (v === null || v === undefined ? "" : String(v));

export default function StoreVendorForm({ onSuccess }) {
    const formRef = useRef(null);
    const snackbarTimerRef = useRef(null);

    const { token } = useUser();
    const base = process.env.REACT_APP_API_BASE || "https://api.fmb52.com/api";

    const [collapsed, setCollapsed] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // fields
    const [vendorCode, setVendorCode] = useState("");
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [city, setCity] = useState("");
    const [stateCode, setStateCode] = useState("");
    const [gstin, setGstin] = useState("");
    const [remarks, setRemarks] = useState("");

    const [bankName, setBankName] = useState("");
    const [branch, setBranch] = useState("");
    const [account, setAccount] = useState("");
    const [ifs, setIfs] = useState("");

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const showSnackbar = (message, severity = "success") => {
        if (snackbarTimerRef.current) clearTimeout(snackbarTimerRef.current);
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = () => {
        if (snackbarTimerRef.current) clearTimeout(snackbarTimerRef.current);
        snackbarTimerRef.current = setTimeout(() => {
            setSnackbar((p) => ({ ...p, open: false }));
        }, 2000);
    };

    useEffect(() => {
        return () => {
            if (snackbarTimerRef.current) clearTimeout(snackbarTimerRef.current);
        };
    }, []);

    const handleCollapseToggle = () => setCollapsed((p) => !p);

    const resetForm = () => {
        setVendorCode("");
        setName("");
        setMobile("");
        setEmail("");
        setAddress1("");
        setAddress2("");
        setCity("");
        setStateCode("");
        setGstin("");
        setRemarks("");
        setBankName("");
        setBranch("");
        setAccount("");
        setIfs("");
    };

    const handleSubmit = async () => {
        if (!token) return;

        // basic validation (keep light)
        if (!vendorCode.trim()) return showSnackbar("Vendor code is required.", "error");
        if (!name.trim()) return showSnackbar("Name is required.", "error");

        setSubmitting(true);
        try {
            const payload = {
                vendor_code: vendorCode.trim(),
                name: name.trim(),
                mobile: mobile.trim() || null,
                email: email.trim() || null,
                address_1: address1.trim() || null,
                address_2: address2.trim() || null,
                city: city.trim() || null,
                state: stateCode || null,
                gstin: gstin.trim() || null,
                remarks: remarks.trim() || null,
                bank_name: bankName || null,
                branch: branch.trim() || null,
                account: account.trim() || null,
                ifs: ifs.trim() || null,
            };

            const resp = await fetch(`${base}/store-vendors`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await resp.json();

            if (resp.ok && (data?.success === true || data?.code === 200)) {
                showSnackbar(data?.message || "Vendor created successfully!", "success");
                resetForm();
                if (onSuccess) onSuccess();
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                showSnackbar(data?.message || "Submission failed.", "error");
            }
        } catch (e) {
            console.error("Vendor submit error:", e);
            showSnackbar("Error occurred during submission.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <CssBaseline />

            <Box
                ref={formRef}
                sx={{
                    pt: 2,
                    pb: 3,
                    pl: 3,
                    pr: 3,
                    mr: 2,
                    ml: 2,
                    mb: 1,
                    backgroundColor: "#fff",
                    border: "1px solid #F4EBD0",
                    borderRadius: 2,
                    boxShadow: 1,
                }}
            >
                {/* Header + Collapse Toggle */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            marginBottom: 1,
                            padding: "8px 16px",
                            borderRadius: 1,
                        }}
                    >
                        Add Vendor
                    </Typography>

                    <IconButton
                        onClick={handleCollapseToggle}
                        sx={{
                            color: yellow[300],
                            "&:hover": { color: yellow[400] },
                        }}
                    >
                        {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                    </IconButton>
                </Box>

                {/* Divider only when expanded */}
                {!collapsed && (
                    <Box
                        sx={{
                            width: "calc(100% + 48px)",
                            position: "relative",
                            height: { xs: 10, sm: 15, md: 15, lg: 15, xl: 15 },
                            backgroundImage: `url(${dividerImg})`,
                            backgroundSize: "contain",
                            backgroundRepeat: "repeat-x",
                            backgroundPosition: "center",
                            mb: 2,
                            marginLeft: "-24px",
                            marginRight: "-24px",
                        }}
                    />
                )}

                <Collapse in={!collapsed}>
                    {/* 4-per-row layout */}
                    <Grid container spacing={2} alignItems="center" sx={{ pr: 2 }}>
                        {/* Row 1 */}
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField fullWidth label="Vendor Code" value={vendorCode} onChange={(e) => setVendorCode(e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField fullWidth label="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Grid>

                        {/* Row 2 */}
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField fullWidth label="Address Line 1" value={address1} onChange={(e) => setAddress1(e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField fullWidth label="Address Line 2" value={address2} onChange={(e) => setAddress2(e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField fullWidth label="City" value={city} onChange={(e) => setCity(e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                                <InputLabel id="vendor-state-label">State</InputLabel>
                                <Select
                                    labelId="vendor-state-label"
                                    value={stateCode}
                                    label="State"
                                    onChange={(e) => setStateCode(e.target.value)}
                                    MenuProps={{ PaperProps: { style: { maxHeight: 320 } } }}
                                >
                                    <MenuItem value="">
                                        <em>Select</em>
                                    </MenuItem>
                                    {INDIAN_STATES.map((s) => (
                                        <MenuItem key={s.code} value={s.code}>
                                            {s.name} ({s.code})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Row 3 */}
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField fullWidth label="GSTIN" value={gstin} onChange={(e) => setGstin(e.target.value)} />
                        </Grid>

                        {/* Remarks should take width of 3 inputs */}
                        <Grid item xs={12} sm={6} md={9}>
                            <TextField
                                fullWidth
                                label="Remarks"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </Grid>

                        {/* Border section for bank */}
                        <Grid item xs={12}>
                            <Box sx={{ border: "1px dashed rgba(0,0,0,0.18)", borderRadius: 2, p: 2, mt: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                                    Bank Details
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <FormControl fullWidth>
                                            <InputLabel id="bank-name-label">Bank Name</InputLabel>
                                            <Select
                                                labelId="bank-name-label"
                                                value={bankName}
                                                label="Bank Name"
                                                onChange={(e) => setBankName(e.target.value)}
                                                MenuProps={{ PaperProps: { style: { maxHeight: 320 } } }}
                                            >
                                                <MenuItem value="">
                                                    <em>Select</em>
                                                </MenuItem>
                                                {BANKS.map((b) => (
                                                    <MenuItem key={b} value={b}>
                                                        {b}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField fullWidth label="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Account No"
                                            value={account}
                                            onChange={(e) => setAccount(e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField fullWidth label="IFSC Code" value={ifs} onChange={(e) => setIfs(e.target.value)} />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        {/* Submit */}
                        <Grid item xs={12} sx={{ textAlign: "right", mt: 1 }}>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={submitting}
                                sx={{
                                    color: "white",
                                    backgroundColor: yellow[300],
                                    "&:hover": { backgroundColor: yellow[200], color: "#000" },
                                    minWidth: 160,
                                }}
                            >
                                {submitting ? <CircularProgress size={20} color="inherit" /> : "Submit"}
                            </Button>
                        </Grid>
                    </Grid>
                </Collapse>
            </Box>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
