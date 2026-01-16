import React, { useEffect, useMemo, useRef, useState } from "react";
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
    Divider,
} from "@mui/material";
import { yellow } from "../../../styles/ThemePrimitives";
import dividerImg from "../../../assets/divider.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import { useUser } from "../../../contexts/UserContext";

const safeText = (v) => (v === null || v === undefined ? "" : String(v));

const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const todayISO = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

export default function StoreInForm({ onSuccess }) {
    const formRef = useRef(null);
    const snackbarTimerRef = useRef(null);

    const { token } = useUser();
    const base = process.env.REACT_APP_API_BASE || "https://api.fmb52.com/api";

    const [collapsed, setCollapsed] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // header fields
    const [vendorId, setVendorId] = useState("");
    const [invoiceNo, setInvoiceNo] = useState("");
    const [date, setDate] = useState(todayISO());
    const [remarks, setRemarks] = useState("");

    const [transportation, setTransportation] = useState("0");
    const [grandTotal, setGrandTotal] = useState(""); // editable; if empty -> auto

    // attachments
    const [attachments, setAttachments] = useState([]);

    // meta
    const [loadingMeta, setLoadingMeta] = useState(false);
    const [vendors, setVendors] = useState([]); // [{id, vendor_code, name}]
    const [items, setItems] = useState([]); // [{id,name,unit,current_stock,...}]
    const [unitOptions, setUnitOptions] = useState([]); // from /store/units

    // rows
    const [rows, setRows] = useState([
        { item_id: "", qty: "", unit: "", rate: "", total: 0, current_stock: "" },
    ]);

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

    const fetchMeta = async () => {
        if (!token || loadingMeta) return;
        setLoadingMeta(true);

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            };

            // ✅ vendors
            const vResp = await fetch(`${base}/store-vendors`, { method: "GET", headers });
            const vJson = await vResp.json();
            const vRows = Array.isArray(vJson?.data) ? vJson.data : [];
            setVendors(vRows);

            // ✅ items list (id, name, unit, current_stock)
            const iResp = await fetch(`${base}/store-items`, { method: "GET", headers });
            const iJson = await iResp.json();
            const iRows = Array.isArray(iJson?.data) ? iJson.data : [];
            setItems(iRows);

            // ✅ unit dropdown
            const uResp = await fetch(`${base}/store/units`, { method: "GET", headers });
            const uJson = await uResp.json();
            const units = uJson?.data?.units;
            setUnitOptions(Array.isArray(units) ? units : []);
        } catch (e) {
            console.error("StoreIn meta fetch failed:", e);
            setVendors([]);
            setItems([]);
            setUnitOptions([]);
            showSnackbar("Unable to fetch vendors/items/units.", "error");
        } finally {
            setLoadingMeta(false);
        }
    };

    useEffect(() => {
        fetchMeta();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const findItem = (id) => {
        const nid = Number(id);
        if (!nid) return null;
        return items.find((x) => Number(x?.id) === nid) || null;
    };

    const recalcRow = (r) => {
        const qty = toNum(r.qty);
        const rate = toNum(r.rate);
        const total = qty * rate;
        return { ...r, total };
    };

    const updateRow = (idx, patch) => {
        setRows((prev) => {
            const copy = prev.map((r, i) => (i === idx ? { ...r, ...patch } : r));
            // recalc the updated row
            copy[idx] = recalcRow(copy[idx]);
            return copy;
        });
    };

    const onSelectItem = (idx, itemId) => {
        const it = findItem(itemId);
        // unit default from item.unit; current_stock from item.current_stock
        updateRow(idx, {
            item_id: itemId,
            unit: it?.unit ? String(it.unit) : "",
            current_stock: it?.current_stock ?? "",
            // keep rate as is, user will type it
        });
    };

    const addRow = () => {
        setRows((prev) => [
            ...prev,
            { item_id: "", qty: "", unit: "", rate: "", total: 0, current_stock: "" },
        ]);
    };

    const removeRow = (idx) => {
        setRows((prev) => {
            const copy = [...prev];
            copy.splice(idx, 1);
            return copy.length
                ? copy
                : [{ item_id: "", qty: "", unit: "", rate: "", total: 0, current_stock: "" }];
        });
    };

    const itemsSubtotal = useMemo(() => {
        return rows.reduce((sum, r) => sum + toNum(r.total), 0);
    }, [rows]);

    const autoGrandTotal = useMemo(() => {
        return itemsSubtotal + toNum(transportation);
    }, [itemsSubtotal, transportation]);

    const displayedGrandTotal = grandTotal !== "" ? toNum(grandTotal) : autoGrandTotal;

    const resetForm = () => {
        setVendorId("");
        setInvoiceNo("");
        setDate(todayISO());
        setRemarks("");
        setTransportation("0");
        setGrandTotal("");
        setAttachments([]);
        setRows([{ item_id: "", qty: "", unit: "", rate: "", total: 0, current_stock: "" }]);
    };

    const validate = () => {
        if (!vendorId) return "Vendor is required.";
        if (!invoiceNo.trim()) return "Invoice No is required.";
        if (!date) return "Date is required.";

        const cleaned = rows
            .map((r) => ({
                item_id: Number(r.item_id),
                qty: toNum(r.qty),
                unit: safeText(r.unit).trim(),
                rate: toNum(r.rate),
            }))
            .filter((r) => r.item_id);

        if (cleaned.length === 0) return "Please add at least 1 item row.";

        const badQty = cleaned.find((x) => !(x.qty > 0));
        if (badQty) return "Qty must be greater than 0.";

        const badRate = cleaned.find((x) => !(x.rate >= 0));
        if (badRate) return "Rate must be 0 or more.";

        return null;
    };

    const handleSubmit = async () => {
        if (!token) return;

        const err = validate();
        if (err) return showSnackbar(err, "error");

        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append("vendor_id", String(vendorId));
            fd.append("invoice_no", invoiceNo.trim());
            fd.append("date", date);
            fd.append("remarks", remarks || "");
            fd.append("transportation", String(toNum(transportation)));
            fd.append("total", String(displayedGrandTotal)); // if backend expects total; safe to send

            rows.forEach((r, idx) => {
                if (!r.item_id) return;
                fd.append(`items[${idx}][item_id]`, String(r.item_id));
                fd.append(`items[${idx}][qty]`, String(toNum(r.qty)));
                fd.append(`items[${idx}][rate]`, String(toNum(r.rate)));
                // unit not in sample payload, but if your backend needs:
                // fd.append(`items[${idx}][unit]`, String(r.unit));
            });

            attachments.forEach((file, idx) => {
                fd.append(`attachments[${idx}]`, file);
            });

            const resp = await fetch(`${base}/store-in`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    // ❌ do not set Content-Type for FormData
                },
                body: fd,
            });

            const data = await resp.json();

            if (resp.ok && (data?.success === true || data?.code === 200)) {
                showSnackbar(data?.message || "Store In saved", "success");
                resetForm();
                if (onSuccess) onSuccess();
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                showSnackbar(data?.message || "Submission failed.", "error");
            }
        } catch (e) {
            console.error("StoreIn submit error:", e);
            showSnackbar("Error occurred during submission.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handlePickFiles = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setAttachments((prev) => [...prev, ...files]);
        e.target.value = ""; // allow re-pick same file
    };

    const removeAttachment = (idx) => {
        setAttachments((prev) => prev.filter((_, i) => i !== idx));
    };

    const formatMoney = (n) =>
        toNum(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
                        Store In (Purchase)
                    </Typography>

                    <IconButton
                        onClick={handleCollapseToggle}
                        sx={{ color: yellow[300], "&:hover": { color: yellow[400] } }}
                    >
                        {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                    </IconButton>
                </Box>

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
                    {/* Row 1: Vendor, Invoice No, Date */}
                    <Grid container spacing={2} alignItems="center" sx={{ pr: 2 }}>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth disabled={loadingMeta}>
                                <InputLabel id="vendor-label">Vendor</InputLabel>
                                <Select
                                    labelId="vendor-label"
                                    value={vendorId}
                                    label="Vendor"
                                    onChange={(e) => setVendorId(e.target.value)}
                                    MenuProps={{ PaperProps: { style: { maxHeight: 360 } } }}
                                >
                                    <MenuItem value="">
                                        <em>Select</em>
                                    </MenuItem>
                                    {vendors.map((v) => (
                                        <MenuItem key={v.id} value={v.id}>
                                            {v.vendor_code ? `${v.vendor_code} - ` : ""}{v.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Invoice No"
                                value={invoiceNo}
                                onChange={(e) => setInvoiceNo(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        {/* Remarks */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Remarks"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </Grid>

                        {/* Items Repeater */}
                        <Grid item xs={12}>
                            <Box sx={{ border: "1px dashed rgba(0,0,0,0.18)", borderRadius: 2, p: 2, mt: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                                    Items
                                </Typography>

                                {rows.map((r, idx) => (
                                    <Grid
                                        key={idx}
                                        container
                                        spacing={2}
                                        alignItems="center"
                                        sx={{
                                            mb: 1.2,
                                            pb: 1.2,
                                            borderBottom: idx === rows.length - 1 ? "none" : "1px solid rgba(0,0,0,0.06)",
                                        }}
                                    >
                                        {/* Item */}
                                        <Grid item xs={12} md={3}>
                                            <FormControl fullWidth disabled={loadingMeta}>
                                                <InputLabel id={`item-label-${idx}`}>Item</InputLabel>
                                                <Select
                                                    labelId={`item-label-${idx}`}
                                                    value={safeText(r.item_id)}
                                                    label="Item"
                                                    onChange={(e) => onSelectItem(idx, e.target.value)}
                                                    MenuProps={{ PaperProps: { style: { maxHeight: 380 } } }}
                                                >
                                                    <MenuItem value="">
                                                        <em>Select</em>
                                                    </MenuItem>
                                                    {items.map((it) => (
                                                        <MenuItem key={it.id} value={it.id}>
                                                            {it.name} {it.unit ? `(${it.unit})` : ""}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Qty */}
                                        <Grid item xs={12} sm={6} md={1.5}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Qty"
                                                inputProps={{ min: 0, step: "any" }}
                                                value={safeText(r.qty)}
                                                onChange={(e) => updateRow(idx, { qty: e.target.value })}
                                            />
                                        </Grid>

                                        {/* Unit (select box) */}
                                        <Grid item xs={12} sm={6} md={1.5}>
                                            <FormControl fullWidth disabled={loadingMeta}>
                                                <InputLabel id={`unit-label-${idx}`}>Unit</InputLabel>
                                                <Select
                                                    labelId={`unit-label-${idx}`}
                                                    value={safeText(r.unit)}
                                                    label="Unit"
                                                    onChange={(e) => updateRow(idx, { unit: e.target.value })}
                                                    MenuProps={{ PaperProps: { style: { maxHeight: 320 } } }}
                                                >
                                                    <MenuItem value="">
                                                        <em>Select</em>
                                                    </MenuItem>
                                                    {unitOptions.map((u) => (
                                                        <MenuItem key={u} value={u}>
                                                            {u}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Rate (editable input; you asked disabled read-only BUT your payload needs rate.
                        So: keep it editable. If you truly want disabled, tell me where rate comes from. */}
                                        <Grid item xs={12} sm={6} md={1.5}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Rate"
                                                inputProps={{ min: 0, step: "any" }}
                                                value={safeText(r.rate)}
                                                onChange={(e) => updateRow(idx, { rate: e.target.value })}
                                            />
                                        </Grid>

                                        {/* Total */}
                                        <Grid item xs={12} sm={6} md={1.5}>
                                            <TextField
                                                fullWidth
                                                label="Total"
                                                value={formatMoney(r.total)}
                                                InputProps={{ readOnly: true }}
                                            />
                                        </Grid>

                                        {/* Current stock */}
                                        <Grid item xs={12} sm={6} md={2}>
                                            <TextField
                                                fullWidth
                                                label="Current Stock"
                                                value={safeText(r.current_stock)}
                                                InputProps={{ readOnly: true }}
                                            />
                                        </Grid>

                                        {/* Remove */}
                                        <Grid item xs={12} sm={6} md={1}>
                                            <IconButton
                                                onClick={() => removeRow(idx)}
                                                disabled={rows.length === 1}
                                                title="Remove"
                                                sx={{ color: "error.main" }}
                                            >
                                                <DeleteOutlineOutlinedIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}

                                <Divider sx={{ my: 1.5 }} />

                                <Button
                                    variant="outlined"
                                    onClick={addRow}
                                    startIcon={<AddCircleOutlineIcon />}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Add Row
                                </Button>
                            </Box>
                        </Grid>

                        {/* Attachments */}
                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<UploadFileOutlinedIcon />}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Add Attachments
                                    <input hidden multiple type="file" onChange={handlePickFiles} />
                                </Button>

                                {attachments.length > 0 && (
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        {attachments.length} file(s) selected
                                    </Typography>
                                )}
                            </Box>

                            {attachments.length > 0 && (
                                <Box sx={{ mt: 1 }}>
                                    {attachments.map((f, i) => (
                                        <Box
                                            key={`${f.name}-${i}`}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                border: "1px solid rgba(0,0,0,0.08)",
                                                borderRadius: 2,
                                                px: 1.5,
                                                py: 1,
                                                mb: 1,
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                {f.name}
                                            </Typography>
                                            <Button color="error" size="small" onClick={() => removeAttachment(i)}>
                                                Remove
                                            </Button>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Grid>

                        {/* Totals */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Transportation"
                                value={transportation}
                                onChange={(e) => setTransportation(e.target.value)}
                                inputProps={{ min: 0, step: "any" }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Items Subtotal"
                                value={formatMoney(itemsSubtotal)}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Grand Total"
                                value={grandTotal !== "" ? grandTotal : String(autoGrandTotal)}
                                onChange={(e) => setGrandTotal(e.target.value)}
                                inputProps={{ min: 0, step: "any" }}
                                helperText="Auto calculated, but editable"
                            />
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
