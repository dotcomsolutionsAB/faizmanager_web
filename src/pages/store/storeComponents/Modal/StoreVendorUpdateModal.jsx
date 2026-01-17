import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    Dialog,
    DialogContent,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    IconButton,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dividerImg from "../../../../assets/divider.png";

const safeText = (v, fallback = "") =>
    v === null || v === undefined ? fallback : String(v);

const INDIA_STATES = [
    { code: "AP", name: "Andhra Pradesh" },
    { code: "AR", name: "Arunachal Pradesh" },
    { code: "AS", name: "Assam" },
    { code: "BR", name: "Bihar" },
    { code: "CG", name: "Chhattisgarh" },
    { code: "GA", name: "Goa" },
    { code: "GJ", name: "Gujarat" },
    { code: "HR", name: "Haryana" },
    { code: "HP", name: "Himachal Pradesh" },
    { code: "JH", name: "Jharkhand" },
    { code: "KA", name: "Karnataka" },
    { code: "KL", name: "Kerala" },
    { code: "MP", name: "Madhya Pradesh" },
    { code: "MH", name: "Maharashtra" },
    { code: "MN", name: "Manipur" },
    { code: "ML", name: "Meghalaya" },
    { code: "MZ", name: "Mizoram" },
    { code: "NL", name: "Nagaland" },
    { code: "OD", name: "Odisha" },
    { code: "PB", name: "Punjab" },
    { code: "RJ", name: "Rajasthan" },
    { code: "SK", name: "Sikkim" },
    { code: "TN", name: "Tamil Nadu" },
    { code: "TS", name: "Telangana" },
    { code: "TR", name: "Tripura" },
    { code: "UK", name: "Uttarakhand" },
    { code: "UP", name: "Uttar Pradesh" },
    { code: "WB", name: "West Bengal" },
    { code: "AN", name: "Andaman and Nicobar Islands" },
    { code: "CH", name: "Chandigarh" },
    { code: "DN", name: "Dadra and Nagar Haveli and Daman and Diu" },
    { code: "DL", name: "Delhi" },
    { code: "JK", name: "Jammu and Kashmir" },
    { code: "LA", name: "Ladakh" },
    { code: "LD", name: "Lakshadweep" },
    { code: "PY", name: "Puducherry" },
];

const BANK_OPTIONS = [
    "HDFC",
    "ICICI",
    "SBI",
    "Axis",
    "Kotak",
    "Yes Bank",
    "IndusInd",
    "PNB",
    "BOI",
    "Canara",
];

export default function StoreVendorUpdateModal({
    open,
    onClose,
    vendor,     // pass selected row object
    token,
    base,
    onSuccess,  // refresh table
}) {
    const [submitting, setSubmitting] = useState(false);

    // fields
    const [vendorCode, setVendorCode] = useState("");
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [gstin, setGstin] = useState("");
    const [remarks, setRemarks] = useState("");

    const [bankName, setBankName] = useState("");
    const [branch, setBranch] = useState("");
    const [account, setAccount] = useState("");
    const [ifs, setIfs] = useState("");

    const headers = useMemo(
        () => ({
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        }),
        [token]
    );

    // Prefill on open/vendor change
    useEffect(() => {
        if (!open || !vendor) return;

        setVendorCode(safeText(vendor.vendor_code));
        setName(safeText(vendor.name));
        setMobile(safeText(vendor.mobile));
        setEmail(safeText(vendor.email));
        setAddress1(safeText(vendor.address_1));
        setAddress2(safeText(vendor.address_2));
        setCity(safeText(vendor.city));
        setState(safeText(vendor.state));
        setGstin(safeText(vendor.gstin));
        setRemarks(safeText(vendor.remarks));

        setBankName(safeText(vendor.bank_name));
        setBranch(safeText(vendor.branch));
        setAccount(safeText(vendor.account));
        setIfs(safeText(vendor.ifs));
    }, [open, vendor]);

    const handleSubmit = async () => {
        if (!token) return;
        if (!vendor?.id) return;

        if (!vendorCode.trim()) return alert("Vendor Code is required");
        if (!name.trim()) return alert("Name is required");

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
                state: state || null,
                gstin: gstin.trim() || null,
                remarks: remarks.trim() || null,
                bank_name: bankName || null,
                branch: branch.trim() || null,
                account: account.trim() || null,
                ifs: ifs.trim() || null,
            };

            const resp = await fetch(`${base}/store-vendors/${vendor.id}`, {
                method: "PUT",
                headers,
                body: JSON.stringify(payload),
            });

            const json = await resp.json().catch(() => ({}));

            if (!resp.ok || json?.success === false) {
                alert(json?.message || "Vendor update failed");
                return;
            }

            onClose?.();
            onSuccess?.();
        } catch (e) {
            console.error("Vendor update error:", e);
            alert("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => !submitting && onClose?.()}
            maxWidth="md"
            fullWidth
            scroll="body"
            PaperProps={{ sx: { borderRadius: 3, overflow: "hidden", maxHeight: "none" } }}
        >
            {/* Header */}
            <Box
                sx={{
                    px: 3,
                    pt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Update Vendor
                </Typography>
                <IconButton onClick={() => !submitting && onClose?.()}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Divider */}
            <Box
                sx={{
                    width: "100%",
                    height: 14,
                    backgroundImage: `url(${dividerImg})`,
                    backgroundRepeat: "repeat-x",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    mb: 2,
                }}
            />

            <DialogContent sx={{ pt: 0, px: 3, pb: 3, overflow: "hidden" }}>
                <Grid container spacing={2}>
                    {/* Row 1 (4 fields) */}
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Vendor Code"
                            value={vendorCode}
                            onChange={(e) => setVendorCode(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Mobile"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                        />
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
                                label="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {INDIA_STATES.map((s) => (
                                    <MenuItem key={s.code} value={s.code}>
                                        {s.code} - {s.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Row 3 */}
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField fullWidth label="GSTIN" value={gstin} onChange={(e) => setGstin(e.target.value)} />
                    </Grid>

                    {/* Remarks (3 fields width = 9/12) */}
                    <Grid item xs={12} md={9}>
                        <TextField
                            fullWidth
                            label="Remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </Grid>

                    {/* Divider style box for bank section */}
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                mt: 1,
                                mb: 0.5,
                                border: "1px dashed rgba(0,0,0,0.2)",
                                borderRadius: 2,
                                p: 2,
                            }}
                        >
                            <Typography sx={{ fontWeight: 800, mb: 1 }}>Bank Details</Typography>

                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth>
                                        <InputLabel id="bank-name-label">Bank Name</InputLabel>
                                        <Select
                                            labelId="bank-name-label"
                                            label="Bank Name"
                                            value={bankName}
                                            onChange={(e) => setBankName(e.target.value)}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {BANK_OPTIONS.map((b) => (
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
                            sx={{ minWidth: 160, borderRadius: 2 }}
                        >
                            {submitting ? <CircularProgress size={20} color="inherit" /> : "Update Vendor"}
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}
