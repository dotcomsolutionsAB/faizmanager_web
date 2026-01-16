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
    Divider,
} from "@mui/material";
import { yellow } from "../../../styles/ThemePrimitives";
import dividerImg from "../../../assets/divider.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useUser } from "../../../contexts/UserContext";

const safeText = (v) => (v === null || v === undefined ? "" : String(v));

export default function StoreDishForm({ onSuccess }) {
    const formRef = useRef(null);
    const snackbarTimerRef = useRef(null);

    const { token } = useUser();
    const base = process.env.REACT_APP_API_BASE || "https://api.fmb52.com/api";

    const [collapsed, setCollapsed] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // header fields
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");

    // meta
    const [loadingMeta, setLoadingMeta] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [itemOptions, setItemOptions] = useState([]); // [{id,name,unit,category,...}]

    // rows: [{ item_id:"", qty:"" }]
    const [rows, setRows] = useState([{ item_id: "", qty: "" }]);

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

            // ✅ Categories from your existing endpoint
            const catResp = await fetch(`${base}/store/categories`, { method: "GET", headers });
            const catJson = await catResp.json();
            const cats = catJson?.data?.categories;
            setCategoryOptions(Array.isArray(cats) ? cats : []);

            // ✅ Items list (we need id, name, unit)
            // If your endpoint differs, change this URL.
            const itemResp = await fetch(`${base}/store-items`, { method: "GET", headers });
            const itemJson = await itemResp.json();
            const items = Array.isArray(itemJson?.data) ? itemJson.data : [];
            setItemOptions(items);
        } catch (e) {
            console.error("Dish meta fetch failed:", e);
            setCategoryOptions([]);
            setItemOptions([]);
            showSnackbar("Unable to fetch items/categories.", "error");
        } finally {
            setLoadingMeta(false);
        }
    };

    useEffect(() => {
        fetchMeta();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const addRow = () => {
        setRows((prev) => [...prev, { item_id: "", qty: "" }]);
    };

    const removeRow = (idx) => {
        setRows((prev) => {
            const copy = [...prev];
            copy.splice(idx, 1);
            return copy.length ? copy : [{ item_id: "", qty: "" }];
        });
    };

    const updateRow = (idx, patch) => {
        setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
    };

    const getUnitForItem = (itemId) => {
        const id = Number(itemId);
        if (!id) return "—";
        const it = itemOptions.find((x) => Number(x?.id) === id);
        return it?.unit ? String(it.unit) : "—";
    };

    const resetForm = () => {
        setName("");
        setCategory("");
        setRows([{ item_id: "", qty: "" }]);
    };

    const handleSubmit = async () => {
        if (!token) return;

        if (!name.trim()) return showSnackbar("Dish name is required.", "error");
        if (!category) return showSnackbar("Category is required.", "error");

        // Validate rows
        const cleaned = rows
            .map((r) => ({
                item_id: Number(r.item_id),
                qty: Number(r.qty),
            }))
            .filter((r) => r.item_id && r.qty);

        if (cleaned.length === 0) return showSnackbar("Please add at least 1 item with qty.", "error");

        // qty min 1 rule (as you asked)
        const badQty = cleaned.find((x) => !(x.qty >= 1));
        if (badQty) return showSnackbar("Qty must be minimum 1.", "error");

        setSubmitting(true);
        try {
            const payload = {
                name: name.trim(),
                category,
                items: cleaned.map((x) => ({ item_id: x.item_id, qty: x.qty })),
            };

            const resp = await fetch(`${base}/store-dishes`, {
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
                showSnackbar(data?.message || "Dish created successfully!", "success");
                resetForm();
                if (onSuccess) onSuccess();
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                showSnackbar(data?.message || "Submission failed.", "error");
            }
        } catch (e) {
            console.error("Dish submit error:", e);
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
                        Add Dish
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
                    <Grid container spacing={2} alignItems="center" sx={{ pr: 2 }}>
                        {/* Name (3 fields width) + Category */}
                        <Grid item xs={12} sm={12} md={9}>
                            <TextField fullWidth label="Dish Name" value={name} onChange={(e) => setName(e.target.value)} />
                        </Grid>

                        <Grid item xs={12} sm={12} md={3}>
                            <FormControl fullWidth disabled={loadingMeta}>
                                <InputLabel id="dish-cat-label">Category</InputLabel>
                                <Select
                                    labelId="dish-cat-label"
                                    value={category}
                                    label="Category"
                                    onChange={(e) => setCategory(e.target.value)}
                                    MenuProps={{ PaperProps: { style: { maxHeight: 320 } } }}
                                >
                                    {categoryOptions.map((c) => (
                                        <MenuItem key={c} value={c}>
                                            {c}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Items section */}
                        <Grid item xs={12}>
                            <Box sx={{ border: "1px dashed rgba(0,0,0,0.18)", borderRadius: 2, p: 2, mt: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                                    Items Used
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
                                        {/* Item select (2 fields width) */}
                                        <Grid item xs={12} sm={12} md={4}>
                                            <FormControl fullWidth disabled={loadingMeta}>
                                                <InputLabel id={`dish-item-${idx}`}>Item</InputLabel>
                                                <Select
                                                    labelId={`dish-item-${idx}`}
                                                    value={safeText(r.item_id)}
                                                    label="Item"
                                                    onChange={(e) => updateRow(idx, { item_id: e.target.value })}
                                                    MenuProps={{ PaperProps: { style: { maxHeight: 360 } } }}
                                                >
                                                    <MenuItem value="">
                                                        <em>Select</em>
                                                    </MenuItem>
                                                    {itemOptions.map((it) => (
                                                        <MenuItem key={it.id} value={it.id}>
                                                            {it.name} {it.unit ? `(${it.unit})` : ""}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Qty (min 1) */}
                                        <Grid item xs={12} sm={6} md={3}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Qty"
                                                inputProps={{ min: 1, step: "any" }}
                                                value={safeText(r.qty)}
                                                onChange={(e) => updateRow(idx, { qty: e.target.value })}
                                            // helperText="Min 1"
                                            />
                                        </Grid>

                                        {/* Unit (read-only) */}
                                        <Grid item xs={12} sm={4} md={3}>
                                            <TextField fullWidth label="Unit" value={getUnitForItem(r.item_id)} InputProps={{ readOnly: true }} />
                                        </Grid>

                                        {/* Action remove */}
                                        <Grid item xs={12} sm={2} md={1} sx={{ textAlign: { xs: "left", md: "right" } }}>
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
